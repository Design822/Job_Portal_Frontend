import { Router } from "express";
import cateygoryController from "./category";

const router = Router();

router.use("/", cateygoryController);

export default router;
