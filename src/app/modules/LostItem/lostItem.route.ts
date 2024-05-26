import { Router } from "express";
import { LostItemController } from "./lostItem.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { LostItemValidation } from "./lostItem.validation";

const router = Router();

// GET
router.get("/", LostItemController.getAllLostItems);

// POST
router.post(
  "/",
  auth,
  validateRequest(LostItemValidation.reportLostItem),
  LostItemController.reportLostItem
);

// PATCH
router.patch("/mark-found/:id", auth, LostItemController.markAsFound);

// Delete
router.delete("/:id", auth, LostItemController.deleteLostItem);

export const LostItemRoutes = router;
