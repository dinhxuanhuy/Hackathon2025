import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import {
  CirclePlus,
  Pencil,
  LogOut,
  ImagePlus,
  CircleParking,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// THÊM: Import api và toast
import api from "../lib/axios";
import toast from "react-hot-toast";

const Tools = () => {
  const navigator = useNavigate();

  // SỬA: Chuyển user sang state để UI tự cập nhật
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading

  // SỬA: Dùng useEffect để load user từ localStorage 1 lần khi trang mở
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    setUser(userStr ? JSON.parse(userStr) : null);
  }, []); // [] nghĩa là chỉ chạy 1 lần khi component mount

  const isAdmin = user?.Role === "Admin";

  function navigate(route) {
    navigator("/" + route);
  }

  const handleAdminAction = (route) => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền truy cập tính năng này!");
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("user");
      setUser(null); // Xóa user khỏi state
      navigate("login");
    }
  };

  // --- LOGIC MỚI CHO CHECK IN / CHECK OUT ---

  const handleCheckIn = async () => {
    setLoading(true);
    const checkInTime = new Date(); // Lấy giờ hiện tại

    try {
      // Gọi API (PATCH) để set TimeStartGiuXe
      await api.put(`/users/${user._id}`, {
        TimeStartGiuXe: checkInTime,
      });

      // Cập nhật state và localStorage ngay lập tức
      const updatedUser = { ...user, TimeStartGiuXe: checkInTime };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Đã check in thành công!");
    } catch (error) {
      console.log("Error checking in:", error);
      toast.error("Check in thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user || !user.TimeStartGiuXe) return; // An toàn

    if (!confirm("Bạn có chắc muốn check out?")) {
      return;
    }

    setLoading(true);
    const checkOutTime = new Date();
    const startTime = new Date(user.TimeStartGiuXe);

    // --- Logic tính tiền ---

    // Đặt 2 mốc thời gian về 00:00:00 để so sánh ngày
    const startDay = new Date(
      startTime.getFullYear(),
      startTime.getMonth(),
      startTime.getDate()
    );
    const endDay = new Date(
      checkOutTime.getFullYear(),
      checkOutTime.getMonth(),
      checkOutTime.getDate()
    );

    const diffMs = endDay.getTime() - startDay.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)); // Số ngày đã trôi qua

    let fareToAdd = 0;
    if (diffDays === 0) {
      // 1. Nếu cùng ngày
      fareToAdd = 4000;
    } else {
      // 2. Nếu khác ngày, 50k * số ngày
      fareToAdd = diffDays * 50000;
    }

    const newTotalFare = (user.TotalFare || 0) + fareToAdd;

    try {
      // Gọi API (PATCH) để:
      // 1. Xóa TimeStartGiuXe (set về null)
      // 2. Cập nhật TotalFare
      await api.put(`/users/${user._id}`, {
        TimeStartGiuXe: null,
        TotalFare: newTotalFare,
      });

      // Cập nhật state và localStorage
      const updatedUser = {
        ...user,
        TimeStartGiuXe: null,
        TotalFare: newTotalFare,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success(
        `Đã check out! Tiền vé: ${fareToAdd.toLocaleString("vi-VN")}đ`
      );
    } catch (error) {
      console.log("Error checking out:", error);
      toast.error("Check out thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // BIẾN ĐỂ QUYẾT ĐỊNH HIỂN THỊ NÚT NÀO
  const isCheckedIn = user && user.TimeStartGiuXe;

  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />
      <div className="grid grid-cols-2 gap-3 justify-center align-center">
        {/* Card "Edit" (Admin) */}
        <div
          className={`card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3 ${
            !isAdmin ? "opacity-50" : ""
          }`}
        >
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">
              Edit
              <Pencil className="size-4" />
            </h2>
            {!isAdmin && (
              <span className="badge badge-warning badge-sm">Admin only</span>
            )}
            <div className="justify-center card-actions">
              <button
                className={`btn ${isAdmin ? "btn-primary" : "btn-disabled"}`}
                disabled={!isAdmin}
                onClick={() => handleAdminAction("tools/edit")}
              >
                Select
              </button>
            </div>
          </div>
        </div>

        {/* Card "Create" (Admin) */}
        <div
          className={`card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3 ${
            !isAdmin ? "opacity-50" : ""
          }`}
        >
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">
              Create
              <CirclePlus className="size-4" />
            </h2>
            {!isAdmin && (
              <span className="badge badge-warning badge-sm">Admin only</span>
            )}
            <div className="justify-center card-actions">
              <button
                className={`btn ${isAdmin ? "btn-primary" : "btn-disabled"}`}
                disabled={!isAdmin}
                onClick={() => handleAdminAction("tools/add")}
              >
                Select
              </button>
            </div>
          </div>
        </div>

        {/* Card "Parking" với logic toggle */}
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title text-center">
              Parking
              <CircleParking className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button
                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                className={`btn ${isCheckedIn ? "btn-error" : "btn-primary"} ${
                  loading ? "btn-disabled" : ""
                }`}
                disabled={loading || !user} // Disable nếu đang load hoặc chưa có user
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : isCheckedIn ? (
                  "Check Out"
                ) : (
                  "Check In"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card "Extract" (Giữ nguyên) */}
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title text-center">
              Extract
              <ImagePlus className="size-4" />
            </h2>
            <p className="text-xs text-center text-base-content/70">Từ ảnh</p>
            <div className="justify-center card-actions">
              <button
                onClick={() => navigate("tools/extract")} // Sửa: Dùng navigate thay vì handleAdminAction
                className="btn btn-primary"
              >
                Select
              </button>
            </div>
          </div>
        </div>

        {/* SỬA LẠI: Card "Total Fare" */}
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3">
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title text-center">Total Fare</h2>
            <div className="justify-center card-actions">
              <p className="text-lg font-bold">
                {user ? (user.TotalFare || 0).toLocaleString("vi-VN") : 0}đ
              </p>
            </div>
          </div>
        </div>

        {/* Card "Logout" (Giữ nguyên) */}
        <div className="card max-w-45 max-h-60 bg-base-100 card-md shadow-sm m-3 bg-error/10">
          <div className="card-body">
            <h2 className="card-title text-error">
              Logout <LogOut className="size-4" />
            </h2>
            <div className="justify-center card-actions">
              <button onClick={handleLogout} className="btn btn-error">
                Đăng xuất
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