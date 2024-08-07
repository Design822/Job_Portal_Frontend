import { Router } from "express";
import {
  getJobs,
  updatejob,
  deleteJob,
  addJob,
  getJobsByCompanyID,
} from "./services/add_job";

const router = Router();

router.route("/").get(getJobs).patch(updatejob).delete(deleteJob);

router.route("/:company_id").get(getJobsByCompanyID).post(addJob);

export default router;
