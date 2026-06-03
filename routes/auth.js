import { Router } from "express";
import { login, loginForm, logout, signup, signupForm } from "../controller/auth.js"
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get('/login', loginForm)

router.get('/signup', signupForm)

router.post('/login', login)

router.post('/signup', signup)

router.post('/logout', logout)

export default router