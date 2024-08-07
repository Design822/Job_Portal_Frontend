import { Router } from "express";
import companyRoutes from "./company";
import applyRoute from "./apply";
const router = Router();

router.use("/", companyRoutes);
router.use("/apply", applyRoute);

export default router;
