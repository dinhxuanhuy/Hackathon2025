import React from "react";
import Dock from "../components/Dock";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Filter from "../components/Filter";
import { useState } from "react";
import api from "../lib/axios";
import { useEffect } from "react";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [Loading, setLoading] = useState(true);
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
  return (
    <div class="absolute top-0 -z-10 h-full w-full bg-white">
      <div class="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
      <div className="min-h-screen w-screen flex flex-col bg-base-200">
        <Navbar />
        <Filter
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1 px-4 py-8">
          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            {filteredEvents.map((event) => (
              <Card event={event} key={event._id} />
            ))}
          </div>
        </div>
        <div className="px-4 py-8 flex justify-center">
          <Dock />
        </div>
      </div>
    </div>
  );
};

export default Home;
