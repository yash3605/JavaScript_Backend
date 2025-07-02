import pool from "./pool.js";
import bcrypt from 'bcryptjs';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { body, validationResult } from "express-validator";
import dotenv from 'dotenv';

dotenv.config()


const saveUser = async (first_name, last_name, username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *`, [first_name, last_name, username, hashedPassword]);
    return result.rows[0];
}

const updateMembership = async (userId, is_member) => {
    await pool.query(`UPDATE users SET is_member = $1 WHERE id = $2`, [is_member, userId])
}

const updateAdmin = async (userId, is_admin) => {
    await pool.query(`UPDATE users SET is_admin = $1 WHERE id = $2`, [is_admin, userId])
}

// =========MESSAGES=========

async function createMessage(title, text, userId) {
    await pool.query(
        `INSERT INTO messages (title, text, user_id)
     VALUES ($1, $2, $3)`,
        [title, text, userId]
    );
}

async function getAllMessages() {
    const result = await pool.query(`
    SELECT messages.*, users.first_name, users.last_name
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.created_at DESC
  `);
    console.log("Rows:", result.rows);
    return result.rows;
}

async function deleteMessage(messageId) {
    await pool.query(
        `DELETE FROM messages WHERE id = $1`,
        [messageId]
    );
}

// ========VALIDATION========

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username])
        const user = result.rows[0];
        if (!user) return done(null, false, { message: 'Incorrect email.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user)
    } catch (err) {
        return done(err);
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );
        const user = result.rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const signupValidation = [
    body('first_name').notEmpty().withMessage("First name is required"),
    body('last_name').notEmpty().withMessage("last name is required"),
    body('username').notEmpty().withMessage("username is requires"),
    body('password').isLength({ min: 6 }).withMessage("Password must be atleast 6 characters"),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password do not match");
        }
        return true;
    })
]

const messageValidation = [
    body('title').notEmpty().withMessage('Title is required.'),
    body('text').notEmpty().withMessage('Message text is required.')
];

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        req.flash('error', errorMessages);
        return res.redirect('/signup');
    }
    next();
}

export { saveUser, updateAdmin, updateMembership, createMessage, getAllMessages, deleteMessage, signupValidation, messageValidation, handleValidationErrors }
