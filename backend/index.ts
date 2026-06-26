import { execa } from "execa";
import os from "os";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import express from "express";

const sshKeyPath = path.join(os.homedir(), ".ssh/gtn-bastion");

const HOSTS = {
  middleware: {
    logDir: "/opt/gtn-apps/omg-middleware/logs/application.log",
    host: "gtn-omg-middleware-app-1.gtn-qa-jkt.cld",
  },
  odoo18: {
    logDir: "/var/log/odoo/openerp-server.log",
    host: "odoo18-multi-app-1.gtn-qa-jkt.cld",
  },
};
const APP: keyof typeof HOSTS = "middleware";

const PORT = 8080;

const app = express();
const httpServer = http.createServer(app);
const websocket = new Server(httpServer, {
  cors: { origin: "*" },
});

function tailLogs(flag: string = "-f") {
  console.log("Tailing logs via ssh...");
  return execa("ssh", [
    "-i",
    sshKeyPath,
    "joseph.yusmita@34.128.65.105",
    `sudo -u ansible ssh ansible@${HOSTS[APP].host} 'tail ${flag} ${HOSTS[APP].logDir}'`,
  ]);
}

let sshProcess: any = null;

function startTailing() {
  if (sshProcess) {
    sshProcess.kill();
  }

  sshProcess = tailLogs("-f");

  sshProcess.stdout.on("data", (chunk: Buffer) => {
    websocket.emit("new-log", chunk.toString("utf-8"));
  });

  sshProcess.stderr.on("data", (chunk: Buffer) => {
    console.error(`SSH Error: ${chunk.toString("utf-8")}`);
  });

  sshProcess.catch((err: any) => {
    console.error(
      "SSH process failed or was killed, restarting in 5s...",
      err.message,
    );
    setTimeout(startTailing, 5000);
  });
}

async function main() {
  startTailing(); // Start the live stream broadcasting to everyone

  websocket.on("connection", async (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} for ${APP}`);
});

main();
