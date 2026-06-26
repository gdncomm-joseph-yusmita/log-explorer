import type { RequestHandler } from "express";
import { tailLogs } from "../../utils/tail-logs.js";
import z from "zod";
import { validateRequest } from "../../utils/validate-request.js";
import { APPLICATION, HOSTS } from "../../config/config.js";

const paramsSchema = z.object({
  amount: z.coerce.number().max(100).optional().default(20),
  app: z.enum(APPLICATION),
});

const MAX_TAIL_LENGTH = 20_000;

export const getLogs: RequestHandler = async (request, response, next) => {
  try {
    const { amount, app } = validateRequest(paramsSchema, request.query);

    const rawLogs = await tailLogs({
      app,
      args: `-n ${Math.min(amount * 30, MAX_TAIL_LENGTH)}`,
      stream: false,
    });
    const logs = rawLogs.stdout
      .split(HOSTS[app].logStartRegex)
      .map((log) => log.trim())
      .filter(Boolean)
      .slice(-amount);

    response.send({
      message: "Successfully retrieved logs",
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
