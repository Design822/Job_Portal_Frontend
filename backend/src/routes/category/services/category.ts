import { Router, Request, Response, NextFunction } from "express";
import db from "../../../config/db";
import { responder, errorLog } from "../../../middelware/response";

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id;
    if (id) {
      const getByID = await db("category").where({ id }).first();
      if (getByID) {
        res.status(200).json(responder(true, `category on id: ${id}`, getByID));
      } else {
        res
          .status(404)
          .json(responder(false, `There is no category on id: ${id}`));
      }
    } else {
      const getAllCategory = await db("category").select("*");
      if (getAllCategory) {
        res.status(200).json(responder(true, `All category`, getAllCategory));
      } else {
        res.status(404).json(responder(false, `There are no category`));
      }
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const createCategory = async (req: any, res: any, next: any) => {
  try {
    const { category_name, accepted } = req.body;
    if (!category_name) {
      res
        .status(404)
        .json(responder(false, "Please wirte name of the category"));
    } else {
      await db("category")
        .insert({ category_name, accepted })
        .then((category) => {
          res.status(201).json(responder(true, `Category create sucessfully`));
        })
        .catch((error) => {
          errorLog(error, res, next);
        });
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const updateCategoryByID = async (req: any, res: any, next: any) => {
  try {
    const id = req.query.id;
    const { category_name, accepted } = req.body;
    if (id) {
      await db("category")
        .where({ id })
        .update({
          category_name,
          accepted,
        })
        .then((category) => {
          if (category) {
            res
              .status(202)
              .json(responder(true, `Category updated at id: ${id}`));
          } else {
            res
              .status(404)
              .josn(responder(false, `There is no category on id: ${id}`));
          }
        })
        .catch((error) => {
          errorLog(error, res, next);
        });
    }
  } catch (error) {
    errorLog(error, res, next);
  }
};

const deleteCategoryByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id;
    await db("category")
      .where({ id })
      .del()
      .then((category) => {
        if (category) {
          res
            .status(202)
            .json(responder(true, `Category delete sucessfully on id: ${id}`));
        } else {
          res
            .status(404)
            .json(
              responder(false, `There is no category on id: ${id} to delete`)
            );
        }
      })
      .catch((error) => {
        errorLog(error, res, next);
      });
  } catch (error) {
    errorLog(error, res, next);
  }
};

export { getCategory, createCategory, updateCategoryByID, deleteCategoryByID };
