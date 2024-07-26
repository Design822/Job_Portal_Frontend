import { Router } from "express";
import {
  getCategory,
  createCategory,
  updateCategoryByID,
  deleteCategoryByID,
} from "./services/category";

const router = Router();

router
  .route("/")
  .get(getCategory)
  .post(createCategory)
  .patch(updateCategoryByID)
  .delete(deleteCategoryByID);

export default router;
