import { Request, Response, NextFunction } from "express";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

let isConnected: boolean = false;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection failed:", err);
    process.exit(1);
  }
};

app.use(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!isConnected) {
      await connectDB();
    }
    next();
  }
);

export default connectDB;






