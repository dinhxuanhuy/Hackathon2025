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
  const [isSearching, setIsSearching] = useState(true);
  const map = useMap();
  const hasFoundFirstLocation = useRef(false);
  const locationCircleRef = useRef(null);
  const hasShownError = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Timeout sau 10 giây nếu không tìm thấy vị trí
    timeoutRef.current = setTimeout(() => {
      if (!hasFoundFirstLocation.current && !hasShownError.current) {
        hasShownError.current = true;
        setIsSearching(false);
        alert('⏱️ Không thể xác định vị trí của bạn trong thời gian cho phép. Vui lòng kiểm tra:\n- Đã bật GPS/Location Services\n- Đã cho phép trình duyệt truy cập vị trí\n- Có kết nối internet ổn định');
      }
    }, 10000);

    // Bắt đầu theo dõi vị trí
    map.locate({ watch: true, enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });

    const handleLocationFound = (e) => {
      clearTimeout(timeoutRef.current);
      setIsSearching(false);
      setPosition(e.latlng);
      onLocationUpdate(e.latlng);

      // Xóa circle cũ nếu có
      if (locationCircleRef.current) {
        map.removeLayer(locationCircleRef.current);
      }

      // Tạo circle hiển thị độ chính xác
      locationCircleRef.current = L.circle(e.latlng, {
        radius: e.accuracy / 2,
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.15,
        weight: 2
      }).addTo(map);

      // Gọi callback khi tìm thấy vị trí lần đầu
      if (!hasFoundFirstLocation.current) {
        hasFoundFirstLocation.current = true;
        onFirstLocationFound(e.latlng);
        // Di chuyển map đến vị trí người dùng
        map.setView(e.latlng, 18);
      }
    };

    const handleLocationError = (e) => {
      clearTimeout(timeoutRef.current);
      setIsSearching(false);
      console.error('Location error:', e.message);
      
      // Chỉ hiển thị alert một lần
      if (!hasShownError.current) {
        hasShownError.current = true;
        let errorMsg = '⚠️ Không thể xác định vị trí của bạn.\n\n';
        
        if (e.code === 1) {
          errorMsg += 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt!';
        } else if (e.code === 2) {
          errorMsg += 'Không thể xác định vị trí. Vui lòng kiểm tra GPS/kết nối mạng.';
        } else if (e.code === 3) {
          errorMsg += 'Hết thời gian chờ. Vui lòng thử lại!';
        } else {
          errorMsg += 'Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt!';
        }
        
        alert(errorMsg);
      }
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    // Dọn dẹp khi component unmount
    return () => {
      clearTimeout(timeoutRef.current);
      map.stopLocate();
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
      if (locationCircleRef.current) {
        map.removeLayer(locationCircleRef.current);
      }
    };
  }, [map, onLocationUpdate, onFirstLocationFound]);

  // Hiển thị loading indicator
  if (isSearching) {
    return null; // Loading được xử lý ở component cha
  }

  if (!position) return null;

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>
        <div>
          <strong>📍 Vị trí hiện tại</strong>
          <br />
          <small>
            Lat: {position.lat.toFixed(6)}
            <br />
            Lng: {position.lng.toFixed(6)}
          </small>
        </div>
      </Popup>
    </Marker>
  );
}

// ==================== COMPONENT: TÌM ĐƯỜNG ====================
/**
 * Hiển thị đường đi từ vị trí người dùng đến đích
 * Sử dụng GraphHopper API để có chất lượng routing tốt hơn
 */
function RouteDisplay({ startLocation, endLocation, startType }) {
  const map = useMap();
  const routingControlRef = useRef(null);
  const routeLineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  useEffect(() => {
    if (!map || !startLocation || !endLocation) return;

    // Xóa route và markers cũ nếu có
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
    }
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
    }

    const apiKey = import.meta.env.VITE_GRAB_HOPPER;

    // Icon cho điểm bắt đầu và kết thúc
    const startIcon = L.divIcon({
      html: '<div style="background-color: #34A853; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">A</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: ''
    });

    const endIcon = L.divIcon({
      html: '<div style="background-color: #EA4335; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">B</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: ''
    });

    // Sử dụng GraphHopper Routing API với nhiều tùy chọn
    const fetchRoute = async () => {
      try {
        // Các tham số nâng cao cho GraphHopper
        const params = new URLSearchParams({
          point: `${startLocation.lat},${startLocation.lng}`,
          point: `${endLocation[0]},${endLocation[1]}`,
          vehicle: 'foot',
          locale: 'vi',
          key: apiKey,
          points_encoded: 'false',
          instructions: 'true',
          elevation: 'false',
          calc_points: 'true',
          details: 'street_name,surface,max_speed',
          algorithm: 'alternative_route', // Tìm đường thay thế
          'ch.disable': 'true',
          'alternative_route.max_paths': '3', // Tối đa 3 đường
          'alternative_route.max_weight_factor': '1.5',
          'alternative_route.max_share_factor': '0.6'
        });

        const url = `https://graphhopper.com/api/1/route?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.paths && data.paths.length > 0) {
          // Lấy đường đi tốt nhất (đường đầu tiên)
          const path = data.paths[0];
          const coordinates = path.points.coordinates.map(coord => [coord[1], coord[0]]);
          
          // Vẽ đường chính trên map với hiệu ứng đẹp hơn
          routeLineRef.current = L.polyline(coordinates, {
            color: '#4285F4',
            weight: 8,
            opacity: 0.7,
            smoothFactor: 1,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(map);

          // Thêm border cho đường đi để nổi bật hơn
          L.polyline(coordinates, {
            color: '#1967D2',
            weight: 10,
            opacity: 0.4,
            smoothFactor: 1
          }).addTo(map).bringToBack();

          // Vẽ các đường thay thế (nếu có) với màu khác
          if (data.paths.length > 1) {
            data.paths.slice(1).forEach((altPath, index) => {
              const altCoords = altPath.points.coordinates.map(coord => [coord[1], coord[0]]);
              L.polyline(altCoords, {
                color: '#9E9E9E',
                weight: 5,
                opacity: 0.5,
                dashArray: '10, 10',
                smoothFactor: 1
              }).addTo(map);
            });
          }

          // Thêm marker điểm bắt đầu và kết thúc
          startMarkerRef.current = L.marker([startLocation.lat, startLocation.lng], { 
            icon: startIcon,
            zIndexOffset: 1000 
          }).addTo(map);

          endMarkerRef.current = L.marker([endLocation[0], endLocation[1]], { 
            icon: endIcon,
            zIndexOffset: 1000 
          }).addTo(map);

          // Fit map để hiển thị toàn bộ route với padding đẹp
          map.fitBounds(routeLineRef.current.getBounds(), { 
            padding: [80, 80],
            maxZoom: 17
          });

          // Tạo control panel cho hướng dẫn với thiết kế đẹp hơn
          const routeInfo = L.control({ position: 'topleft' });
          
          routeInfo.onAdd = function() {
            const div = L.DomUtil.create('div', 'route-info-panel');
            div.style.cssText = `
              background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
              padding: 16px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              max-width: 320px;
              max-height: 450px;
              overflow-y: auto;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              border: 1px solid rgba(0,0,0,0.1);
            `;

            const distance = (path.distance / 1000).toFixed(2);
            const time = Math.round(path.time / 60000);
            const startPoint = startType === 'school' ? '🏫 Cổng trường' : '📍 Vị trí hiện tại';

            // Phân tích chi tiết đường đi
            const streetNames = path.instructions
              .map(i => i.street_name)
              .filter(name => name && name !== '')
              .filter((name, index, self) => self.indexOf(name) === index);

            let html = `
              <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 3px solid #4285F4;">
                <div style="color: #4285F4; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                  <span>🗺️</span> Chỉ dẫn đường đi
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="background: rgba(255,255,255,0.2); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">A</div>
                  <div style="font-size: 13px; opacity: 0.9;">${startPoint}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="background: rgba(255,255,255,0.2); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">B</div>
                  <div style="font-size: 13px; opacity: 0.9;">Điểm đến</div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div style="background: #E8F5E9; padding: 10px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #2E7D32;">${distance}</div>
                  <div style="font-size: 11px; color: #666; margin-top: 2px;">km</div>
                </div>
                <div style="background: #E3F2FD; padding: 10px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #1976D2;">${time}</div>
                  <div style="font-size: 11px; color: #666; margin-top: 2px;">phút đi bộ</div>
                </div>
              </div>
            `;

            // Hiển thị số đường thay thế nếu có
            if (data.paths.length > 1) {
              html += `
                <div style="background: #FFF3E0; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 12px; color: #E65100;">
                  💡 Có ${data.paths.length} lộ trình khả dụng (đang hiện tuyến tốt nhất)
                </div>
              `;
            }

            // Hiển thị các đường đi qua (nếu có)
            if (streetNames.length > 0) {
              html += `
                <div style="background: #F5F5F5; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
                  <div style="font-weight: 600; margin-bottom: 6px; font-size: 13px; color: #333;">🛣️ Đi qua các tuyến đường:</div>
                  <div style="font-size: 12px; color: #666; line-height: 1.6;">
                    ${streetNames.slice(0, 5).join(' → ')}
                    ${streetNames.length > 5 ? '...' : ''}
                  </div>
                </div>
              `;
            }

            html += `
              <div style="border-top: 2px solid #E0E0E0; padding-top: 12px; margin-top: 12px;">
                <div style="font-weight: 600; margin-bottom: 10px; font-size: 14px; color: #333; display: flex; align-items: center; gap: 6px;">
                  <span>📋</span> Hướng dẫn từng bước
                </div>
                <ol style="margin: 0; padding-left: 20px; list-style: none; counter-reset: step-counter;">
            `;

            path.instructions.forEach((instruction, index) => {
              const dist = instruction.distance > 1000 
                ? `${(instruction.distance / 1000).toFixed(2)} km`
                : `${Math.round(instruction.distance)} m`;
              
              // Icon cho từng loại hướng dẫn
              let icon = '➡️';
              if (instruction.sign === 0) icon = '⬆️';
              else if (instruction.sign === -2) icon = '⬅️';
              else if (instruction.sign === 2) icon = '➡️';
              else if (instruction.sign === -3) icon = '↙️';
              else if (instruction.sign === 3) icon = '↘️';
              else if (instruction.sign === 4) icon = '🏁';
              
              html += `
                <li style="margin: 10px 0; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); counter-increment: step-counter; position: relative; padding-left: 40px;">
                  <div style="position: absolute; left: 10px; top: 10px; background: #4285F4; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">
                    ${index + 1}
                  </div>
                  <div style="line-height: 1.5;">
                    <span style="font-size: 16px; margin-right: 6px;">${icon}</span>
                    <strong style="color: #333;">${instruction.text}</strong>
                    <div style="margin-top: 4px; font-size: 12px; color: #888;">
                      ${dist}
                      ${instruction.street_name ? ` • ${instruction.street_name}` : ''}
                    </div>
                  </div>
                </li>
              `;
            });

            html += `</ol></div>`;
            
            // Thêm footer
            html += `
              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #E0E0E0; text-align: center; font-size: 11px; color: #999;">
                Powered by GraphHopper
              </div>
            `;
            
            div.innerHTML = html;

            // CSS cho scrollbar đẹp hơn
            div.style.overflowY = 'auto';
            const style = document.createElement('style');
            style.textContent = `
              .route-info-panel::-webkit-scrollbar {
                width: 8px;
              }
              .route-info-panel::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }
              .route-info-panel::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
              }
              .route-info-panel::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `;
            document.head.appendChild(style);

            // Ngăn chặn sự kiện click lan sang map
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);
            return div;
          };

          routingControlRef.current = routeInfo;
          routeInfo.addTo(map);

          console.log('✅ GraphHopper: Tìm thấy đường đi');
          console.log('📏 Khoảng cách:', distance, 'km');
          console.log('⏱️ Thời gian:', time, 'phút');
          console.log('🔄 Số lộ trình thay thế:', data.paths.length - 1);
        } else if (data.message) {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('❌ Lỗi GraphHopper API:', error);
        alert('⚠️ Không thể tìm được đường đi. Vui lòng thử lại!\n\nChi tiết: ' + error.message);
      }
    };

    fetchRoute();

    // Dọn dẹp khi component unmount hoặc route thay đổi
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
      if (startMarkerRef.current) {
        map.removeLayer(startMarkerRef.current);
        startMarkerRef.current = null;
      }
      if (endMarkerRef.current) {
        map.removeLayer(endMarkerRef.current);
        endMarkerRef.current = null;
      }
    };
  }, [map, startLocation, endLocation, startType]);

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
  const [showRouteOptions, setShowRouteOptions] = useState(false);

  return (
    <Marker position={marker.position} icon={customMarkerIcon}>
      <Popup>
        <div style={{ minWidth: '200px' }}>
          <strong>{marker.name}</strong>
          <br />
          <small>
            Lat: {marker.position[0].toFixed(6)}
            <br />
            Lng: {marker.position[1].toFixed(6)}
          </small>
          
          {!showRouteOptions ? (
            <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
              <button 
                onClick={() => setShowRouteOptions(true)}
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
          ) : (
            <div style={{ marginTop: '10px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Chọn điểm xuất phát:
              </div>
              <button 
                onClick={() => {
                  onFindRoute(marker.position, 'current');
                  setShowRouteOptions(false);
                }}
                style={{ ...buttonStyles.primary, width: '100%', marginBottom: '5px' }}
              >
                📍 Từ vị trí hiện tại
              </button>
              <button 
                onClick={() => {
                  onFindRoute(marker.position, 'school');
                  setShowRouteOptions(false);
                }}
                style={{ ...buttonStyles.primary, width: '100%', marginBottom: '5px', backgroundColor: '#FF9800' }}
              >
                🏫 Từ cổng trường
              </button>
              <button 
                onClick={() => setShowRouteOptions(false)}
                style={{ ...buttonStyles.danger, width: '100%', fontSize: '12px', padding: '6px' }}
              >
                ← Quay lại
              </button>
            </div>
          )}
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
  },
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    padding: '20px 30px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4285F4',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 15px'
  }
};

// ==================== COMPONENT CHÍNH ====================
function Map() {
  // ===== STATE QUẢN LÝ =====
  const [userLocation, setUserLocation] = useState(null);
  const [customMarkers, setCustomMarkers] = useState([]);
  const [routeDestination, setRouteDestination] = useState(null);
  const [routeStartType, setRouteStartType] = useState('current'); // 'current' hoặc 'school'
  const [initialMarkerCreated, setInitialMarkerCreated] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const markerCounterRef = useRef(1); // Dùng ref để đếm số thứ tự marker

  // ===== XỬ LÝ VỊ TRÍ ĐẦU TIÊN =====
  const handleFirstLocationFound = (latlng) => {
    setIsLoadingLocation(false);
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

  // Xử lý khi không tìm được vị trí (được gọi từ UserLocationTracker thông qua callback)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoadingLocation && !userLocation) {
        setIsLoadingLocation(false);
      }
    }, 15000); // Timeout sau 15 giây

    return () => clearTimeout(timer);
  }, [isLoadingLocation, userLocation]);

  // ===== XỬ LÝ ĐẶT MARKER =====
  const handleAddMarker = (latlng) => {
    const newMarker = {
      id: Date.now(),
      position: [latlng.lat, latlng.lng],
      name: `Điểm ${markerCounterRef.current}`
    };
    markerCounterRef.current += 1; // Tăng bộ đếm
    setCustomMarkers(prevMarkers => [...prevMarkers, newMarker]);
  };

  // ===== XỬ LÝ XÓA MARKER =====
  const handleDeleteMarker = (markerId) => {
    setCustomMarkers(prevMarkers => 
      prevMarkers.filter(marker => marker.id !== markerId)
    );
    // Không giảm counter để tránh trùng tên
  };

  // ===== XỬ LÝ TÌM ĐƯỜNG =====
  const handleFindRoute = (destination, startType = 'current') => {
    if (startType === 'current' && !userLocation) {
      alert('⚠️ Đang xác định vị trí của bạn, vui lòng thử lại sau!');
      return;
    }
    setRouteDestination(destination);
    setRouteStartType(startType);
  };

  // ===== XỬ LÝ XÓA ĐƯỜNG ĐI =====
  const handleClearRoute = () => {
    setRouteDestination(null);
  };

  // ===== RENDER =====
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Loading overlay khi đang tìm vị trí */}
      {isLoadingLocation && (
        <div style={buttonStyles.loadingOverlay}>
          <div style={buttonStyles.spinner}></div>
          <div style={{ color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
            🔍 Đang xác định vị trí của bạn...
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
            Vui lòng cho phép truy cập vị trí
          </div>
        </div>
      )}

      {/* CSS Animation cho spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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
        {routeDestination && (
          <RouteDisplay 
            startLocation={routeStartType === 'current' ? userLocation : { lat: MAP_CONFIG.center[0], lng: MAP_CONFIG.center[1] }}
            endLocation={routeDestination}
            startType={routeStartType}
          />
        )}
        
        {/* Marker trung tâm trường */}
        <Marker position={MAP_CONFIG.center}>
          <Popup>
            <div>
              <strong>🏫 Cổng trường</strong>
              <br />
              <small style={{ color: '#666' }}>Điểm xuất phát chính</small>
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
