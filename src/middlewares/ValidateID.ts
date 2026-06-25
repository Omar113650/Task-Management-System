import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const ValidateID = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      message: "Invalid MongoDB ObjectId",
    });
  }

  next();
};