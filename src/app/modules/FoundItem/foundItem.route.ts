import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FoundItemValidation } from "./foundItem.validation";
import { FoundItemController } from "./foundItem.controller";

const router = Router();

// GET
router.get("/", FoundItemController.getAllFoundItems);

// POST
router.post(
  "/",
  auth,
  validateRequest(FoundItemValidation.reportFoundItem),
  FoundItemController.reportFoundItem
);

export const FoundItemRoutes = router;
