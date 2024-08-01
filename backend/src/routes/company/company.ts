import { Router } from "express";
import {
  getCompany,
  updateCompany,
  deleteCompnay,
  registerCompany,
  loginCompany,
} from "./services/company";

import upload from "../../middelware/upload";

const router = Router();

router
  .route("/")
  .get(getCompany)
  .patch(upload.single("image"), updateCompany)
  .delete(deleteCompnay);

router.post("/register", upload.single("image"), registerCompany);

router.post("/login", loginCompany);

export default router;
