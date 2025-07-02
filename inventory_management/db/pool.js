import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
    connectionString: process.env.DB_URI,
})

export default db;
