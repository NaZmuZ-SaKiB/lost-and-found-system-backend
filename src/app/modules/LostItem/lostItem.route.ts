import { Router } from "express";
import { LostItemController } from "./lostItem.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { LostItemValidation } from "./lostItem.validation";

const router = Router();

// GET
router.get("/found-items", LostItemController.getAllLostItems);

// POST
router.post(
  "/found-items",
  auth,
  validateRequest(LostItemValidation.reportLostItem),
  LostItemController.reportLostItem
);
