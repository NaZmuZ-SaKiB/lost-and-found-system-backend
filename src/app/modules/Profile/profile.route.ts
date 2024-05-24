import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ProfileValidation } from "./profile.validation";
import { ProfileController } from "./profile.controller";

const router = Router();

// PUT
router.put(
  "/my-profile",
  auth,
  validateRequest(ProfileValidation.updateProfile as any),
  ProfileController.updateProfile
);

export const ProfileRoutes = router;
