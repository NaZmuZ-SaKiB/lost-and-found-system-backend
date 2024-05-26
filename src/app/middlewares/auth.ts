import { Request } from "express";

import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import prisma from "../utils/prisma";
import { Role } from "@prisma/client";

const auth = (...roles: Role[]) => {
  return catchAsync(async (req: Request & { user?: any }, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in.");
    }

    let verifiedUser;

    try {
      verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt_token_secret as string
      );
    } catch (error) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Invalid Token. Might be expired."
      );
    }

    // If no user with user id then throw error
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: verifiedUser.id,
      },
      select: {
        id: true,
        status: true,
        role: true,
      },
    });

    if (user.status === "INACTIVE") {
      throw new AppError(httpStatus.UNAUTHORIZED, "Inactive User");
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
    }

    req.user = verifiedUser;

    next();
  });
};

export default auth;
