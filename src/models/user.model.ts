import {pool} from "../db.js";
import type { UserRow,PublicUser } from "../types/user.types.js";

type newCustomer ={
    email:string;
    passwordHash:string;
    firstName: string;
    lastName:string;
};

export async function insertCustomer(data:newCustomer):Promise<PublicUser>{
    const result= await pool.query<PublicUser>(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ($1,$2,$3,$4, 'customer')
        RETURNING id, email, first_name, last_name, role`,
        [data.email, data.passwordHash, data.firstName, data.lastName],
    );
    return result.rows[0]!;
}

export async function findUserByEmail(email:string): Promise<UserRow | undefined>{
    const result= await pool.query<UserRow>(
        "SELECT id, email, first_name, last_name, role, password_hash FROM users WHERE email =$1",
        [email],
    );
    return result.rows[0];
}


export async function insertBusinessOwner(data: newCustomer): Promise<PublicUser> {
  const result = await pool.query<PublicUser>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, 'business_owner')
     RETURNING id, email, first_name, last_name, role`,
    [data.email, data.passwordHash, data.firstName, data.lastName],
  );
  return result.rows[0]!;
}