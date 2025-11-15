import React, { useState, useEffect } from "react";
import Dock from "../components/Dock";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import FilterOnly from "../components/FilterOnly";
import api from "../lib/axios";
import { Link } from "react-router-dom";

const EditEvent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data); // Initially show all events
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          // Handle rate limiting
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Filter events based on selected filter
  useEffect(() => {
    const filterEvents = () => {
      const now = new Date();

      if (currentFilter === "all") {
        setFilteredEvents(events);
      } else if (currentFilter === "class") {
        // Filter for class events (Type === true)
        const filtered = events.filter((event) => event.Type === true);
        setFilteredEvents(filtered);
      } else if (currentFilter === "other") {
        // Filter for other events (Type === false)
        const filtered = events.filter((event) => event.Type === false);
        setFilteredEvents(filtered);
      } else if (currentFilter === "ongoing") {
        // Events that are currently happening
        const filtered = events.filter((event) => {
          const start = new Date(event.TimeStart);
          const end = new Date(event.TimeEnd);
          return now >= start && now <= end;
        });
        setFilteredEvents(filtered);
      } else if (currentFilter === "upcoming") {
        // Events that haven't started yet
        const filtered = events.filter((event) => {
          const start = new Date(event.TimeStart);
          return now < start;
        });
        setFilteredEvents(filtered);
      } else if (currentFilter === "ended") {
        // Events that have ended
        const filtered = events.filter((event) => {
          const end = new Date(event.TimeEnd);
          return now > end;
        });
        setFilteredEvents(filtered);
      }
    };

    filterEvents();
  }, [currentFilter, events]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-base-200">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        <div className="px-4 py-8 flex justify-center">
          <Dock />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />
      <FilterOnly
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />
      <div className="flex-1 px-4 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-xl">Không có sự kiện nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            {filteredEvents.map((event) => (
              <Link to={`../../api/events/${event._id}`} key={event._id}>
                <Card event={event} />
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="px-4 py-8 flex justify-center">
        <Dock />
      </div>
    </div>
  );
};

export default EditEvent;
