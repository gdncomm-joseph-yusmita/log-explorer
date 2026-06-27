import { HOSTS, type Application } from "../config/config.js";
import { websocket } from "../index.js";
import { logger } from "./logger.js";
import { tailLogs, type TailLogsReturnType } from "./tail-logs.js";
import readline from "readline";

// Singleton variable which holds the process's main multiplexed stream
let activeStreams: Partial<Record<Application, TailLogsReturnType<true>>> = {};

export async function streamLogs(app: Application) {
  if (activeStreams[app]) {
    return;
  }
  try {
    const sshStream = await tailLogs({ app, stream: true });
    activeStreams[app] = sshStream;

    // Ensure we only emit a complete chunk of logs (in case it's a long one)
    const rl = readline.createInterface({
      input: sshStream.stdout,
      crlfDelay: Infinity,
    });

    let logBuffer = "";
    let flushTimeout: NodeJS.Timeout | null = null;

    const flushBuffer = () => {
      if (logBuffer) {
        websocket.emit(`new-log:${app}`, logBuffer.trim());
        logBuffer = "";
      }
    };

    rl.on("line", (line) => {
      // Clear the timeout every time a new line arrives incredibly fast
      if (flushTimeout) clearTimeout(flushTimeout);

      if (HOSTS[app].logStartRegex.test(line)) {
        flushBuffer();
        logBuffer = line;
      } else {
        if (logBuffer) logBuffer += "\n" + line;
      }

      // If the stream goes completely quiet for 50ms, assume the
      // stack trace is fully finished writing and force a flush
      flushTimeout = setTimeout(flushBuffer, 50);
    });

    sshStream.stderr?.on("data", (chunk: Buffer) => {
      logger.error(
        `[${app}] SSH Error:`,
        chunk.toString("utf-8").trim().replaceAll("\n", ""),
      );
    });

    // Attempt to reconnected if the stream died
    sshStream.catch?.((err: unknown) => {
      logger.error(`[${app}] Stream died, restarting in 5s...`, err);
      delete activeStreams[app];
      setTimeout(() => streamLogs(app), 5000);
    });
  } catch (err) {
    console.error(`[${app}] Failed to start stream, retrying in 5s...`);
    setTimeout(() => streamLogs(app));
  }
}
