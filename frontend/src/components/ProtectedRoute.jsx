
// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const userStr = localStorage.getItem("user");
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (adminOnly && user.Role !== "Admin") {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-md">
          <span>Bạn không có quyền truy cập trang này. Chỉ Admin mới có thể truy cập.</span>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;