export {};
declare global {
    namespace Express{
        interface Request{
            auth?:{
                userId:number;
                role:"customer" | "business_owner";
            };
        }
    }
}