import { Router } from "express";
import adminRouter from "./admin";

const router = Router();

router.use("/", adminRouter);

export default router;
