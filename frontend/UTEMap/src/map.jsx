import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// ==================== CẤU HÌNH ICONS ====================
const initMarkerIcons = () => {
  // Fix lỗi icon mặc định
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Khởi tạo icons
initMarkerIcons();

// Icon cho vị trí người dùng (màu xanh)
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icon cho marker tùy chỉnh (màu đỏ)
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// ==================== CẤU HÌNH BẢN ĐỒ ====================
const MAP_CONFIG = {
  center: [10.8506324, 106.7719131], // Tọa độ trung tâm trường
  zoom: 18,
  tileLayerUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// ==================== COMPONENT: THEO DÕI VỊ TRÍ NGƯỜI DÙNG ====================
/**
 * Tự động lấy và cập nhật vị trí hiện tại của người dùng
 */
function UserLocationTracker({ onLocationUpdate, onFirstLocationFound }) {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const hasFoundFirstLocation = useRef(false);

  useEffect(() => {
    // Bắt đầu theo dõi vị trí
    map.locate({ watch: true, enableHighAccuracy: true });

    const handleLocationFound = (e) => {
      setPosition(e.latlng);
      onLocationUpdate(e.latlng);

      // Gọi callback khi tìm thấy vị trí lần đầu
      if (!hasFoundFirstLocation.current) {
        hasFoundFirstLocation.current = true;
        onFirstLocationFound(e.latlng);
        // Di chuyển map đến vị trí người dùng
        map.setView(e.latlng, 18);
      }
    };

    const handleLocationError = (e) => {
      console.error('Location error:', e.message);
      alert('⚠️ Không thể xác định vị trí của bạn. Vui lòng cho phép truy cập vị trí!');
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    // Dọn dẹp khi component unmount
    return () => {
      map.stopLocate();
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
  }, [map, onLocationUpdate, onFirstLocationFound]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>📍 Vị trí hiện tại của bạn</Popup>
    </Marker>
  );
}

// ==================== COMPONENT: TÌM ĐƯỜNG ====================
/**
 * Hiển thị đường đi từ vị trí người dùng đến đích
 */
function RouteDisplay({ startLocation, endLocation }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !startLocation || !endLocation) return;

    // Xóa route cũ nếu có
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Tạo route mới
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(startLocation.lat, startLocation.lng),
        L.latLng(endLocation[0], endLocation[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4 }]
      },
      show: true,
      createMarker: () => null, // Không tạo marker tự động
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      })
    }).addTo(map);

    // Dọn dẹp khi component unmount hoặc route thay đổi
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, startLocation, endLocation]);

  return null;
}

// ==================== COMPONENT: XỬ LÝ CLICK ĐỂ ĐẶT MARKER ====================
/**
 * Lắng nghe sự kiện click trên map để đặt marker mới
 */
function MapClickListener({ onMapClick, isDisabled }) {
  const map = useMap();

  useEffect(() => {
    if (isDisabled) return;

    const handleClick = (e) => {
      onMapClick(e.latlng);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick, isDisabled]);

  return null;
}

// ==================== COMPONENT: HIỂN THỊ MARKER TÙY CHỈNH ====================
/**
 * Render một marker với popup chứa các nút chức năng
 */
function CustomMarker({ marker, onFindRoute, onDelete }) {
  return (
    <Marker position={marker.position} icon={customMarkerIcon}>
      <Popup>
        <div style={{ minWidth: '150px' }}>
          <strong>{marker.name}</strong>
          <br />
          <small>
            Lat: {marker.position[0].toFixed(6)}
            <br />
            Lng: {marker.position[1].toFixed(6)}
          </small>
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
            <button 
              onClick={() => onFindRoute(marker.position)}
              style={buttonStyles.primary}
            >
              🗺️ Tìm đường
            </button>
            <button 
              onClick={() => onDelete(marker.id)}
              style={buttonStyles.danger}
            >
              🗑️ Xóa
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// ==================== STYLES ====================
const buttonStyles = {
  primary: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: 1
  },
  danger: {
    padding: '8px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: 1
  },
  clearRoute: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    padding: '12px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  }
};

// ==================== COMPONENT CHÍNH ====================
function Map() {
  // ===== STATE QUẢN LÝ =====
  const [userLocation, setUserLocation] = useState(null);
  const [customMarkers, setCustomMarkers] = useState([]);
  const [routeDestination, setRouteDestination] = useState(null);
  const [initialMarkerCreated, setInitialMarkerCreated] = useState(false);

  // ===== XỬ LÝ VỊ TRÍ ĐẦU TIÊN =====
  const handleFirstLocationFound = (latlng) => {
    if (!initialMarkerCreated) {
      // Tạo marker tự động tại vị trí người dùng
      const initialMarker = {
        id: Date.now(),
        position: [latlng.lat, latlng.lng],
        name: '📍 Vị trí ban đầu của bạn'
      };
      setCustomMarkers([initialMarker]);
      setInitialMarkerCreated(true);
    }
  };

  // ===== XỬ LÝ ĐẶT MARKER =====
  const handleAddMarker = (latlng) => {
    const newMarker = {
      id: Date.now(),
      position: [latlng.lat, latlng.lng],
      name: `Điểm ${customMarkers.length + 1}`
    };
    setCustomMarkers(prevMarkers => [...prevMarkers, newMarker]);
  };

  // ===== XỬ LÝ XÓA MARKER =====
  const handleDeleteMarker = (markerId) => {
    setCustomMarkers(prevMarkers => 
      prevMarkers.filter(marker => marker.id !== markerId)
    );
  };

  // ===== XỬ LÝ TÌM ĐƯỜNG =====
  const handleFindRoute = (destination) => {
    if (!userLocation) {
      alert('⚠️ Đang xác định vị trí của bạn, vui lòng thử lại sau!');
      return;
    }
    setRouteDestination(destination);
  };

  // ===== XỬ LÝ XÓA ĐƯỜNG ĐI =====
  const handleClearRoute = () => {
    setRouteDestination(null);
  };

  // ===== RENDER =====
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Bản đồ chính */}
      <MapContainer 
        center={MAP_CONFIG.center} 
        zoom={MAP_CONFIG.zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Lớp bản đồ */}
        <TileLayer
          attribution={MAP_CONFIG.attribution}
          url={MAP_CONFIG.tileLayerUrl}
        />
        
        {/* Theo dõi vị trí người dùng */}
        <UserLocationTracker 
          onLocationUpdate={setUserLocation}
          onFirstLocationFound={handleFirstLocationFound}
        />
        
        {/* Lắng nghe click để đặt marker (tắt khi đang routing) */}
        <MapClickListener 
          onMapClick={handleAddMarker} 
          isDisabled={!!routeDestination} 
        />
        
        {/* Hiển thị đường đi nếu có */}
        {routeDestination && userLocation && (
          <RouteDisplay 
            startLocation={userLocation} 
            endLocation={routeDestination}
          />
        )}
        
        {/* Marker trung tâm trường */}
        <Marker position={MAP_CONFIG.center}>
          <Popup>
            <div>
              <strong>🏫 Trung tâm trường</strong>
              <br />
              <button 
                onClick={() => handleFindRoute(MAP_CONFIG.center)}
                style={{ ...buttonStyles.primary, marginTop: '10px', width: '100%' }}
              >
                🗺️ Tìm đường đến đây
              </button>
            </div>
          </Popup>
        </Marker>

        {/* Hiển thị tất cả marker tùy chỉnh */}
        {customMarkers.map((marker) => (
          <CustomMarker
            key={marker.id}
            marker={marker}
            onFindRoute={handleFindRoute}
            onDelete={handleDeleteMarker}
          />
        ))}
      </MapContainer>

      {/* Nút xóa đường đi (hiển thị khi đang routing) */}
      {routeDestination && (
        <button
          onClick={handleClearRoute}
          style={buttonStyles.clearRoute}
        >
          ❌ Xóa đường đi
        </button>
      )}
    </div>
  );
}

export default Map;
