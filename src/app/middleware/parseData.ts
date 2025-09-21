import { NextFunction, Request, Response } from "express";

const parseData = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body?.index)
  req.body = JSON.parse(req?.body?.data);

  next();
};
export default parseData;
