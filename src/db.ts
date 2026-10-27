import {Pool} from "pg";

function requireEnv(name: string): string{
    const value =process.env[name];
    if (value===undefined || value===""){
        throw new Error (`missing required environment variable: ${name}`)
    }
    return value;
}

export const pool=new Pool({
    host: requireEnv("DB_HOST"),
    port:Number(requireEnv("DB_PORT")),
    database: requireEnv("DB_NAME"),
    user:requireEnv("DB_USER"),
    password:requireEnv("DB_PASSWORD")
});