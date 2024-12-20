import type { NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { AppError } from "src/utils/index.js";

import userRoutes from "src/routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan("short"));

app.use("/api/users", userRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use((_req, _res, next) => {
  next(new AppError("Path Not Found", 404));
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

export default app;
