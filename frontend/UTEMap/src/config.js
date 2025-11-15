// ==================== CẤU HÌNH API KEYS ====================
export const API_KEYS = {
  graphHopper: import.meta.env.VITE_GRAPHHOPPER_API_KEY || '176cb454-db9d-4e30-a9be-77c39082fb61',
  googleMaps: import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyAUCCeK8e7wAZ9Hy9pUW9YdfvNwADlODgU',
  mapId: import.meta.env.VITE_MAP_ID || '8cdb7be21fcd767c28fee6bb'
};

// ==================== CẤU HÌNH BẢN ĐỒ ====================
export const MAP_CONFIG = {
  // Tọa độ trung tâm (Trường Đại học UTE)
  center: {
    lat: 10.849926,
    lng: 106.771632,
    label: 'Cổng chính UTE'
  },
  
  // Mức zoom mặc định
  defaultZoom: 18,
  minZoom: 10,
  maxZoom: 20,
  
  // TileLayer OpenStreetMap
  tileLayer: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }
};

// ==================== CẤU HÌNH GEOLOCATION ====================
export const GEOLOCATION_CONFIG = {
  // Tùy chọn cho navigator.geolocation.watchPosition
  options: {
    enableHighAccuracy: true, // Độ chính xác cao (GPS)
    timeout: 15000,           // Timeout 15 giây
    maximumAge: 0             // Không dùng cache
  },
  
  // Timeout tự xử lý (10 giây)
  customTimeout: 10000,
  
  // Interval cập nhật vị trí (ms)
  updateInterval: 5000
};

// ==================== CẤU HÌNH MARKER ICONS ====================
export const MARKER_ICONS = {
  user: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  },
  
  custom: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  },
  
  routeStart: {
    html: '<div style="background-color: #4CAF50; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  },
  
  routeEnd: {
    html: '<div style="background-color: #F44336; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  }
};

// ==================== CẤU HÌNH ROUTING ====================
export const ROUTING_CONFIG = {
  // GraphHopper API
  graphHopper: {
    baseUrl: 'https://graphhopper.com/api/1/route',
    vehicle: 'foot',        // Phương tiện: foot, car, bike
    locale: 'vi',           // Ngôn ngữ
    points_encoded: false,  // Không encode điểm
    instructions: true,     // Hiển thị hướng dẫn
    calc_points: true,      // Tính toán điểm
    alternative_route: {
      max_paths: 3,         // Số đường thay thế
      max_weight_factor: 1.5,
      max_share_factor: 0.6
    }
  },
  
  // Style cho đường đi
  routeStyles: {
    main: {
      color: '#4285F4',
      weight: 6,
      opacity: 0.8,
      lineJoin: 'round',
      lineCap: 'round'
    },
    border: {
      color: '#1a5dc4',
      weight: 8,
      opacity: 0.4
    },
    alternative: {
      color: '#888888',
      weight: 4,
      opacity: 0.5,
      dashArray: '10, 5'
    }
  },
  
  // Style cho vòng tròn độ chính xác GPS
  accuracyCircle: {
    color: '#4285F4',
    fillColor: '#4285F4',
    fillOpacity: 0.1,
    weight: 2,
    opacity: 0.5
  }
};

// ==================== CẤU HÌNH UI ====================
export const UI_CONFIG = {
  // Style cho các nút
  buttons: {
    primary: {
      backgroundColor: '#4285F4',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    
    danger: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    }
  },
  
  // Thông báo
  messages: {
    locationDenied: '⚠️ Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật trong cài đặt trình duyệt!',
    locationUnavailable: '⚠️ Không thể xác định vị trí của bạn. Kiểm tra kết nối GPS/mạng!',
    locationTimeout: '⚠️ Hết thời gian chờ xác định vị trí. Vui lòng thử lại!',
    routingError: '⚠️ Không thể tìm được đường đi. Vui lòng thử lại hoặc chọn điểm khác!',
    loadingLocation: '🔄 Đang xác định vị trí của bạn...'
  }
};

// ==================== CẤU HÌNH ĐỊA ĐIỂM QUAN TRỌNG ====================
export const IMPORTANT_LOCATIONS = {
  mainGate: {
    name: 'Cổng chính UTE',
    lat: 10.8506324,
    lng: 106.7719131,
    description: 'Cổng chính Trường Đại học Sư phạm Kỹ thuật TP.HCM'
  },
  // Có thể thêm các địa điểm khác
  library: {
    name: 'Thư viện',
    lat: 10.8508,
    lng: 106.7720,
    description: 'Thư viện trường'
  },
  cafeteria: {
    name: 'Căng tin',
    lat: 10.8505,
    lng: 106.7718,
    description: 'Căng tin sinh viên'
  }
};

// ==================== CẤU HÌNH DEVELOPMENT ====================
export const DEV_CONFIG = {
  enableDebugLogs: import.meta.env.DEV, // Chỉ log trong môi trường dev
  mockUserLocation: null, // Set coordinates để test: { lat: 10.850, lng: 106.771 }
  apiTimeout: 30000 // Timeout cho API calls (ms)
};

// ==================== HELPER FUNCTIONS ====================
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

export const formatDuration = (seconds) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} giờ ${mins} phút`;
};

export const getDirectionIcon = (sign) => {
  const icons = {
    0: '⬆️',  // Straight
    1: '↗️',  // Slight right
    2: '➡️',  // Right
    3: '↘️',  // Sharp right
    4: '⬇️',  // U-turn
    5: '↙️',  // Sharp left
    6: '⬅️',  // Left
    7: '↖️',  // Slight left
    '-1': '🚩' // Waypoint
  };
  return icons[sign] || '➡️';
};