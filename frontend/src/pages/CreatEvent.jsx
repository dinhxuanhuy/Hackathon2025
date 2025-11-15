import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import api from "../lib/axios";

// CSS cho picker
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { useNavigate } from "react-router-dom";

const CreatEvent = () => {
  const navigator = useNavigate();
  const [eventName, setEventName] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [type, setType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    const newEvent = {
      EventID: 1,
      RoomID: room,
      EventName: eventName,
      TimeStart: startTime,
      TimeEnd: endTime,
      Note: note,
      Type: type,
    };
    setLoading(true);
    try {
      await api.post("/events", {
        EventID: 1,
        RoomID: room,
        EventName: eventName,
        TimeStart: startTime,
        TimeEnd: endTime,
        Note: note,
        Type: type,
      });
      toast.success("Note created successfully");
      navigator("/");
    } catch (error) {
      console.log("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
    console.log("Submitting Event:", newEvent);
  };

  return (
    // SỬA LẠI CẤU TRÚC:
    // 1. Container chính: full màn hình, flex-col
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />

      {/* 2. Vùng nội dung chính: 
          - flex-1: Tự động lấp đầy không gian còn lại
          - overflow-y-auto: Tự động cuộn NẾU nội dung bị tràn
          - items-center: Căn giữa form theo chiều ngang
      */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-5">
        
        {/* 3. Form của bạn:
            - w-xs: Đặt chiều rộng cố định cho form
        */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-xs">
          {/* - Đặt w-full để fieldset rộng bằng form (w-xs)
          */}
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend">New Event</legend>

            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter name..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
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

            <label className="label">Room</label>
            <div className="relative">
              <input
                type="text"
                className="input w-full"
                placeholder="Enter your room..."
                value={room}
                onChange={(e) => handleRoomSearch(e.target.value)}
                onFocus={() => room && setShowSuggestions(true)}
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
          <input type="submit" value="Submit" className="btn btn-success" />
        </form>

        {/* 4. Thêm một cái đệm (Spacer): 
           - Cái này RẤT QUAN TRỌNG.
           - Nó tạo ra một khoảng trống ở *cuối* vùng cuộn,
             để nút "Submit" không bị che khuất bởi Dock.
           - Bạn nên chỉnh h-20 (80px) bằng đúng chiều cao của Dock.
        */}
        <div className="h-20 flex-shrink-0"></div>
        
      </main>

      {/* 5. Dock nằm ngoài vùng cuộn */}
      <Dock />
    </div>
  );
};

export default CreatEvent;