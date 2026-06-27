import { middleware } from "./middleware";
import { odoo18 } from "./odoo18";
import type { ApplicationModule } from "./types";

export const applications = {
  middleware,
  odoo18,
} as const;

export type Application = keyof typeof applications;
