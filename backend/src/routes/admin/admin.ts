import { Router } from "express";
import {
  getAdmin,
  registerAdmin,
  loginAdmin,
  deleteAdminByID,
  updateAdmin,
} from "./services/admin";

const router = Router();

router.route("/").get(getAdmin).patch(updateAdmin).delete(deleteAdminByID);

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

export default router;
