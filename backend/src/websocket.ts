import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { logger } from "./utils/logger.js";

export function initWebsocket(httpServer: HTTPServer) {
  const websocket = new Server(httpServer, {
    cors: { origin: "*" },
  });

  websocket.on("connection", async (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on("disconnect", async () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return websocket;
}
