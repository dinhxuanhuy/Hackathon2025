// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Map from "./pages/Map.jsx";
import Events from "./pages/Events.jsx";
import Tools from "./pages/Tools.jsx";
import CreatEvent from "./pages/CreatEvent.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tools/add"
          element={
            <ProtectedRoute adminOnly={true}>
              <CreatEvent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;