import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { FoundItemConstants } from "./foundItem.constant";
import { TReportFoundItemPayload } from "./foundItem.interface";
import { TSortOrder } from "../../interfaces";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const reportFoundItem = async (
  payload: TReportFoundItemPayload,
  userId: string
) => {
  // if categoryId is wrong, throw error
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const result = await prisma.foundItem.create({
    data: { ...payload, userId, brand: payload.brand?.toLowerCase() },
    include: {
      user: true,
      category: true,
    },
  });

  delete (result as any).user.password;

  return result;
};

const getAllFoundItems = async (query: Record<string, unknown>) => {
  // Handling Pagination
  const page: number = Number(query?.page) || 1;
  const limit: number = Number(query?.limit) || 5;
  const skip: number = (page - 1) * limit;

  // Handling Sorting
  const sortOrder: TSortOrder = FoundItemConstants.validSortOrders.includes(
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
    FoundItemConstants.sortableFields.includes(query.sortBy as string) &&
    query?.sortBy !== "foundDate"
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
  const andConditions: Prisma.FoundItemWhereInput[] = [];

  // Filter By Search
  if (query?.searchTerm) {
    andConditions.push({
      OR: FoundItemConstants.searchableFields.map((field) => ({
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
      foundItemName: {
        equals: query.foundItemName as string,
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

  const whereConditions: Prisma.FoundItemWhereInput = { AND: andConditions };
  const result = await prisma.foundItem.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      foundItemName: true,
      description: true,
      location: true,
      foundDate: true,
      claimProcess: true,
      contactNo: true,
      brand: true,
      createdAt: true,
      updatedAt: true,
      returned: true,
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

  const total = await prisma.foundItem.count({
    where: whereConditions,
  });

  return { meta: { page, limit, total }, data: result };
};

const getFoundItemById = async (id: string) => {
  const result = await prisma.foundItem.findUnique({
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

const isFoundItemClaimedByMe = async (userId: string, foundItemId: string) => {
  const claim = await prisma.claim.findFirst({
    where: {
      foundItemId,
      userId,
    },
    select: { id: true },
  });

  if (claim) {
    return { claimed: true };
  } else {
    return { claimed: false };
  }
};

const deleteFoundItem = async (userId: string, foundItemId: string) => {
  const foundItem = await prisma.foundItem.findUnique({
    where: {
      id: foundItemId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!foundItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Found Item not found");
  }

  if (foundItem.userId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unauthorized to delete this found item."
    );
  }

  await prisma.foundItem.delete({
    where: {
      id: foundItemId,
    },
  });

  return null;
};

export const FoundItemService = {
  getAllFoundItems,
  reportFoundItem,
  getFoundItemById,
  isFoundItemClaimedByMe,
  deleteFoundItem,
};
