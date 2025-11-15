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
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response.status === 429) {
        } else {
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);
  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />
      <Filter></Filter>
      <div className="flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {events.map((event) => (
            <Card event={event} key={event.id} />
          ))}
        </div>
      </div>
      <div className="px-4 py-8 flex justify-center">
        <Dock />
      </div>
    </div>
  );
};

export default Home;
