import prisma from "../../utils/prisma";
import { ClaimStatus } from "@prisma/client";
import { TCreateClaimPayload } from "./claim.interface";

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

const getAllClaims = async () => {
  const claims = await prisma.claim.findMany({
    include: {
      foundItem: {
        include: {
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
      },
    },
  });

  return claims;
};

const updateClaimStatus = async (
  claimId: string,
  payload: { status: ClaimStatus }
) => {
  // if no claim with claimId, throw error
  await prisma.claim.findUniqueOrThrow({
    where: {
      id: claimId,
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.claim.update({
    where: {
      id: claimId,
    },
    data: payload,
  });

  return result;
};

export const ClaimService = {
  createClaim,
  getAllClaims,
  updateClaimStatus,
};
