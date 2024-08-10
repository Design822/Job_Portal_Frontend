import { Router } from "express";
import {
  getJobSeeker,
  updateJobSeekerID,
  deleteJobSeekerByID,
  registerJobSeeker,
  loginJobSeeker,
} from "./services/job_seeker";

import upload from "../../middelware/upload";

const router = Router();

router
  .route("/")
  .get(getJobSeeker)
  .patch(
    upload.fields([
      { name: "profile_pic", maxCount: 1 },
      { name: "cv", maxCount: 1 },
    ]),
    updateJobSeekerID
  )
  .delete(deleteJobSeekerByID);

router.post(
  "/register",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  registerJobSeeker
);

router.post("/login", loginJobSeeker);

export default router;
