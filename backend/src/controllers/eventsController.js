import Event from "../models/Event.js";

export async function getAllEvents(req, res) {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function createEvent(req, res) {
  try {
    const { EventID, RoomID, EventName, TimeStart, TimeEnd, Note } = req.body;
    const event = new Event({
      EventID,
      RoomID,
      EventName,
      TimeStart,
      TimeEnd,
      Note,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
export async function updateEvent(req, res) {
  try {
    const { EventID, RoomID, EventName, TimeStart, TimeEnd, Note } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        EventID,
        RoomID,
        EventName,
        TimeStart,
        TimeEnd,
        Note,
      },
      {
        new: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
export async function deleteEvent(req, res) {
  try {
    const id = req.params.id;
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event " + id + " deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
