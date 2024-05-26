import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LostItemService } from "./lostItem.service";
import { Request } from "express";

const getAllLostItems = catchAsync(async (req, res) => {
  const result = await LostItemService.getAllLostItems(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Lost items retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const reportLostItem = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await LostItemService.reportLostItem(req.body, req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Lost item reported successfully",
      data: result,
    });
  }
);

const deleteLostItem = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await LostItemService.deleteLostItem(
      req.user.id,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Lost Item deleted successfully",
      data: result,
    });
  }
);

const markAsFound = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await LostItemService.markAsFound(req.user.id, req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Lost Item updated successfully",
    data: result,
  });
});

export const LostItemController = {
  getAllLostItems,
  reportLostItem,
  deleteLostItem,
  markAsFound,
};
