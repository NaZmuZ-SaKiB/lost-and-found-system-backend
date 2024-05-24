import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { TCreateUserPayload } from "./user.interface";

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

export const UserService = {
  createUserService,
  loginService,
  getMyProfile,
};
