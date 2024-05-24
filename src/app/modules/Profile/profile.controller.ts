import { Request } from "express";
import catchAsync from "../../utils/catchAsync";
import { ProfileService } from "./profile.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const updateProfile = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await ProfileService.updateProfile(req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  updateProfile,
};
