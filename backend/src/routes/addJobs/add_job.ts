import { Router, Request, Response, NextFunction } from "express";
import db from "../../config/db";
import { responder, errorLog } from "../../middelware/response";

const router = Router();

router
  .route("/")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: any = req.query.id;
      if (id > 0) {
        const getJobByID = await db("addJob").where({ id }).first();
        if (getJobByID) {
          return res
            .status(202)
            .json(responder(true, `Job on id ${id}`, getJobByID));
        } else {
          return res
            .status(404)
            .json(responder(false, `There is no job added on id: ${id}`));
        }
        //!for admin
      }
      if (id == 0) {
        const getAllJob = await db("addJob").select("*");
        if (getAllJob) {
          return res.status(200).json(responder(true, `All job`, getAllJob));
        } else {
          return res
            .status(404)
            .json(responder(false, "there is no job added"));
        }
      }
      //! for user
      if (!id) {
        const getAllJobForUser = await db("addJob")
          .where("verify", true)
          .select("*");
        if (getAllJobForUser) {
          return res
            .status(202)
            .json(responder(true, `All verified jobs`, getAllJobForUser));
        } else {
          return res
            .status(404)
            .json(responder(false, `There are no jobs that are verify`));
        }
      }
    } catch (error) {
      errorLog(error, res, next);
    }
  });

router.post(
  "/:company_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const company_id = req.params.company_id;
      const {
        title,
        position,
        no_of_vacancies,
        salary,
        time,
        starting_date,
        ending_date,
        gender,
        education_required,
        job_summary,
        job_description,
        skills,
        category_id,
      } = req.body;
      if (!title) {
        return res.status(403).json(responder(false, "Title is missing"));
      }
      if (!position) {
        return res.status(403).json(responder(false, "Position is missing"));
      }
      if (!no_of_vacancies) {
        return res.status(403).json(responder(false, "Vacancies is empty"));
      }
      if (!salary) {
        return res.status(403).json(responder(false, "Salary is missing"));
      }
      if (time !== "fulltime" || "parttime" || "contract") {
        return res.status(403).json(responder(false, "please insert the time"));
      }
      if (!starting_date) {
        return res
          .status(403)
          .json(responder(false, "Started date is missing"));
      }
      if (!ending_date) {
        return res.status(403).json(responder(false, "ending date is missing"));
      }
      if (gender !== "male" || "female" || "others") {
        return res.status(403).json(responder(false, "Please select gender"));
      }
      if (!education_required) {
        return res
          .status(403)
          .json(responder(false, "Eductaion field is empty"));
      }
      if (!job_description) {
        return res
          .status(403)
          .json(responder(false, "Write description about the job"));
      }
      if (!job_summary) {
        return res
          .status(403)
          .json(responder(false, "Write summary about your job"));
      }
      if (!skills) {
        return res
          .status(403)
          .json(responder(false, "write the skills required in your job"));
      }
      if (!category_id) {
        return res
          .status(403)
          .json(responder(false, "category field is missing"));
      }
    } catch (error) {
      errorLog(error, res, next);
    }
  }
);

export default router;
