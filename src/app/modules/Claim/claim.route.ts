import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ClaimValidation } from "./claim.validation";
import { ClaimController } from "./claim.controller";

const router = Router();

// GET
router.get("/claims", auth, ClaimController.getAllClaims);

// POST
router.post(
  "/claims",
  auth,
  validateRequest(ClaimValidation.create),
  ClaimController.createClaim
);

// PUT
router.put(
  "/claims/:claimId",
  auth,
  validateRequest(ClaimValidation.updateStatus),
  ClaimController.updateClaimStatus
);

export const ClaimRoutes = router;
