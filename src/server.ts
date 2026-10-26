import express from "express";
import type {Request, Response} from "express";

const app=  express();
const PORT=3000;

app.get("/health", (req:Request, res:Response)=>{
    res.status(200).json({status:"ok"});
})

app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})