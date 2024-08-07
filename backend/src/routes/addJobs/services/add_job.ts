import { Router, Request, Response, NextFunction } from "express";
import db from "../../../config/db";
import { responder, errorLog } from "../../../middelware/response";
import { verify } from "crypto";

const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: any = req.query.id;
    if (id > 0) {
      const getJobByID = await db("addJob")
        .where("addJob.id", id)
        .join("category", "addJob.category_id", "category.id")
        .leftJoin("company", "addJob.company_id", "company.id")
        .select(
          "addJob.*",
          "category.category_name",
          "category.accepted",
          "company.name_of_company",
          "company.company_email",
          "company.image",
          "company.company_address"
        )
        .first();
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
      const getAllJob = await db("addJob")
        .join("category", "addJob.category_id", "category.id")
        .leftJoin("company", "addJob.company_id", "company.id")
        .select(
          "addJob.*",
          "category.category_name",
          "category.accepted",
          "company.name_of_company",
          "company.company_email",
          "company.image",
          "company.company_address"
        );
      if (getAllJob) {
        return res.status(200).json(responder(true, `All job`, getAllJob));
      } else {
        return res.status(404).json(responder(false, "there is no job added"));
      }
    }
    //! for user
    if (!id) {
      const getAllJobForUser = await db("addJob")
        .where("verify", true)
        .join("category", "addJob.category_id", "category.id")
        .leftJoin("company", "addJob.company_id", "company.id")
        .select(
          "addJob.*",
          "category.category_name",
          "category.accepted",
          "company.name_of_company",
          "company.company_email",
          "company.image",
          "company.company_address"
        );
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
};

const updatejob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    if (id) {
      const exits = await db("addJob").where({ id }).first();
      if (exits) {
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
          verify,
          category_id,
        } = req.body;
        await db("addJob").where({ id }).update({
          title,
          job_description,
          job_summary,
          time,
          gender,
          salary,
          position,
          no_of_vacancies,
          starting_date,
          ending_date,
          education_required,
          skills,
          verify,
          category_id,
        });
        res
          .status(202)
          .json(responder(true, `Job updated sucessfully on id: ${id}`));
      } else {
        return res
          .status(404)
          .json(responder(false, `There is no job on id ${id}`));
      }
    } else {
      return res
        .status(403)
        .json(responder(false, "This method is not allowed"));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    const exist = await db("addJob").where({ id }).first();
    if (exist) {
      await db("addJob").where({ id }).del();
      return res
        .status(202)
        .json(responder(true, `Job deleted sucessfully on id ${id}`));
    } else {
      return res
        .status(404)
        .json(responder(false, `There is no job to delete on id ${id}`));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const addJob = async (req: Request, res: Response, next: NextFunction) => {
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
      verify,
    } = req.body;
    const company = await db("company").where("id", company_id).first();
    if (company) {
      if (!title) {
        return res.status(400).json(responder(false, "Title is missing"));
      }
      if (!position) {
        return res.status(400).json(responder(false, "Position is missing"));
      }
      if (!no_of_vacancies) {
        return res.status(400).json(responder(false, "Vacancies is empty"));
      }
      if (!salary) {
        return res.status(400).json(responder(false, "Salary is missing"));
      }
      const validTimes = ["fulltime", "parttime", "contract"];
      if (!validTimes.includes(time?.toLowerCase())) {
        return res.status(400).json(responder(false, "Please insert the time"));
      }
      const validGenders = ["male", "female", "others", "both"];
      if (!validGenders.includes(gender?.toLowerCase())) {
        return res.status(400).json(responder(false, "Please select gender"));
      }
      if (!starting_date) {
        return res
          .status(400)
          .json(responder(false, "Started date is missing"));
      }
      if (!ending_date) {
        return res.status(400).json(responder(false, "ending date is missing"));
      }

      if (!education_required) {
        return res
          .status(400)
          .json(responder(false, "Eductaion field is empty"));
      }
      if (!job_description) {
        return res
          .status(400)
          .json(responder(false, "Write description about the job"));
      }
      if (!job_summary) {
        return res
          .status(400)
          .json(responder(false, "Write summary about your job"));
      }
      if (!skills) {
        return res
          .status(400)
          .json(responder(false, "write the skills required in your job"));
      }
      if (!category_id) {
        return res
          .status(400)
          .json(responder(false, "category field is missing"));
      }

      await db("addJob").insert({
        title,
        job_description,
        job_summary,
        time,
        gender,
        salary,
        position,
        no_of_vacancies,
        starting_date,
        ending_date,
        education_required,
        skills,
        verify,
        category_id,
        company_id: company_id,
      });
      res.status(201).json(responder(true, `Job create sucessfully`));
    } else {
      return res
        .status(404)
        .json(responder(false, `company has not bee registerd`));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const getJobsByCompanyID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company_id = req.params.company_id;
    const company = await db("company").where({ id: company_id }).first();
    if (company) {
      const jobs = await db("addJob")
        .where({ company_id: company_id })
        .join("category", "addJob.category_id", "category.id")
        .leftJoin("company", "addJob.company_id", "company.id")
        .select(
          "addJob.*",
          "category.category_name",
          "category.accepted",
          "company.name_of_company",
          "company.company_email",
          "company.image",
          "company.company_address"
        );
      res
        .status(202)
        .json(responder(true, `Jobs in company id: ${company_id}`, jobs));
    } else {
      return res.status(404).json(responder(false, `company ont register`));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};
export { getJobs, updatejob, addJob, deleteJob, getJobsByCompanyID };
