import {Router} from "express";
import type {Request, Response} from "express";
import { pool} from "../db.js";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../helpers/passwords.helper.js";
import type { UserRow,PublicUser } from "../types/user.types.js";
import { config } from "../config.js";



export const authRouter= Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    firstName.trim() === "" ||
    lastName.trim() === ""
  ) {
    res
      .status(400)
      .json({ error: "email, password, firstName and lastName are required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "password must be at least 8 characters" });
    return;
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await pool.query<PublicUser>(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id, email, first_name, last_name, role`,
      [email.toLowerCase(), passwordHash, firstName.trim(), lastName.trim()],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      res.status(409).json({ error: "email already registered" });
      return;
    }
    throw err;
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const result = await pool.query<UserRow>(
  "SELECT id, email, first_name, last_name, role, password_hash FROM users WHERE email = $1",
  [email.toLowerCase()],
);
  const user = result.rows[0];

  if (!user || !(await verifyPassword(user.password_hash, password))) {
    res.status(401).json({ error: "invalid email or password" });
    return;
  }

  

  const token = jwt.sign({ sub: String(user.id), role: user.role }, config.jwtSecret, {
  expiresIn: "1h",
});

   res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    },
  });

});