import express from 'express';
import { generateAccessToken, login, logout, register, uploadAvatarAndCover } from '../controllers/user.controllers.js';
import {auth} from "../middlewares/auth.middlewares.js"
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();

// Define your routes here
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(auth, logout)
router.route("/generateaccesstoken").post(auth, generateAccessToken)
router.route("/uploadAvatarAndCover").post(auth, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "cover",
        maxCount: 2
    }

]), uploadAvatarAndCover)

export default router; // Export the router correctly