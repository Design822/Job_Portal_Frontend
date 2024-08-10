import { Request, Response, NextFunction, Router } from "express";
import db from "../../../config/db";
import { responder, errorLog } from "../../../middelware/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    if (id) {
      const getAdminByID = await db("admin").where({ id }).first();
      if (getAdminByID) {
        return res
          .status(202)
          .json(responder(true, `Admin on id: ${id}`, getAdminByID));
      } else {
        return res
          .status(404)
          .json(responder(false, `There is no Admin in id: ${id}`));
      }
    } else {
      const getAllAdmin = await db("admin").select("*");
      if (getAllAdmin) {
        return res
          .status(200)
          .json(responder(true, "Admins that are register", getAllAdmin));
      } else {
        return res
          .status(404)
          .json(responder(false, "There are no Admin Register"));
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const updateAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    const { email } = req.body;

    const [admin] = await db("admin").where({ id }).select("*");
    if (!admin) {
      return res
        .status(404)
        .json(responder(false, `There is no admin registered on id :${id}`));
    } else {
      await db("admin")
        .where({ id })
        .update({
          email: email || admin.email,
        });

      return res
        .status(202)
        .json(responder(true, `Admin updated successfully on id: ${id}`));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const deleteAdminByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id;
    if (id) {
      const deleteAdmin = await db("admin").where({ id }).del();
      if (deleteAdmin) {
        return res
          .status(202)
          .json(responder(false, `Admin delete at id: ${id} sucessfully`));
      } else {
        return res
          .status(404)
          .json(responder(false, `There is no admin to delete on id:${id}`));
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const registerAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { email, conformPassword, password } = req.body;

    if (!email) {
      return res.status(400).json(responder(false, "Please write the email"));
    }

    if (!password) {
      return res.status(400).json(responder(false, "Please write password "));
    }
    if (!conformPassword) {
      return res
        .status(400)
        .json(responder(false, "Please put conform your password"));
    }
    const email_address = await db("email").where({ email }).first();
    if (email_address) {
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
        email,
        password: hashedPassword,
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

const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    await db("email")
      .where({ email })
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
            const token = jwt.sign({ user, role: "admin" }, secret, {
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

export { getAdmin, updateAdmin, deleteAdminByID, registerAdmin, loginAdmin };
