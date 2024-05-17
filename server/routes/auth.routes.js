import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/email-verify", authController.verify);
router.post("/resend", authController.resendVerificationEmail);
router.post("/forgot-pass", authController.forgotPassword);
router.post("/reset-pass", authController.resetPassword);
router.post("/logout", authController.signout);

export default router;
