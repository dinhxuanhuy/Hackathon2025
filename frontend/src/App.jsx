import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Dock from "./components/Dock.jsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Map from "./pages/Map.jsx";
import Events from "./pages/Events.jsx";
import Tools from "./pages/Tools.jsx";
import CreatEvent from "./pages/CreatEvent.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/events" element={<Events />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/add" element={<CreatEvent />} />
      </Routes>
    </div>
  );
};

export default App;
