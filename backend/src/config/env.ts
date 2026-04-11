import {config} from "dotenv";
config();

export const clients = process.env.CLIENTS?.split(",") || [];
export const jwtSecret = process.env.JWT_SECRET!;