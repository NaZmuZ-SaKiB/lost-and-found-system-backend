import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FoundItemService } from "./foundItem.service";
import { Request } from "express";

const getAllFoundItems = catchAsync(async (req, res) => {
  const result = await FoundItemService.getAllFoundItems(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Found items retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const reportFoundItem = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await FoundItemService.reportFoundItem(
      req.body,
      req.user.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Found item reported successfully",
      data: result,
    });
  }
);

export const FoundItemController = {
  getAllFoundItems,
  reportFoundItem,
};