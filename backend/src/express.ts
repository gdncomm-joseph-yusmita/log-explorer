import express, { Router } from "express";
import { LogController } from "./controllers/log-controller/index.js";
import errorHandler from "./controllers/error-controller.js";
import { AppError } from "./utils/http/app-error.js";
import { STATUS } from "./utils/http/status-codes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/logs", LogController.getLogs);

app.use((_, __, next) => {
  next(new AppError("Route not found", STATUS.NOT_FOUND));
});

app.use(errorHandler);

export default app;
