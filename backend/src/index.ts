import http from "http";
import app from "./express.js";
import { initWebsocket } from "./websocket.js";
import { PORT } from "./config/config.js";
import { logger } from "./utils/logger.js";
import { streamLogs } from "./utils/stream-logs.js";

const httpServer = http.createServer(app);
export const websocket = initWebsocket(httpServer);

streamLogs("middleware");

httpServer.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
