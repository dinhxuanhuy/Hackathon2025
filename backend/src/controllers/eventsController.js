import Event from "../models/Event.js";

export async function getAllEvents(req, res) {
  try {
    const events = await Event.find();
    const now = new Date();

    // Sort events: ongoing first, then upcoming, then ended at the bottom
    const sortedEvents = events.sort((a, b) => {
      const aStart = new Date(a.TimeStart);
      const aEnd = new Date(a.TimeEnd);
      const bStart = new Date(b.TimeStart);
      const bEnd = new Date(b.TimeEnd);

      // Determine event status
      const aOngoing = now >= aStart && now <= aEnd;
      const bOngoing = now >= bStart && now <= bEnd;
      const aEnded = now > aEnd;
      const bEnded = now > bEnd;

      // Priority: ongoing > upcoming > ended
      // If one is ongoing and the other isn't
      if (aOngoing && !bOngoing) return -1;
      if (!aOngoing && bOngoing) return 1;

      // If one is ended and the other isn't
      if (aEnded && !bEnded) return 1;
      if (!aEnded && bEnded) return -1;

      // If both have same status, sort by TimeStart (nearest first)
      return aStart - bStart;
    });

    res.status(200).json(sortedEvents);
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
    const { EventID, RoomID, EventName, TimeStart, TimeEnd, Note, Type } =
      req.body;
    const event = new Event({
      EventID,
      RoomID,
      EventName,
      TimeStart,
      TimeEnd,
      Note,
      Type,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
export async function updateEvent(req, res) {
  try {
    const { EventID, RoomID, EventName, TimeStart, TimeEnd, Note, Type } =
      req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        EventID,
        RoomID,
        EventName,
        TimeStart,
        TimeEnd,
        Note,
        Type,
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
