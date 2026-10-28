import {Router} from "express";
import type {Request, Response} from "express";
import { pool} from "../db.js";
import { hashPassword } from "../helpers/passwords.helper.js";

export const authRouter= Router();

authRouter.post("/register", async(req:Request, res:Response)=>{
    const {email, password, name}=req.body??{};

    if (
        typeof email!=="string" ||
        typeof password!=="string" ||
        typeof name !=="string"

    ){
        res.status(400).json({error:"email,password and name are required"});
        return;
    }

    if (password.length < 8){
        res.status(400).json({error:"password must be at least 8 characters"})
        return;
    }

    const passwordHash=await hashPassword(password);

    try {
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'customer') RETURNING id, email, name, role",
      [email.toLowerCase(), passwordHash, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      res.status(409).json({ error: "email already registered" });
      return;
    }
    throw err;
  }
})