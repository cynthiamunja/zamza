import type { BusinessRow } from "../types/business.types.js";

export function toBusinessResponse(business:BusinessRow){
    return {
        id:business.id,
        name:business. name,
        slug:business.slug,
        timezone:business.timezone,
        phone:business.phone,
        address:business.address,
        description:business.description,
        createdAt:business.created_at,
    };
}