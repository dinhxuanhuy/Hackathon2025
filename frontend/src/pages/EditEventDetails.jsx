import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import api from "../lib/axios";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { useNavigate, useParams } from "react-router-dom";

const EditEventDetails = () => {
  const { id } = useParams();
  const navigator = useNavigate();

  // State for form fields
  const [eventName, setEventName] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch event data when component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;

        // Update all state values with fetched data
        setEventName(event.EventName || "");
        setRoom(event.RoomID || "");
        setStartTime(new Date(event.TimeStart));
        setEndTime(new Date(event.TimeEnd));
        setNote(event.Note || "");
        setType(event.Type || null);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to fetch event");
        navigator("/tools/edit"); // Navigate back if fetch fails
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigator]);

  // ... (Tất cả các hàm handle... của bạn giữ nguyên) ...
  const handleRoomSearch = async (value) => {
    setRoom(value);
    if (value.trim() === "") {
      setRoomSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await api.get(`/rooms/search?search=${value}`);
      setRoomSuggestions(res.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching rooms:", error);
      setRoomSuggestions([]);
    }
  };

  const handleSelectRoom = (roomName) => {
    setRoom(roomName);
    setShowSuggestions(false);
    setRoomSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/events/${id}`, {
        EventID: 1,
        RoomID: room,
        EventName: eventName,
        TimeStart: startTime,
        TimeEnd: endTime,
        Note: note,
        Type: type,
        Attendees: attendees,
      });
      toast.success("Event updated successfully");
      navigator("/tools/edit");
    } catch (error) {
      console.log("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      navigator("/tools/edit");
    } catch (error) {
      console.log("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  // Khối loading này đã có cấu trúc đúng (flex-1)
  if (fetchLoading) {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-base-200">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        <Dock />
      </div>
    );
  }

  // --- SỬA LẠI CẤU TRÚC LAYOUT TỪ ĐÂY ---
  return (
    // 1. Xóa items-center khỏi root div
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />

      {/* 2. Thêm <main> wrapper với flex-1 và overflow-y-auto */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-5">
        {/* 3. Form của bạn (giữ nguyên w-xs) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-xs">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend">Edit Event</legend>

            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter name..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />

            <label className="label">Room</label>
            <div className="relative">
              <input
                type="text"
                className="input w-full"
                placeholder="Enter your room..."
                value={room}
                onChange={(e) => handleRoomSearch(e.target.value)}
                onFocus={() => room && setShowSuggestions(true)}
                required
              />
              {showSuggestions && roomSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {roomSuggestions.map((roomItem) => (
                    <li
                      key={roomItem._id}
                      className="p-3 hover:bg-base-200 cursor-pointer"
                      onClick={() => handleSelectRoom(roomItem.RoomName)}
                    >
                      {roomItem.RoomName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className="label">Type</label>
            <div className="dropdown dropdown-bottom dropdown-center">
              <div tabIndex={0} role="button" className="btn m-1">
                {type === true ? "Class" : "Other Events"}
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
              >
                <li>
                  <a onClick={() => setType(true)}>Class</a>
                </li>
                <li>
                  <a onClick={() => setType(false)}>Other Events</a>
                </li>
              </ul>
            </div>

            <label className="label">Start time</label>
            <DateTimePicker onChange={setStartTime} value={startTime} />

            <label className="label">End time</label>
            <DateTimePicker onChange={setEndTime} value={endTime} />

            <label className="label">Note</label>
            <input
              type="text"
              className="input"
              placeholder="Enter note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </fieldset>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn btn-success flex-1"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </form>

        {/* 4. Thêm "cục đệm" (spacer) để nội dung không bị Dock che */}
        <div className="h-20 flex-shrink-0"></div>
      </main>

      {/* 5. Dock nằm ngoài <main> */}
      <Dock />
    </div>
  );
};

export default EditEventDetails;
