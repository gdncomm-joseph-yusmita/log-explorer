import HighlightText from "../components/ui/HighlightText";
import { prettifyJavaString } from "../lib/prettifyJavaString";
import { createApplicationModule } from "./types";

type MiddlewareLog = {
  time: string;
  thread: string;
  status: string;
  caller: string;
  message: string;
  raw: string;
};

const infoColors = {
  INFO: "hsla(212, 100%, 48%, 1)",
  ERROR: "hsla(348, 83%, 53%, 0.8)",
  WARN: "hsla(28, 83%, 53%, 1)",
};

export const middleware = createApplicationModule<MiddlewareLog>({
  name: "Middleware",
  icon: "devicon:spring",
  schema: [
    {
      header: "Time",
      key: "time",
      columnSize: "10rem",
      render: (val) => {
        if (!val) return <span className="text-gray-500">--</span>;
        const [date, time] = val.split("T");
        return date && time ? (
          <>
            <span className="text-secondary">{date}T</span>
            <span>{time}</span>
          </>
        ) : (
          "--"
        );
      },
    },
    {
      header: "Thread",
      key: "thread",
      hidden: true,
    },
    {
      header: "Caller",
      key: "caller",
      columnSize: "14rem",
    },
    {
      header: "Status",
      key: "status",
      columnSize: "5rem",
      render: (val) => {
        return (
          <span
            style={{
              background: infoColors[val as keyof typeof infoColors] || "gray",
            }}
            className="text-white px-1 rounded-sm text-[0.7rem]"
          >
            {val}
          </span>
        );
      },
    },
    {
      header: "Message",
      key: "message",
      columnSize: "minmax(40rem,1fr)",
      renderDetail: (val, searchQuery) => (
        <HighlightText text={prettifyJavaString(val)} query={searchQuery} />
      ),
      render: (value, searchQuery) => (
        <span className="text-secondary">
          <HighlightText text={value} query={searchQuery} />
        </span>
      ),
    },
    {
      header: "Raw",
      key: "raw",
      hidden: true,
    },
  ],
  parseFn: (rawLog: string) => {
    const TIME = `^(\\S+)`; // Group 1: Starts at beginning, captures non-whitespace
    const SPACE = `\\s+`; // Matches one or more spaces (used to connect tokens)
    const THREAD = `\\[(.*?)\\]`; // Group 2: Matches brackets, captures content lazily
    const STATUS = `(\\w+)`; // Group 3: Captures word chars (INFO, ERROR, etc.)
    const CALLER = `(.*?)`; // Group 4: Captures caller lazily up to the colon
    const COLON = `\\s+:\\s+`; // Matches the " : " separator
    const MESSAGE = `(.*)$`; // Group 5: Captures everything else to the end of the line

    const regex = new RegExp(
      `${TIME}${SPACE}${THREAD}${SPACE}${STATUS}${SPACE}${CALLER}${COLON}${MESSAGE}`,
      "s",
    );
    const match = rawLog.match(regex);

    return {
      time: match?.[1] || "--",
      thread: match?.[2] || "",
      status: match?.[3] || "BROKEN",
      caller: match?.[4].toString().split(".").at(-1) || "--",
      message:
        match?.[5] ||
        "Incomplete logs detected, perhaps try increasing the tail length?",
      raw: rawLog,
    };
  },
});
