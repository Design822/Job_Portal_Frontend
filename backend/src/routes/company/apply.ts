import { Router } from "express";
import {
  applyForJob,
  updatedViewBySeekerID,
  getAppliedSeekerByJobID,
} from "./services/apply";

const router = Router();

router.route("/:addJob_id").get(getAppliedSeekerByJobID).post(applyForJob);
router.route("/:job_seeker_id").patch(updatedViewBySeekerID);

export default router;
