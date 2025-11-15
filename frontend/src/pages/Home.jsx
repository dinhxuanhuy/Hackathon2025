import React from "react";
import Dock from "../components/Dock";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Filter from "../components/Filter";

const Home = () => {
  const events = [
    {
      id: 1,
      title: "Event 1",
      description: "Description for Event 1",
      tier: "emergancy",
    },
    {
      id: 2,
      title: "Event 2",
      description: "Description for Event 2",
      tier: "incoming",
    },
    {
      id: 3,
      title: "Event 3",
      description: "Description for Event 3",
      tier: "Far from now",
    },
  ];
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
