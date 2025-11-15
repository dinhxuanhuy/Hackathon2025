import { PenSquareIcon, Trash2Icon, CornerUpRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import "flowbite";
import { useNavigate } from "react-router";
import dayjs from "dayjs"; // <-- THÊM: Import dayjs

const Card = ({ event }) => {
  const navigator = useNavigate();
  // State để lưu trạng thái và class màu của badge
  const [statusText, setStatusText] = useState("Đang tải...");
  const [statusClass, setStatusClass] = useState("badge-ghost");

  // Logic tính toán thời gian
  useEffect(() => {
    // Hàm này sẽ chạy mỗi phút để cập nhật status
    const calculateStatus = () => {
      const now = new Date();
      const startTime = new Date(event.TimeStart);
      const endTime = new Date(event.TimeEnd);

      // TRƯỜNG HỢP 1: Đang diễn ra
      if (now >= startTime && now <= endTime) {
        setStatusText("Đang diễn ra");
        setStatusClass("badge-error"); // Màu đỏ (hoặc badge-success)
      }
      // TRƯỜNG HỢP 2: Sắp diễn ra (chưa tới giờ)
      else if (now < startTime) {
        const diffMs = startTime.getTime() - now.getTime(); // Số mili-giây còn lại
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);

        let remainingText;
        if (days > 0) {
          remainingText = `Còn ${days} ngày`;
        } else if (totalHours > 0) {
          remainingText = `Còn ${totalHours} giờ`;
        } else if (totalMinutes > 0) {
          remainingText = `Còn ${totalMinutes} phút`;
        } else {
          remainingText = "Sắp diễn ra";
        }

        setStatusText(remainingText);
        setStatusClass("badge-warning"); // Màu vàng
      }
      // TRƯỜNG HỢP 3: Đã kết thúc
      else {
        setStatusText("Đã kết thúc");
        setStatusClass("badge-ghost"); // Màu xám
      }
    };

    // Chạy ngay 1 lần khi component render
    calculateStatus();

    // Set 1 đồng hồ chạy mỗi 60 giây để cập nhật lại thời gian
    const intervalId = setInterval(calculateStatus, 60000); // 60000ms = 1 phút

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, [event.TimeStart, event.TimeEnd]); // Chạy lại nếu event thay đổi

  function navigate(route) {
    navigator("/" + route);
  }

  // --- THÊM: Format thời gian bằng dayjs ---
  const formattedStart = dayjs(event.TimeStart).format("DD/MM/YYYY HH:mm");
  const formattedEnd = dayjs(event.TimeEnd).format("HH:mm");

  return (
    <div className="card w-full min-h-60 bg-base-100 shadow-sm">
      <div className="card-body p-8">
        {/* Dùng state đã tính toán */}
        <span className={`badge ${statusClass} badge-lg text-base`}>
          {statusText}
        </span>
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-5xl font-bold flex-1 leading-tight">
            {event.EventName}
          </h2>
          <span className="text-3xl whitespace-nowrap"> </span>{" "}
          {/*ghi gi thi ghi*/}
        </div>
        <ul className="mt-8 flex flex-col gap-3 text-lg">
          <li>
            <span>
              {" "}
              {/* <-- SỬA LẠI: Dùng biến đã format */}
              {formattedStart} - {formattedEnd}
            </span>
          </li>
          <li>
            <span>{event.Note}</span>
          </li>
        </ul>
        <div className="mt-auto pt-8">
          <button
            onClick={(e) => {
              navigate("map");
            }}
            className="btn btn-primary btn-block btn-xl text-xl py-7 px-4"
          >
            Direction <CornerUpRight />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Card;
