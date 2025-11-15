import React from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import { CalendarPlus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const navigator = useNavigate();
  function navigate(route) {
    navigator("/" + route);
  }
  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />
      <div className="grid grid-cols-2 gap-3 justify-center align-center">
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body">
            <h2 className="card-title">
              Add event <CalendarPlus className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button
                onClick={(e) => {
                  navigate("tools/add");
                }}
                className="btn btn-primary"
              >
                Select
              </button>
            </div>
          </div>
        </div>
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body">
            <h2 className="card-title">
              Edit event <Pencil className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button className="btn btn-primary">Select</button>
            </div>
          </div>
        </div>
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body">
            <h2 className="card-title">
              Add event <CalendarPlus className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button className="btn btn-primary">Select</button>
            </div>
          </div>
        </div>
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body">
            <h2 className="card-title">
              Add event <CalendarPlus className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button className="btn btn-primary">Select</button>
            </div>
          </div>
        </div>
      </div>
      <Dock />
    </div>
  );
};

export default Tools;
