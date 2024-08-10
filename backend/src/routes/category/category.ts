import { Router } from "express";
import {
  getCategory,
  createCategory,
  updateCategoryByID,
  deleteCategoryByID,
  getJobsByCategoryID,
} from "./services/category";

const router = Router();

router
  .route("/")
  .get(getCategory)
  .post(createCategory)
  .patch(updateCategoryByID)
  .delete(deleteCategoryByID);

router.get("/jobs_by_category", getJobsByCategoryID);

export default router;
