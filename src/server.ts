import express from "express";
import type {Request, Response} from "express";
import {pool} from "./db.js"
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config.js";


const app=  express();

app.use(express.json());
app.use("/auth", authRouter);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

app.get("/health", async (req:Request, res:Response)=>{
    const result =await pool.query("SELECT now() AS server_time");

    res.status(200).json({status:"ok", db_time:result.rows[0].server_time});
})

