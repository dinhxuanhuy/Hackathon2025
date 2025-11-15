// backend/src/routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginUser,  // Add this import
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/login", loginUser);  // Add this route
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;