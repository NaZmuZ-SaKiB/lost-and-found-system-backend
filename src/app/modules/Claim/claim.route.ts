import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ClaimValidation } from "./claim.validation";
import { ClaimController } from "./claim.controller";

const router = Router();

// GET
router.get("/", ClaimController.getAllClaims);

// POST
router.post(
  "/",
  auth(),
  validateRequest(ClaimValidation.create),
  ClaimController.createClaim
);

// PATCH
router.patch(
  "/status/:claimId",
  auth(),
  validateRequest(ClaimValidation.updateStatus),
  ClaimController.updateClaimStatus
);

// Delete
router.delete("/:claimId", auth(), ClaimController.deleteClaim);

export const ClaimRoutes = router;
