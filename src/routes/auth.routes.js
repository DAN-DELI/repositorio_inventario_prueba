// routes/auth.routes.js
import { Router } from 'express';
import { loginJWT, refreshJWT, logout } from '../controllers/auth.controller.js';

const authRouter = Router();

// POST => Crea 
authRouter.post('/login', loginJWT);

// POST
authRouter.post('/refresh', refreshJWT);

// POST
authRouter.post('/logout', logout);

export default authRouter;