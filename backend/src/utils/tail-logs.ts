import { APPLICATION, HOSTS, SSH } from "../config/config.js";
import { Client, type ClientChannel } from "ssh2";
import { logger } from "./logger.js";
import fs from "fs";

const conn = new Client();
let isConnected = false;
let isConnecting = false;

function connectSSH() {
  if (isConnecting || isConnected) return;
  isConnecting = true;
  logger.info("Connecting to SSH2 Bastion...");

  conn.connect({
    host: SSH.IP,
    port: 22,
    username: SSH.USERNAME,
    privateKey: fs.readFileSync(SSH.KEY_PATH),
    keepaliveInterval: 10000, // Important to prevent timeouts!
  });
}

conn
  .on("ready", () => {
    logger.info("SSH2 Client is connected to bastion server");
    isConnected = true;
    isConnecting = false;
  })
  .on("error", (error) => {
    logger.error("SSH2 Connection error:", error.message);
    isConnected = false;
    isConnecting = false;
  })
  .on("close", () => {
    logger.error("SSH2 Connection closed. Attempting reconnect in 5s...");
    isConnected = false;
    isConnecting = false;
    setTimeout(connectSSH, 5000);
  });

// Initial connection
connectSSH();

export type TailLogsReturnType<AsStream extends boolean = false> = {
  stdout: AsStream extends true ? ClientChannel : string;
  stderr?: ClientChannel["stderr"];
  kill?: () => void;
  catch?: (callback: Function) => void;
};

export async function tailLogs<AsStream extends boolean = false>({
  app,
  args = "-f",
  stream = false as AsStream,
}: {
  app: (typeof APPLICATION)[number];
  args?: string;
  stream?: AsStream;
}) {
  // Ensure the connection is ready before proceeding
  if (!isConnected) {
    if (!isConnecting) connectSSH();
    await new Promise((resolve) => conn.once("ready", () => resolve(true)));
  }

  const command = `sudo -u ansible ssh ansible@${HOSTS[app].host} 'tail ${args} ${HOSTS[app].logDir}'`;

  return new Promise<TailLogsReturnType<AsStream>>((resolve, reject) => {
    conn.exec(command, (error, connStream) => {
      if (error) {
        reject(error);
        return;
      }

      // return the stream immediately so we can attach .on('data')
      if (stream) {
        resolve({
          stdout: connStream as any,
          stderr: connStream.stderr,
          kill: () => connStream.close(),
          catch: (cb: Function) => connStream.on("close", cb),
        } as TailLogsReturnType<AsStream>);
        return;
      }

      // If it's a fetch (-n 50), gather the data and return it as a string
      let output = "";
      connStream
        .on("data", (data: Buffer) => {
          output += data.toString("utf-8");
        })
        .on("close", () => {
          resolve({ stdout: output as any } as TailLogsReturnType<AsStream>);
        });
    });
  });
}
