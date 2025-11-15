import express from "express";
import {
  getAllRooms,
  getRoomById,
  searchRooms,
} from "../controllers/roomsController.js";

const router = express.Router();

router.get("/search", searchRooms);
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

export default router;
