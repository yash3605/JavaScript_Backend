import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import allRoutes from './routes/all.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve('uploads')));

// Session setup (you should replace the secret with a strong env variable)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // You can add store here if using prisma session store later
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', allRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload App!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
