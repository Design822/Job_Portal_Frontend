import { Router } from "express";
import { getJobs, updatejob, deleteJob, addJob } from "./services/add_job";

const router = Router();

router.route("/").get(getJobs).patch(updatejob).delete(deleteJob);

router.post("/:company_id", addJob);

export default router;
