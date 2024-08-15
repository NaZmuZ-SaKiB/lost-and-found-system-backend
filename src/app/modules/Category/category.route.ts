import { Router } from "express";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

// GET
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// POST
router.post(
  "/",
  auth("ADMIN"),
  validateRequest(CategoryValidation.create),
  CategoryController.createCategory
);

// PATCH
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(CategoryValidation.create),
  CategoryController.updateCategory
);

export const CategoryRoutes = router;
