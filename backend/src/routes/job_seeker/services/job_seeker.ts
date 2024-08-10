import { Request, Response, NextFunction, Router } from "express";
import db from "../../../config/db";
import { responder, errorLog } from "../../../middelware/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id;
    if (id) {
      const getJobSeekerByID = await db("job_seeker").where({ id }).first();
      if (getJobSeekerByID) {
        return res
          .status(202)
          .json(responder(true, `job seeker on id: ${id}`, getJobSeekerByID));
      } else {
        return res
          .status(404)
          .json(responder(false, `There are no seeker register on id: ${id}`));
      }
    } else {
      const getAllJobSeeker = await db("job_seeker").select("*");
      if (getAllJobSeeker) {
        return res
          .status(200)
          .json(
            responder(true, "Job Seeker that are register", getAllJobSeeker)
          );
      } else {
        return res
          .status(404)
          .json(responder(false, "There are no Job Seeker Register"));
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const updateJobSeekerID = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id;
    const {
      first_name,
      last_name,
      email_address,
      contact_number,
      profile_pic,
      cv,
      address,
      gender,
      post,
    } = req.body;

    const [jobSeeker] = await db("job_seeker").where({ id }).select("*");
    if (!jobSeeker) {
      return res
        .status(404)
        .json(
          responder(false, `There is no job seeker registered on id :${id}`)
        );
    } else {
      const updatedData = {
        first_name: first_name || jobSeeker.first_name,
        last_name: last_name || jobSeeker.last_name,
        email_address: email_address || jobSeeker.email_address,
        contact_number: contact_number || jobSeeker.contact_number,
        profile_pic: profile_pic || jobSeeker.profile_pic,
        address: address || jobSeeker.address,
        gender: gender || jobSeeker.gender,
        post: post || jobSeeker.post,
        cv: cv || jobSeeker.cv,
      };

      if (req.files) {
        if (req.files.profile_pic) {
          updatedData.profile_pic = req.files.profile_pic.map(
            (file: any) => file.filename
          );
        }
        if (req.files.cv) {
          updatedData.cv = req.files.cv.map((file: any) => file.filename);
        }
      }

      await db("job_seeker").where({ id }).update(updatedData);

      return res
        .status(202)
        .json(responder(true, `Job seeker updated successfully on id: ${id}`));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const deleteJobSeekerByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id;
    if (id) {
      const deleteJobSeeker = await db("job_seeker").where({ id }).del();
      if (deleteJobSeeker) {
        return res
          .status(202)
          .json(responder(false, `Job seeker delete at id: ${id} sucessfully`));
      } else {
        return res
          .status(404)
          .json(
            responder(false, `There is no Job Seeker to delete on id:${id}`)
          );
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const registerJobSeeker = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      first_name,
      last_name,
      address,
      contact_number,
      email_address,
      gender,
      post,
      conformPassword,
      password,
    } = req.body;
    const profilePic = req.files.profile_pic.map((file: any) => file.filename);
    const cv = req.files.cv.map((file: any) => file.filename);

    if (!post) {
      return res
        .status(400)
        .json(
          responder(false, `Please write which postion you are applying for`)
        );
    }
    if (!gender) {
      return res.status(400).json(responder(false, `Please select gender`));
    }
    if (!profilePic) {
      return req
        .status(400)
        .json(responder(false, `Please upload  profile_pic`));
    }
    if (!first_name) {
      return res
        .status(400)
        .json(responder(false, "Please write the First name"));
    }
    if (!last_name) {
      return res.status(400).json(responder(false, "Please write Last name"));
    }
    if (!email_address) {
      return res
        .status(400)
        .json(responder(false, "Please write  email address"));
    }
    if (!contact_number) {
      return res
        .status(400)
        .json(responder(false, "Please write the contact number "));
    }
    if (!password) {
      return res.status(400).json(responder(false, "Please write password "));
    }
    if (!conformPassword) {
      return res
        .status(400)
        .json(responder(false, "Please put conform your password"));
    }
    const email = await db("job_seeker")
      .where({ email_address: address })
      .first();
    if (email) {
      return res
        .status(409)
        .json(responder(false, "email address already exits"));
    }
    if (password !== conformPassword) {
      return res.status(400).json(responder(false, "Password doesn't match"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db("job_seeker")
      .insert({
        first_name,
        last_name,
        contact_number,
        address,
        post,
        gender,
        email_address,
        password: hashedPassword,
        profile_pic: profilePic,
        cv: cv,
      })
      .then(() => {
        return res
          .status(201)
          .json(responder(true, "Your have been register sucessfully"));
      })
      .catch((error) => {
        errorLog(error, res, next);
      });
  } catch (error) {
    errorLog(error, res, next);
  }
};

const loginJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email_address, password } = req.body;
    await db("job_seeker")
      .where({ email_address })
      .first()
      .then(async (user) => {
        if (!user) {
          return res
            .status(401)
            .json(responder(false, `This email hasn't been register`));
        } else {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res
              .status(401)
              .json(
                responder(false, `Your password doesn't match please try again`)
              );
          } else {
            const secret = process.env.SECRET!;
            const token = jwt.sign({ user, role: "job_seeker" }, secret, {
              expiresIn: "1D",
            });
            res.status(202).json({ messege: "Login sucessfully", token });
          }
        }
      });
  } catch (error) {
    errorLog(error, res, next);
  }
};

export {
  getJobSeeker,
  updateJobSeekerID,
  deleteJobSeekerByID,
  registerJobSeeker,
  loginJobSeeker,
};
