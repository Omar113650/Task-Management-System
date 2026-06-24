import express from "express";

const app = express();

app.use(express.json());

import authRoutes from "./routes/AuthRoute";
import projectRoutes from "./routes/ProjectRoute";
import taskRoutes from "./routes/TaskRoute";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

export default app;
