import express from "express";

import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { notFound, errorHandler } from "./middlewares/Error";
const app = express();

app.use(helmet());
app.use(hpp());
app.use(
  cors({
    origin: [
      // example:
      "http://localhost:5173",
    ],

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  }),
);

app.use(express.json());

import authRoutes from "./routes/AuthRoute";
import projectRoutes from "./routes/ProjectRoute";
import taskRoutes from "./routes/TaskRoute";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
