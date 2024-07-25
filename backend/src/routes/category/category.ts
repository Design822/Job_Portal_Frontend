import { Router, Request, Response, NextFunction } from "express";
import db from "../../config/db";
import { responder, errorLog } from "../../middelware/response";

const router = Router();

router
  .route("/")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.query.id;
      if (id) {
        const getByID = await db("category").where({ id }).first();
        if (getByID) {
          res
            .status(200)
            .json(responder(true, `category on id: ${id}`, getByID));
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
  });

export default router;
