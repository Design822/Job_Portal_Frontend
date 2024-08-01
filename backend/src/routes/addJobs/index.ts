import { Router } from "express";
import addJob from "./add_job";
const router = Router();

router.use("/", addJob);

export default router;
