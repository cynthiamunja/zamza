import type {Request, Response, NextFunction} from "express";
 export function requireRole(role: "customer" |"business_owner"){
    return (req:Request, res:Response, next:NextFunction):void=>{
        if (!req.auth){
            res.status(401).json({error:"authentication required"});
            return;
        }
        if(req.auth.role !==role){
            res.status(403).json({error:"forbidden"});
            return;
        }
        next();
    };
 }