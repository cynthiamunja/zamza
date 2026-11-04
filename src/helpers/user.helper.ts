import type { PublicUser } from "../types/user.types.js";

export function toUserResponse(user:PublicUser){
    return{
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    }
}