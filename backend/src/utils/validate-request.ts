import z from "zod";
import { RequestValidationError } from "./http/request-validation-error.js";

export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
) {
  const validated = schema.safeParse(data);
  if (!validated.success) {
    throw new RequestValidationError(validated.error);
  }
  return validated.data as z.infer<T>;
}
