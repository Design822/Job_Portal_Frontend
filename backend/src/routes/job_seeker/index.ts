import { Router } from "express";
import jobSeekerRoute from "./job_seeker";
const router = Router();

router.use("/", jobSeekerRoute);

export default router;
