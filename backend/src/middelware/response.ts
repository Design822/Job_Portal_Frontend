import { NextFunction, Response } from "express";

export const responder = (ok: boolean, message: string, data?: any[]) => {
  return {
    ok,
    message,
    data,
  };
};

export const errorLog = (error: any, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(500).json(responder(false, "Internal server error"));
  next(error);
};
