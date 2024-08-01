import { Router } from "express";
import companyRoutes from "./company";
const router = Router();

router.use("/", companyRoutes);

export default router;
