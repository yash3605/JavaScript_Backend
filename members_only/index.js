import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import path, { dirname } from 'path';
import router from './routes/all.routes.js';
import flash from 'connect-flash';
import ejs from 'ejs'
import './db/queries.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
})

