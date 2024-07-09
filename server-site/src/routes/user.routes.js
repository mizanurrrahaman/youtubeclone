import express from 'express';
import { login, logout, register } from '../controllers/user.controllers.js';
import {auth} from "../middlewares/auth.middlewares.js"
const router = express.Router();

// Define your routes here
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(auth, logout)

export default router; // Export the router correctly