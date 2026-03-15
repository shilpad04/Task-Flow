import express from 'express';
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';

const userRouter = express.Router();

//PUBLIC ROUTES
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//PRIVATE ROUTES
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, updatePassword)

export default userRouter;