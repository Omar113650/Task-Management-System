import express from "express";

const app = express();

app.use(express.json());

import authRoutes from "./routes/AuthRoute";

app.use("/api/v1/auth", authRoutes);

export default app;


