import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TSortOrder } from "../../interfaces";
import { TReportLostItemPayload } from "./lostItem.interface";
import { LostItemConstants } from "./lostItem.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const reportLostItem = async (
  payload: TReportLostItemPayload,
  userId: string
) => {
  // if categoryId is wrong, throw error
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const result = await prisma.lostItem.create({
    data: { ...payload, userId, brand: payload.brand?.toLowerCase() },
    include: {
      user: true,
      category: true,
    },
  });

  delete (result as any).user.password;

  return result;
};

const getAllLostItems = async (query: Record<string, unknown>) => {
  // Handling Pagination
  const page: number = Number(query?.page) || 1;
  const limit: number = Number(query?.limit) || 5;
  const skip: number = (page - 1) * limit;

  // Handling Sorting
  const sortOrder: TSortOrder = LostItemConstants.validSortOrders.includes(
    query?.sortOrder as any
  )
    ? (query.sortOrder as TSortOrder)
    : "desc";

  // Custom Sort Order object
  let orderBy: Prisma.FoundItemOrderByWithRelationInput = {
    createdAt: sortOrder,
  };

  // Handling Sort Order according to its type
  if (
    query?.sortBy &&
    LostItemConstants.sortableFields.includes(query.sortBy as string) &&
    query?.sortBy !== "lostDate"
  ) {
    if (query?.sortBy === "category") {
      orderBy = {
        category: {
          name: sortOrder,
        },
      };
    } else {
      orderBy = {
        [query.sortBy as string]: sortOrder,
      };
    }
  }

  // Handling Filters
  const andConditions: Prisma.LostItemWhereInput[] = [];

  // Filter By Search
  if (query?.searchTerm) {
    andConditions.push({
      OR: LostItemConstants.searchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter by Found Item Name
  if (query?.foundItemName) {
    andConditions.push({
      lostItemName: {
        equals: query.lostItemName as string,
      },
    });
  }

  // Filter by userId
  if (query?.userId) {
    andConditions.push({
      userId: {
        equals: query?.userId as string,
      },
    });
  }

  // Filter by categoryId
  if (query?.category) {
    andConditions.push({
      categoryId: query?.category,
    });
  }

  const whereConditions: Prisma.LostItemWhereInput = { AND: andConditions };
  const result = await prisma.lostItem.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      lostItemName: true,
      description: true,
      brand: true,
      contactNo: true,
      found: true,
      image: true,
      location: true,
      lostDate: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          userProfile: {
            select: {
              name: true,
              contactNo: true,
            },
          },
        },
      },
      category: true,
    },
  });

  const total = await prisma.lostItem.count({
    where: whereConditions,
  });

  return { meta: { page, limit, total }, data: result };
};

const getLostItemById = async (id: string) => {
  const result = await prisma.lostItem.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          userProfile: {
            select: {
              name: true,
              contactNo: true,
            },
          },
        },
      },
      category: true,
    },
  });

  return result;
};

const deleteLostItem = async (userId: string, lostItemId: string) => {
  const lostItem = await prisma.lostItem.findUnique({
    where: {
      id: lostItemId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!lostItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Lost Item not found");
  }

  if (lostItem.userId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unauthorized to delete this lost item."
    );
  }

  await prisma.lostItem.delete({
    where: {
      id: lostItemId,
    },
    select: {
      id: true,
    },
  });

  return null;
};

const markAsFound = async (userId: string, lostItemId: string) => {
  const lostItem = await prisma.lostItem.findUnique({
    where: {
      id: lostItemId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!lostItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Lost Item Not Found");
  }

  if (lostItem.userId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unauthorized to update this lost item."
    );
  }

  await prisma.lostItem.update({
    where: {
      id: lostItemId,
    },
    data: {
      found: true,
    },
    select: {
      id: true,
    },
  });

  return null;
};

export const LostItemService = {
  getAllLostItems,
  getLostItemById,
  reportLostItem,
  deleteLostItem,
  markAsFound,
};
