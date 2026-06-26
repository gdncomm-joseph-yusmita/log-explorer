import { middleware } from "./middleware";

export const applications = {
  middleware,
} as const;

export type Application = keyof typeof applications;
