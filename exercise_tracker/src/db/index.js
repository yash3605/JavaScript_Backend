import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI || !DB_NAME) {
            throw new Error("MONGO_URI or DB_NAME is not defined");
        }

        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected – DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
