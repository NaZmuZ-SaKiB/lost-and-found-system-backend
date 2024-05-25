import { Request } from "express";
import catchAsync from "../../utils/catchAsync";
import { ClaimService } from "./claim.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllClaims = catchAsync(async (req, res) => {
  const result = await ClaimService.getAllClaims(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Claims retrieved successfully",
    data: result,
  });
});

const createClaim = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await ClaimService.createClaim(req.body, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Claim created successfully",
    data: result,
  });
});

const updateClaimStatus = catchAsync(async (req, res) => {
  const { claimId } = req.params;

  const result = await ClaimService.updateClaimStatus(claimId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Claim updated successfully",
    data: result,
  });
});

export const ClaimController = {
  createClaim,
  getAllClaims,
  updateClaimStatus,
};
