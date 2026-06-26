import chalk from "chalk";
import { AppError } from "../utils/http/app-error.js";
import { RequestValidationError } from "../utils/http/request-validation-error.js";
import type { ErrorRequestHandler } from "express";

const IS_PRODUCTION = process.env.ENVIROMENT === "PROD";

/**
 * Error Handling middleware
 */
const errorHandler: ErrorRequestHandler = async (
  error: AppError | Error,
  request,
  response,
  __,
) => {
  const timestamp = new Date().toISOString();
  console.error(
    `${chalk.red("[ERROR]")}   | ${timestamp} | ${request.method} ${request.url} | ${error.message}`,
  );
  if (error instanceof RequestValidationError) {
    console.error(`Error Response: ${JSON.stringify(error, null, "\t")}`);
  }
  if (error.stack) {
    console.error(error.stack);
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).send({
      status: error.status,
      statusCode: error.statusCode,
      message: error.message,
      errors: error?.errors,
      ...(IS_PRODUCTION ? {} : { stack: error.stack }),
    });

    return;
  }

  response.status(500).send({
    status: "fail",
    statusCode: 500,
    message: "Oops, Something went very wrong!",
    ...(IS_PRODUCTION ? {} : { stack: error.stack }),
  });
};

export default errorHandler;
