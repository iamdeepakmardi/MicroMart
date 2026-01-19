import client from "prom-client";
import { Request, Response, NextFunction } from "express";

// get default metrics
client.collectDefaultMetrics();

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Only Expose endpoint if requested
  if (req.path === "/metrics") {
    res.set("Content-Type", client.register.contentType);
    client.register.metrics().then((data) => {
      res.send(data);
    });
    return;
  }
  next();
};
