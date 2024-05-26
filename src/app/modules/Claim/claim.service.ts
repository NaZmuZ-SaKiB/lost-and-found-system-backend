import prisma from "../../utils/prisma";
import { ClaimStatus, Prisma } from "@prisma/client";
import { TCreateClaimPayload } from "./claim.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createClaim = async (payload: TCreateClaimPayload, userId: string) => {
  // If no found item with given info, throw error
  await prisma.foundItem.findUniqueOrThrow({
    where: {
      id: payload.foundItemId,
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.claim.create({
    data: { ...payload, userId },
  });

  return result;
};

const getAllClaims = async (query: Record<string, unknown>) => {
  // Handling Pagination
  const page: number = Number(query?.page) || 1;
  const limit: number = Number(query?.limit) || 5;
  const skip: number = (page - 1) * limit;

  // Handling Filters
  const andConditions: Prisma.ClaimWhereInput[] = [];

  // Filter by userId
  if (query?.userId) {
    andConditions.push({
      userId: {
        equals: query?.userId as string,
      },
    });
  }

  const whereConditions: Prisma.ClaimWhereInput = { AND: andConditions };

  const claims = await prisma.claim.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      foundItem: {
        include: {
          category: true,
        },
      },
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
    },
  });

  const total = await prisma.claim.count({
    where: whereConditions,
  });

  return { meta: { page, limit, total }, data: claims };
};

const updateClaimStatus = async (
  userId: string,
  claimId: string,
  payload: { status: ClaimStatus }
) => {
  // if no claim with claimId, throw error
  const claim = await prisma.claim.findUniqueOrThrow({
    where: {
      id: claimId,
    },
    select: {
      id: true,
      status: true,
      foundItem: {
        select: {
          id: true,
          userId: true,
          returned: true,
        },
      },
    },
  });

  if (claim.foundItem.userId !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized to update this Claim."
    );
  }

  if (claim.foundItem.returned && claim.status === "APPROVED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Approved This item.");
  }

  if (claim.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can not update status after Aproving or Rejecting Claim."
    );
  }

  // const result = await prisma.claim.update({
  //   where: {
  //     id: claimId,
  //   },
  //   data: payload,
  // });

  const result = await prisma.$transaction(async (transactionClient) => {
    const update = await transactionClient.claim.update({
      where: {
        id: claimId,
      },
      data: payload,
    });

    if (payload.status === "APPROVED") {
      await transactionClient.foundItem.update({
        where: {
          id: claim.foundItem.id,
        },
        data: {
          returned: true,
        },
      });
    }

    return update;
  });

  return result;
};

const deleteClaim = async (userId: string, claimId: string) => {
  const claim = await prisma.claim.findUnique({
    where: {
      id: claimId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!claim) {
    throw new AppError(httpStatus.NOT_FOUND, "Claim not found");
  }

  if (claim.userId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unauthorized to delete this claim."
    );
  }

  await prisma.claim.delete({
    where: {
      id: claimId,
    },
  });

  return null;
};

export const ClaimService = {
  createClaim,
  getAllClaims,
  updateClaimStatus,
  deleteClaim,
};
