import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FoundItemValidation } from "./foundItem.validation";
import { FoundItemController } from "./foundItem.controller";

const router = Router();

// GET
router.get("/found-items", FoundItemController.getAllFoundItems);

// POST
router.post(
  "/found-items",
  auth,
  validateRequest(FoundItemValidation.reportFoundItem),
  FoundItemController.reportFoundItem
);

export const FoundItemRoutes = router;
