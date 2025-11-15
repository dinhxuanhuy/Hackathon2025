import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import MapView from "../components/map/MapView";
import MapControlButton from "../components/map/MapControlButton";
import LocationSearch from "../components/map/LocationSearch";
import { Rooms } from "../service/roomService";

const Map = () => {
  const [placingMode, setPlacingMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapInstanceRef = useRef(null);

  // Load rooms từ API khi component mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await Rooms();
      console.log('Raw API data:', data);
      
      // Nếu API trả về empty hoặc lỗi, dùng mock data
      if (!data || data.length === 0) {
        console.warn('No data from API, using mock data');
        const mockData = [
          {
            RoomID: "1",
            RoomName: "Cổng Phụ 1 Lê văn Chí",
            AddressX: 10.851061610944525,
            AddressY: 106.77409413697416,
            Capacity: null,
            Status: "Trống"
          },
          {
            RoomID: "2",
            RoomName: "Cổng chính UTE",
            AddressX: 10.8509,
            AddressY: 106.7718,
            Capacity: null,
            Status: "Trống"
          },
          {
            RoomID: "3",
            RoomName: "Phòng A001",
            AddressX: 10.85095,
            AddressY: 106.77185,
            Capacity: 50,
            Status: "Đang sử dụng"
          }
        ];
        
        const transformedLocations = mockData.map(room => ({
          id: room.RoomID,
          name: room.RoomName,
          latitude: parseFloat(room.AddressX),
          longitude: parseFloat(room.AddressY),
          capacity: room.Capacity,
          status: room.Status,
          type: 'room'
        }));
        
        console.log('Using mock data:', transformedLocations);
        setLocations(transformedLocations);
        return;
      }
      
      // Transform API data sang format cho map
      const transformedLocations = data.map(room => ({
        id: room.RoomID,
        name: room.RoomName,
        latitude: parseFloat(room.AddressX),
        longitude: parseFloat(room.AddressY),
        capacity: room.Capacity,
        status: room.Status,
        type: 'room'
      }));
      
      console.log('Transformed locations:', transformedLocations);
      setLocations(transformedLocations);
    } catch (error) {
      console.error('Error loading rooms:', error);
      // Fallback to mock data on error
      setLocations([
        {
          id: "1",
          name: "Cổng Phụ 1 Lê văn Chí",
          latitude: 10.851061610944525,
          longitude: 106.77409413697416,
          capacity: null,
          status: "Trống",
          type: 'room'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlacing = () => {
    setPlacingMode(!placingMode);
    if (!placingMode) {
      if (window.innerWidth >= 768) {
        alert('Click vào map để đặt marker. Click nút lại để tắt chế độ đặt marker.');
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-base-200 overflow-hidden">
      <Navbar />
      
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
      <div className={`flex-shrink-0 ${placingMode ? 'hidden md:block' : 'block'}`}>
        <Dock />
      </div>
    </div>
  );
};

export default Map;
