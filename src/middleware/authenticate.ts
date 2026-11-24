import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "authentication required" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      (payload["role"] !== "customer" && payload["role"] !== "business_owner")
    ) {
      res.status(401).json({ error: "invalid token" });
      return;
    }

    req.auth = { userId: Number(payload.sub), role: payload["role"] };
    next();
  } catch {
    res.status(401).json({ error: "invalid or expired token" });
  }
}