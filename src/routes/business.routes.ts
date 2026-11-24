import { Router } from "express";
import { createBusiness } from "../controllers/business.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/requireRole.js";

export const businessRouter= Router();
businessRouter.post("/create-business", authenticate, requireRole("business_owner"), createBusiness);