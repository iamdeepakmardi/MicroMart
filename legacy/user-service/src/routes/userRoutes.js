import express from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);
router.get("/:userId", userController.getUserById); // New route for getting user by ID

export default router;
