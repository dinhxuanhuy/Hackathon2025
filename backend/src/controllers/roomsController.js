import Room from "../models/Room.js";

export async function getAllRooms(req, res) {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getRoomById(req, res) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
