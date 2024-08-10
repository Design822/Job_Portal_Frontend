import { Router } from "express";
import companyRoutes from "./company";
import applyRoute from "./apply";
import addJobRoute from "./add_job";
const router = Router();

router.use("/", companyRoutes);
router.use("/apply", applyRoute);
router.use("/add", addJobRoute);
export default router;
