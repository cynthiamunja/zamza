import express from "express";
import type {Request, Response} from "express";
import {pool} from "./db.js"


const app=  express();
const PORT=3000;

app.get("/health", async (req:Request, res:Response)=>{
    const result =await pool.query("SELECT now() AS server_time");

    res.status(200).json({status:"ok", db_time:result.rows[0].server_time});
})

app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})