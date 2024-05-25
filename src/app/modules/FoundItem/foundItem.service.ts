import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { FoundItemConstants } from "./foundItem.constant";
import { TReportFoundItemPayload } from "./foundItem.interface";
import { TSortOrder } from "../../interfaces";

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

export const FoundItemService = {
  getAllFoundItems,
  reportFoundItem,
};
