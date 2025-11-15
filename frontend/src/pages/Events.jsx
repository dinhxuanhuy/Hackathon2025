import React from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";

const Events = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />

      <Dock />
    </div>
  );
};

export default Events;
