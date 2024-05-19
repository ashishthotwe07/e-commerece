import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../config/upload.js";

const router = express.Router();

router.put(
  "/update",

  authMiddleware,
  upload.single("image"),
  userController.updateUser
);

export default router;
