import { saveUser, updateMembership, updateAdmin, getAllMessages, createMessage, deleteMessage, signupValidation, messageValidation, handleValidationErrors } from "../db/queries.js";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/', async (req, res) => {
    const messages = await getAllMessages();
    res.render('index', {
        user: req.user,
        messages
    });
});

router.get('/signup', (req, res) => {
    res.render('signup', { messages: req.flash('error') || [] });
})


router.post('/signup', signupValidation, handleValidationErrors, async (req, res) => {
    const { first_name, last_name, username, password } = req.body;

    try {
        const user = await saveUser(first_name, last_name, username, password);
        req.flash('success', 'Signed up successfully');
        res.redirect('/login');
    } catch (err) {

        // Check if error is due to duplicate username
        if (err.code === '23505') { // Postgres unique violation error code
            req.flash('error', 'Username already exists. Please choose another.');
        } else {
            req.flash('error', 'An unforeseen error occurred during signup.');
        }
        res.redirect('/signup');
    }
});
router.get('/login', (req, res) => {
    res.render('login', { messages: req.flash('error') || [] });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);


router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

router.get('/join-club', (req, res) => {
    res.render('join', { messages: req.flash('error') || [] })
});

router.post('/join-club', async (req, res) => {
    const { passcode } = req.body;
    console.log("secret passcode:", passcode)
    console.log("user is:", req.user)
    if (passcode === process.env.MEMBER_PASSCODE) {
        await updateMembership(req.user.id, true);
        req.flash('success', 'You are now a member!');
        res.redirect('/');
    } else {
        req.flash('error', 'Incorrect passcode.');
        res.redirect('/join-club');
    }
});

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/admin', async (req, res) => {
    const { adminPasscode } = req.body;
    if (adminPasscode === process.env.ADMIN_PASSCODE) {
        await updateAdmin(req.user.id, true);
        req.flash('success', 'You are now an admin!');
        res.redirect('/');
    } else {
        req.flash('error', 'Incorrect admin passcode.');
        res.redirect('/admin');
    }
});

router.get('/new-message', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to create a message.');
        return res.redirect('/login');
    }
    res.render('new-message', { messages: req.flash('error') || [] });
});

router.post('/new-message', messageValidation, handleValidationErrors, async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to create a message.');
        return res.redirect('/login');
    }
    const { title, text } = req.body;
    await createMessage(title, text, req.user.id);
    req.flash('success', 'Message created!');
    res.redirect('/');
});

router.post('/delete/:id', async (req, res) => {
    if (!req.isAuthenticated() || !req.user.is_admin) {
        req.flash('error', 'You do not have permission to delete messages.');
        return res.redirect('/');
    }
    await deleteMessage(req.params.id);
    req.flash('success', 'Message deleted.');
    res.redirect('/');
});

export default router;
