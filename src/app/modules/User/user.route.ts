import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";

const router = Router();

// GET
router.get("/my-profile", auth(), UserController.getMyProfile);
router.get("/dashboard-data", auth("ADMIN"), UserController.getDashboardData);

// POST
router.post(
  "/register",
  validateRequest(UserValidation.create),
  UserController.createUser
);

router.post(
  "/login",
  validateRequest(UserValidation.login),
  UserController.login
);

// PUT
router.put(
  "/change-password",
  auth(),
  validateRequest(UserValidation.changePassword),
  UserController.changePassword
);

export const UserRoutes = router;
