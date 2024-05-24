import { Router } from "express";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

// POST
router.post(
  "/found-item-categories",
  auth,
  validateRequest(CategoryValidation.create),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
