import type { Request, Response } from "express";
import { parseBusiness } from "../helpers/validation.helper.js";
import { toBusinessResponse } from "../helpers/business.helper.js";
import { insertBusiness } from "../models/business.model.js";

export async function createBusiness(req: Request, res: Response) {
  if (!req.auth) {
    res.status(401).json({ error: "authentication required" });
    return;
  }

  const parsed = parseBusiness(req.body);

  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  try {
    const business = await insertBusiness(req.auth.userId, parsed.data);
    res.status(201).json(toBusinessResponse(business));
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      res.status(409).json({ error: "slug already taken" });
      return;
    }
    throw err;
  }
}