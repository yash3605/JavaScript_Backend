import express from "express";
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));



//Routes Import

import allRouter from './routes/all.routes.js'


app.use('/api', allRouter);

export { app }
