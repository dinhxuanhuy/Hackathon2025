import express from "express";
import {
  getAllEvents,
  createEvent,
  createEvents,
  updateEvent,
  deleteEvent,
  getEventById,
} from "../controllers/eventsController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.post("/batch", createEvents); // Batch create endpoint
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
