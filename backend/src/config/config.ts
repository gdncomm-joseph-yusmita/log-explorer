import path from "path";
import os from "os";

export const SSH_KEY_PATH = path.join(os.homedir(), ".ssh/gtn-bastion");

export const APPLICATION = ["middleware", "odoo18"] as const;
export type Application = (typeof APPLICATION)[number];

export const HOSTS: Record<
  (typeof APPLICATION)[number],
  { logDir: string; host: string; logStartRegex: RegExp }
> = {
  middleware: {
    logDir: "/opt/gtn-apps/omg-middleware/logs/application.log",
    host: "gtn-omg-middleware-app-1.gtn-qa-jkt.cld",
    logStartRegex: /(?=^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/m,
  },
  odoo18: {
    logDir: "/var/log/odoo/openerp-server.log",
    host: "odoo18-multi-app-1.gtn-qa-jkt.cld",
    // TODO: CHANGE LATER
    logStartRegex: /(?=^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/m,
  },
} as const;

export const PORT = 8080;

export const SSH = {
  KEY_PATH: path.join(os.homedir(), ".ssh/gtn-bastion"),
  USERNAME: "joseph.yusmita",
  IP: "34.128.65.105",
};
