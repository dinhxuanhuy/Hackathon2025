import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import MapView from "../components/map/MapView";
import MapControlButton from "../components/map/MapControlButton";

const Map = () => {
  const [placingMode, setPlacingMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTogglePlacing = () => {
    setPlacingMode(!placingMode);
    if (!placingMode) {
      // Thông báo chỉ hiện trên desktop
      if (window.innerWidth >= 768) {
        alert('Click vào map để đặt marker. Click nút lại để tắt chế độ đặt marker.');
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-base-200 overflow-hidden">
      <Navbar />
      
      {/* Search bar - responsive */}
      <div className="flex justify-center px-4 py-3 md:py-5 bg-base-100 shadow-sm flex-shrink-0">
        <label className="input input-bordered flex items-center gap-2 w-full max-w-2xl">
          <svg
            className="h-5 w-5 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Tìm kiếm địa điểm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      {/* Map container - takes remaining height */}
      <div className="relative flex-1 w-full overflow-hidden">
        <div className="absolute inset-0">
          <MapView isPlacingMarker={placingMode} />
          <MapControlButton 
            placingMode={placingMode} 
            onToggle={handleTogglePlacing} 
          />
        </div>
      </div>

      {/* Dock - fixed at bottom */}
      <div className={`flex-shrink-0 ${placingMode ? 'hidden md:block' : 'block'}`}>
        <Dock />
      </div>
    </div>
  );
};

export default Map;
