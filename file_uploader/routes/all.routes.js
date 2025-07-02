// routes/all.routes.js
import express from 'express';
import upload from '../middlewares/multer.js'
import passport, { isAuthenticated } from '../middlewares/auth.js';
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Register new user
router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, username, password: hashedPassword },
    });
    res.status(201).json({ message: 'User registered!', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid username or password' });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ success: true, message: 'Logged in successfully' });
    });
  })(req, res, next);
});
// Dashboard (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Hello ${req.user.name}, welcome to your dashboard!`);
});

// Create Folder
router.post('/folders', isAuthenticated, async (req, res) => {
  const { name } = req.body;
  try {
    const folder = await prisma.folder.create({
      data: { name, userId: req.user.id },
    });
    res.status(201).json(folder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Get all folders for user
router.get('/folders', isAuthenticated, async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });
    res.json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Update Folder
router.put('/folders/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedFolder = await prisma.folder.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(updatedFolder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Delete Folder
router.delete('/folders/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.folder.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

// Upload File to a folder
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
  const { folderId } = req.body;
  const { originalname, path: filePath, size, mimetype } = req.file;
  try {
    const file = await prisma.file.create({
      data: {
        name: originalname,
        path: filePath,
        size,
        type: mimetype,
        folderId: folderId ? parseInt(folderId) : null,
        userId: req.user.id,
      },
    });
    res.status(201).json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get File Details
router.get('/files/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch file details' });
  }
});

// Download File
router.get('/files/:id/download', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.download(file.path, file.name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

export default router;
