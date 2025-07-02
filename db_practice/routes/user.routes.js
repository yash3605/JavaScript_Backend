import express from 'express'
import { getUsernames, createUsernameGet, createUsernamePost } from '../controllers/user.controller.js';


const userRouter = express.Router();

userRouter.get('/', getUsernames);
userRouter.get('/new', createUsernameGet);
userRouter.post('/new', createUsernamePost);

export default userRouter;

