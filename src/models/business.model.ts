import {pool} from "../db.js";
import type { BusinessRow } from "../types/business.types.js";
import type { BusinessInput } from "../helpers/validation.helper.js";


export async function insertBusiness(
    ownerId: number,
    data:BusinessInput,
): Promise<BusinessRow>{
const result = await pool.query<BusinessRow>(
    `INSERT INTO businesses(owner_id, name, slug, timezone, phone, address, description)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, owner_id, name, slug, timezone, phone, address, description, created_at`,
    [
        ownerId,
        data.name,
        data.slug,
        data.timezone,
        data.phone,
        data.address,
        data.description,
    ],
);
return result.rows[0]!;

}