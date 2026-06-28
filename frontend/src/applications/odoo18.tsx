import { createApplicationModule } from "./types";
import StatusBadge from "../components/ui/StatusBadge";

type Odoo18Logs = {
  time: string;
  status: string;
  database: string;
  worker: string;
  ip: string;
  message: string;
  module: string;
  raw: string;
};



export const odoo18 = createApplicationModule<Odoo18Logs>({
  name: "Odoo Multi",
  icon: "selfhst:odoo",
  schema: [
    {
      header: "Time",
      key: "time",
      columnSize: "12rem",
      render: (value: string) => {
        const [date, time] = value.split(" ");
        const [hms, ms] = time.split(",");
        return (
          <span>
            <span className="text-secondary">{date}</span>
            <span> </span>
            <span className="text-secondary">{hms},</span>
            <span className="text-primary">{ms}</span>
          </span>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      columnSize: "5rem",
      render: (val) => {
        return <StatusBadge status={val} />;
      },
    },
    {
      header: "Database",
      key: "database",
      columnSize: "9rem",
      hidden: true,
    },
    {
      header: "Worker",
      key: "worker",
      columnSize: "5rem",
      hidden: true,
    },
    {
      header: "IP",
      key: "ip",
      columnSize: "6rem",
      hidden: true,
    },
    {
      header: "Module",
      key: "module",
      columnSize: "12rem",
    },
    {
      header: "Message",
      key: "message",
      columnSize: "minmax(35rem,1fr)",
    },
  ],
  parseFn: (rawLog: string) => {
    // Odoo Log Format: YYYY-MM-DD HH:MM:SS,ms PID LEVEL dbname module: message
    // Example: 2026-06-26 14:39:59,362 2107 INFO multi_staging werkzeug: 127.0.0.1 - - [...]
    const TIME = `^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3})`; // Group 1
    const SPACE = `\\s+`;
    const WORKER = `(\\d+)`; // Group 2 (PID)
    const STATUS = `([A-Z]+)`; // Group 3 (INFO, ERROR, etc.)
    const DATABASE = `(\\S+)`; // Group 4 (multi_staging, ?, etc)
    const MODULE = `(.*?):\\s+`; // Group 5 (module name up to the colon)
    const MESSAGE = `(.*)$`; // Group 6 (Everything else)

    const regex = new RegExp(
      `${TIME}${SPACE}${WORKER}${SPACE}${STATUS}${SPACE}${DATABASE}${SPACE}${MODULE}${MESSAGE}`,
      "s",
    );
    const match = rawLog.match(regex);

    let messageStr = match?.[6] || "Unparseable log format";
    let ip = "--";

    // Extract IP and completely strip out the noisy werkzeug timestamp prefix:
    // e.g., "172.18.0.5 - - [26/Jun/2026 14:52:40] "
    const werkzeugRegex = /^(\d{1,3}(?:\.\d{1,3}){3})\s+-\s+-\s+\[.*?\]\s*/;
    const werkzeugMatch = messageStr.match(werkzeugRegex);

    if (werkzeugMatch) {
      ip = werkzeugMatch[1];
      messageStr = messageStr.replace(werkzeugRegex, "");
    }

    return {
      time: match?.[1] || "--",
      worker: match?.[2] || "--",
      status: match?.[3] || "BROKEN",
      database: match?.[4] || "--",
      module: match?.[5] || "--",
      ip: ip,
      // If there's a module, it's nice to prepend it to the message so it's not lost
      message: messageStr,
      raw: rawLog,
    };
  },
});
