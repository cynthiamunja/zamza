import type {Request, Response} from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { hashPassword, verifyPassword } from "../helpers/passwords.helper.js";
import { insertCustomer, findUserByEmail } from "../models/user.model.js";
import { type } from "node:os";

export async function register(req:Request, res:Response){
    const {email, password, firstName, lastName}= req.body ?? {};

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        firstName.trim()==="" ||
        lastName.trim()===""
    ){
        res.status(400).json({error: "email, password, firstName and lastName are required"});
        return;
    }
    if (password.length < 8){
        res.status(400).json({error:"password must be at least 8 characters"});
        return;
    }
    const passwordHash= await hashPassword(password)

    try {
        const user= await insertCustomer({
            email: email.toLowerCase(),
            passwordHash,
            firstName,
            lastName,
        });
        res.status(201).json(user);
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "23505") {
      res.status(409).json({ error: "email already registered" });
      return;
    }
    throw err;
}
}

export async function login(req:Request, res:Response) {
    const {email, password}=req.body ??{};

    if (typeof email!=="string" || typeof password!=="string"){
        res.status(400).json({error: "email and password are required"});
        return;
    }
    const user= await findUserByEmail(email.toLowerCase());

    if (!user || !(await verifyPassword(user.password_hash, password))){
        res.status(400).json({error:"invalid email or password"});
        return;
    }

    const token=jwt.sign({sub:String(user.id), role:user.role}, config.jwtSecret,{
        expiresIn:"1h",
    });
    res.status(200).json({
        token,
        user:{
            id:user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
        },
    });
}