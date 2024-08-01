import { Request, Response, NextFunction, Router } from "express";
import db from "../../../config/db";
import { responder, errorLog } from "../../../middelware/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    if (id) {
      const getCompanyByID = await db("company").where({ id }).first();
      if (getCompanyByID) {
        return res
          .status(202)
          .json(responder(true, `Company on id: ${id}`, getCompanyByID));
      } else {
        return res
          .status(404)
          .json(responder(false, `There is no company register on id: ${id}`));
      }
    } else {
      const getAllComapny = await db("company").select("*");
      if (getAllComapny) {
        return res
          .status(200)
          .json(responder(true, "Company that are register", getAllComapny));
      } else {
        return res
          .status(404)
          .json(responder(false, "There are no Company Register"));
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const updateCompany = async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    const { name_of_company, phone, company_email, company_address, image } =
      req.body;

    const [company] = await db("company").where({ id }).select("*");
    if (!company) {
      return res
        .status(404)
        .json(responder(false, `There is no company registered on id :${id}`));
    } else {
      const updatedData = {
        name_of_company: name_of_company || company.name_of_company,
        phone: phone || company.phone,
        company_email: company_email || company.company_email,
        company_address: company_address || company.company_address,
        image: image || company.image,
      };

      if (req.file) {
        updatedData.image = req.file.filename;
      }

      await db("company").where({ id }).update(updatedData);

      return res
        .status(202)
        .json(responder(true, `Company updated successfully on id: ${id}`));
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const deleteCompnay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id;
    if (id) {
      const deleteCompany = await db("company").where({ id }).del();
      if (deleteCompany) {
        return res
          .status(202)
          .json(responder(false, `Company delete at id: ${id} sucessfully`));
      } else {
        return res
          .status(404)
          .json(responder(false, `There is no company to delete on id:${id}`));
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const registerCompany = async (req: any, res: Response, next: NextFunction) => {
  try {
    const {
      name_of_company,
      phone,
      company_email,
      company_address,
      conformPassword,
      password,
    } = req.body;
    const img = req.file.filename;
    if (!img) {
      return req
        .status(404)
        .json(responder(false, `Please upload company image`));
    }
    if (!name_of_company) {
      return res
        .status(404)
        .json(responder(false, "Please write the name of company"));
    }
    if (!phone) {
      return res
        .status(404)
        .json(responder(false, "Please write contact number of compnay"));
    }
    if (!company_email) {
      return res
        .status(404)
        .json(responder(false, "Please write company email address"));
    }
    if (!company_address) {
      return res
        .status(404)
        .json(responder(false, "Please write the location of your company"));
    }
    if (!password) {
      return res
        .status(404)
        .json(responder(false, "Please write password for the company"));
    }
    if (!conformPassword) {
      return res
        .status(404)
        .json(responder(false, "Please put conform your password"));
    }
    const email = await db("company").where({ company_email }).first();
    if (email) {
      return res
        .status(409)
        .json(responder(false, "email address already exits"));
    }
    if (password !== conformPassword) {
      return res.status(400).json(responder(false, "Password doesn't match"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db("company")
      .insert({
        name_of_company,
        phone,
        company_address,
        company_email,
        password: hashedPassword,
        image: img,
      })
      .then(() => {
        return res
          .status(201)
          .json(responder(true, "Your company have been register sucessfully"));
      })
      .catch((error) => {
        errorLog(error, res, next);
      });
  } catch (error) {
    errorLog(error, res, next);
  }
};

const loginCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { company_email, password } = req.body;
    await db("company")
      .where({ company_email })
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
            const token = jwt.sign(user, secret, { expiresIn: "1D" });
            res.status(202).json({ messege: "Login sucessfully", token });
          }
        }
      });
  } catch (error) {
    errorLog(error, res, next);
  }
};

export  {
  getCompany,
  updateCompany,
  deleteCompnay,
  registerCompany,
  loginCompany,
};
