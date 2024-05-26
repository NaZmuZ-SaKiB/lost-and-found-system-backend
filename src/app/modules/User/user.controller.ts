import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import { Request } from "express";
import config from "../../config";

const getMyProfile = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await UserService.getMyProfile(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserService(req.body);

  res.cookie("jwt", result.token, {
    httpOnly: true,
    secure: config.node_env === "production",
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await UserService.loginService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await UserService.changePasswordService(
      req.user.id,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const getDashboardData = catchAsync(async (req, res) => {
  const result = await UserService.getDashboardData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard data received",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await UserService.getAllUsers(req?.user?.id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data received",
    data: result.data,
    meta: result.meta,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await UserService.updateUserStatus(req.params?.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated",
    data: result,
  });
});

const toggleUserRole = catchAsync(async (req, res) => {
  const result = await UserService.toggleUserRole(req.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated",
    data: result,
  });
});

export const UserController = {
  createUser,
  login,
  getMyProfile,
  changePassword,
  getDashboardData,
  getAllUsers,
  updateUserStatus,
  toggleUserRole,
};
