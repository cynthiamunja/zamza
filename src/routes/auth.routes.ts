import { Router } from "express";
import { register, login,registerBusinessOwner } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/register-business-owner", registerBusinessOwner);