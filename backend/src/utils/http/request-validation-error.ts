import z, { ZodError } from "zod";
import { AppError } from "./app-error.js";
import { STATUS } from "./status-codes.js";

export class RequestValidationError extends AppError {
  errors: string;

  constructor(errors: ZodError) {
    super("Invalid request", STATUS.BAD_REQUEST);
    this.errors = z.prettifyError(errors);

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
