import express from "express";
import { register, login, logout, getUser } from "../controllers/userController.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isUserAuthenticated, getUser);
router.get("/my-profile", isUserAuthenticated, getUser);

export default router;
