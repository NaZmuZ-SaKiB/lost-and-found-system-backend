import { Request } from "express";

import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import prisma from "../utils/prisma";

const auth = catchAsync(async (req: Request & { user?: any }, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in.");
  }

  try {
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt_token_secret as string
    );

    // If no user with user id then throw error
    await prisma.user.findUniqueOrThrow({
      where: {
        id: verifiedUser.id,
      },
      select: {
        id: true,
      },
    });

    req.user = verifiedUser;
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid Token. Might be expired."
    );
  }

  next();
});

export default auth;
