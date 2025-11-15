import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import MapView from "../components/map/MapView";
import MapControlButton from "../components/map/MapControlButton";
import LocationSearch from "../components/map/LocationSearch";
import { Rooms } from "../service/roomService";
import { useSearchParams } from "react-router-dom";

const Map = () => {
  const [placingMode, setPlacingMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapInstanceRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Load rooms từ API khi component mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await Rooms();
      console.log("Raw API data:", data);

      // Nếu API trả về empty hoặc lỗi, dùng mock data
      if (!data || data.length === 0) {
        console.warn("No data from API, using mock data");
        const mockData = [
          {
            RoomID: "1",
            RoomName: "Cổng Phụ 1 Lê văn Chí",
            AddressX: 10.851061610944525,
            AddressY: 106.77409413697416,
            Capacity: null,
            Status: "Trống",
          },
          {
            RoomID: "2",
            RoomName: "Cổng chính UTE",
            AddressX: 10.8509,
            AddressY: 106.7718,
            Capacity: null,
            Status: "Trống",
          },
          {
            RoomID: "3",
            RoomName: "Phòng A001",
            AddressX: 10.85095,
            AddressY: 106.77185,
            Capacity: 50,
            Status: "Đang sử dụng",
          },
        ];

        const transformedLocations = mockData.map((room) => ({
          id: room.RoomID,
          name: room.RoomName,
          latitude: parseFloat(room.AddressX),
          longitude: parseFloat(room.AddressY),
          capacity: room.Capacity,
          status: room.Status,
          type: "room",
        }));

        console.log("Using mock data:", transformedLocations);
        setLocations(transformedLocations);
        return;
      }

      // Transform API data sang format cho map
      const transformedLocations = data.map((room) => ({
        id: room.RoomID,
        name: room.RoomName,
        latitude: parseFloat(room.AddressX),
        longitude: parseFloat(room.AddressY),
        capacity: room.Capacity,
        status: room.Status,
        type: "room",
      }));

      console.log("Transformed locations:", transformedLocations);
      setLocations(transformedLocations);
    } catch (error) {
      console.error("Error loading rooms:", error);
      // Fallback to mock data on error
      setLocations([
        {
          id: "1",
          name: "Cổng Phụ 1 Lê văn Chí",
          latitude: 10.851061610944525,
          longitude: 106.77409413697416,
          capacity: null,
          status: "Trống",
          type: "room",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlacing = () => {
    setPlacingMode(!placingMode);
    if (!placingMode) {
      if (window.innerWidth >= 768) {
        alert(
          "Click vào map để đặt marker. Click nút lại để tắt chế độ đặt marker."
        );
      }
    }
  };

  // Auto-search for room when URL contains room parameter
  useEffect(() => {
    const roomQuery = searchParams.get("room");
    if (roomQuery && locations.length > 0 && mapInstanceRef.current) {
      const foundRoom = locations.find(
        (loc) => loc.name.toLowerCase() === roomQuery.toLowerCase()
      );

      if (foundRoom) {
        console.log("Auto-navigating to room:", foundRoom);
        // Zoom to the found room
        mapInstanceRef.current.flyTo(
          [foundRoom.latitude, foundRoom.longitude],
          18,
          { duration: 1 }
        );

        // Create marker and popup (similar to LocationSearch)
        const iconUrl =
          foundRoom.status === "Trống"
            ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
            : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png";

        const customIcon = L.icon({
          iconUrl: iconUrl,
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const marker = L.marker([foundRoom.latitude, foundRoom.longitude], {
          icon: customIcon,
        }).addTo(mapInstanceRef.current);

        const popupContent = `
          <div style="text-align: center; min-width: 180px;">
            <strong style="font-size: 14px; display: block; margin-bottom: 8px;">${
              foundRoom.name
            }</strong>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; 
                         background-color: ${
                           foundRoom.status === "Trống" ? "#10b981" : "#f59e0b"
                         }; color: white;">
              ${foundRoom.status}
            </span>
            ${
              foundRoom.capacity
                ? `<div style="margin-top: 5px; font-size: 12px; color: #666;">👥 ${foundRoom.capacity} người</div>`
                : ""
            }
            <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 4px;">
              <button onclick="window.routeFromUser(${foundRoom.latitude}, ${
          foundRoom.longitude
        })" 
                      style="padding: 6px 12px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                📍 Từ vị trí hiện tại
              </button>
              <button onclick="window.routeFromGate(${foundRoom.latitude}, ${
          foundRoom.longitude
        })" 
                      style="padding: 6px 12px; cursor: pointer; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                🚪 Từ cổng chính
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent).openPopup();
      }
    }
  }, [searchParams, locations]);

  return (
    <div className="h-screen w-screen flex flex-col bg-base-200 overflow-hidden">
      <Navbar />
      <div class="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

      {/* Search bar with autocomplete */}
      <div className="flex justify-center px-4 py-3 md:py-5 bg-base-100 shadow-sm flex-shrink-0">
        <LocationSearch
          locations={locations}
          mapInstanceRef={mapInstanceRef}
          loading={loading}
        />
      </div>

      {/* Map container - takes remaining height */}
      <div className="relative flex-1 w-full overflow-hidden">
        <div className="absolute inset-0">
          <MapView
            isPlacingMarker={placingMode}
            locations={locations}
            mapInstanceRef={mapInstanceRef}
          />
          <MapControlButton
            placingMode={placingMode}
            onToggle={handleTogglePlacing}
          />
        </div>
      </div>

      {/* Dock - fixed at bottom */}
      <div
        className={`flex-shrink-0 ${placingMode ? "hidden md:block" : "block"}`}
      >
        <Dock />
      </div>
    </div>
  );
};

export default Map;
