import express from "express";

const app = express();

app.use(express.json());

import authRoutes from "./routes/AuthRoute";
import projectRoutes from "./routes/ProjectRoute";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/project", projectRoutes);

export default app;
