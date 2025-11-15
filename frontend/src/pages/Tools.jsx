// frontend/src/pages/Tools.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import { CalendarPlus, Pencil, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const navigator = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.Role === "Admin";

  function navigate(route) {
    navigator("/" + route);
  }

  const handleAdminAction = (route) => {
    if (!isAdmin) {
      alert("Chỉ Admin mới có quyền truy cập tính năng này!");
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("user");
      navigate("login");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />
      <div className="grid grid-cols-2 gap-3 justify-center align-center">
        <div className={`card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3 ${!isAdmin ? 'opacity-50' : ''}`}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">
              Add event <CalendarPlus className="size-4" />
            </h2>
            {!isAdmin && (
              <span className="badge badge-warning badge-sm">Admin only</span>
            )}
            <div className="justify-center card-actions">
              <button
                onClick={(e) => {
                  handleAdminAction("tools/add");
                }}
                className={`btn ${isAdmin ? 'btn-primary' : 'btn-disabled'}`}
                disabled={!isAdmin}
              >
                Select
              </button>
            </div>
          </div>
        </div>

        <div className={`card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3 ${!isAdmin ? 'opacity-50' : ''}`}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">
              Edit event <Pencil className="size-4" />
            </h2>
            {!isAdmin && (
              <span className="badge badge-warning badge-sm">Admin only</span>
            )}
            <div className="justify-center card-actions">
              <button 
                className={`btn ${isAdmin ? 'btn-primary' : 'btn-disabled'}`}
                disabled={!isAdmin}
                onClick={() => alert("Edit feature coming soon!")}
              >
                Select
              </button>
            </div>
          </div>
        </div>

        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body">
            <h2 className="card-title">
              Schedule <CalendarPlus className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button className="btn btn-primary">Select</button>
            </div>
          </div>
        </div>

        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body">
            <h2 className="card-title">
              My Events <CalendarPlus className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button className="btn btn-primary">Select</button>
            </div>
          </div>
        </div>

        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3 bg-error/10">
          <div className="card-body">
            <div className="justify-center card-actions">
              <button 
                onClick={handleLogout}
                className="btn btn-error"
              >
                Đăng xuất  <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Dock />
    </div>
  );
};

export default Tools;