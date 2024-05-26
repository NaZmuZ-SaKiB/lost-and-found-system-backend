import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { TCreateUserPayload } from "./user.interface";
import { UserStatus } from "@prisma/client";

const getMyProfile = async (userId: string) => {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  delete (profile as any).user.password;

  return profile;
};

const createUserService = async (payload: TCreateUserPayload) => {
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.email,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: userData,
    });
    delete (newUser as any).password;

    const newProfile = await transactionClient.userProfile.create({
      data: {
        userId: newUser.id,
        ...payload.profile,
      },
    });

    return { ...newUser, profile: newProfile };
  });

  const token = jwtHelpers.generateToken(
    { email: result.email, id: result.id, role: result.role },
    config.jwt_token_secret as string,
    config.jwt_token_expires_in as string
  );

  return { user: result, token };
};

const loginService = async (payload: { email: string; password: string }) => {
  const isUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      password: true,
      role: true,
      userProfile: {
        select: {
          name: true,
        },
      },
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    isUser.password
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Credentials.");
  }

  const token = jwtHelpers.generateToken(
    { email: payload.email, id: isUser.id, role: isUser.role },
    config.jwt_token_secret as string,
    config.jwt_token_expires_in as string
  );

  return {
    id: isUser.id,
    name: isUser?.userProfile?.name,
    email: payload.email,
    token,
  };
};

const changePasswordService = async (
  userId: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  const isUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    isUser.password
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Old Password.");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return null;
};

const getDashboardData = async () => {
  const users = await prisma.user.count({
    where: {
      status: "ACTIVE",
    },
  });
  const lostItems = await prisma.lostItem.count();
  const foundLostItems = await prisma.lostItem.count({
    where: {
      found: true,
    },
  });
  const foundItems = await prisma.foundItem.count();
  const returnedItems = await prisma.foundItem.count({
    where: {
      returned: true,
    },
  });
  const claims = await prisma.claim.count();

  return {
    userCount: users,
    lostItemCount: lostItems,
    foundItemCount: foundItems,
    returnedItemCount: foundLostItems + returnedItems,
    claimCount: claims,
  };
};

const getAllUsers = async (userId: string, query: Record<string, unknown>) => {
  // Handling Pagination
  const page: number = Number(query?.page) || 1;
  const limit: number = Number(query?.limit) || 5;
  const skip: number = (page - 1) * limit;

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: {
          equals: userId,
        },
      },
    },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      userProfile: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where: {
      id: {
        not: {
          equals: userId,
        },
      },
    },
  });

  return { meta: { page, limit, total }, data: users };
};

const updateUserStatus = async (
  userId: string,
  payload: {
    status: UserStatus;
  }
) => {
  await prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    select: { id: true },
  });

  return null;
};

const toggleUserRole = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: user.role === "ADMIN" ? "USER" : "ADMIN",
    },
    select: {
      id: true,
    },
  });

  return null;
};

export const UserService = {
  createUserService,
  loginService,
  getMyProfile,
  changePasswordService,
  getDashboardData,
  getAllUsers,
  updateUserStatus,
  toggleUserRole,
};
