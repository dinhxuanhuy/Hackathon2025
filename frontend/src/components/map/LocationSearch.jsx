import React, { useState, useEffect, useRef } from 'react';

const LocationSearch = ({ locations = [], mapInstanceRef, loading = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    console.log('Search query:', query, 'Locations:', locations.length);
    
    // Tìm kiếm ngay cả với 1 ký tự
    if (query.length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Lọc theo bất kỳ ký tự nào trong RoomName
    const filtered = locations.filter(loc =>
      loc.name?.toLowerCase().includes(query.toLowerCase())
    );

    console.log('Filtered results:', filtered);
    setResults(filtered);
    setShowResults(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query, locations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (location) => {
    console.log('Selected room:', location);

    if (mapInstanceRef.current) {
      // Zoom đến vị trí với animation
      mapInstanceRef.current.flyTo([location.latitude, location.longitude], 18, {
        duration: 1
      });
      
      // Tạo marker cho địa điểm được search
      const iconUrl = location.status === 'Trống'
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png';

      const customIcon = L.icon({
        iconUrl: iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Tạo marker mới
      const marker = L.marker([location.latitude, location.longitude], {
        icon: customIcon
      }).addTo(mapInstanceRef.current);

      // Tạo popup với thông tin chi tiết
      const popupContent = `
        <div style="text-align: center; min-width: 180px;">
          <strong style="font-size: 14px; display: block; margin-bottom: 8px;">${location.name}</strong>
          <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; 
                       background-color: ${location.status === 'Trống' ? '#10b981' : '#f59e0b'}; color: white;">
            ${location.status}
          </span>
          ${location.capacity ? `<div style="margin-top: 5px; font-size: 12px; color: #666;">👥 ${location.capacity} người</div>` : ''}
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 4px;">
            <button onclick="window.routeFromUser(${location.latitude}, ${location.longitude})" 
                    style="padding: 6px 12px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
              📍 Từ vị trí hiện tại
            </button>
            <button onclick="window.routeFromGate(${location.latitude}, ${location.longitude})" 
                    style="padding: 6px 12px; cursor: pointer; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
              🚪 Từ cổng chính
            </button>
          </div>
        </div>
      `;
      
      // Bind popup và mở ngay
      marker.bindPopup(popupContent).openPopup();
    }
    
    setQuery('');
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectLocation(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <label className="input input-bordered flex items-center gap-2 w-full">
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
          placeholder="Tìm kiếm địa điểm (gõ 1 ký tự trở lên)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onKeyDown={handleKeyDown}
        />
        {loading && (
          <span className="loading loading-spinner loading-sm"></span>
        )}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
            }}
            className="btn btn-ghost btn-xs btn-circle"
          >
            ✕
          </button>
        )}
      </label>

      {/* Autocomplete dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-base-100 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto border border-base-300">
          <div className="p-2">
            <div className="text-xs text-base-content/60 px-2 py-1 font-semibold">
              {results.length} kết quả
            </div>
            {results.map((location, index) => (
              <button
                key={location.id}
                onClick={() => handleSelectLocation(location)}
                className={`
                  w-full px-3 py-3 text-left rounded-lg
                  transition-all duration-150
                  ${selectedIndex === index ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
                  border-b border-base-300 last:border-b-0
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {location.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        badge badge-sm
                        ${location.status === 'Trống' ? 'badge-success' : 'badge-warning'}
                      `}>
                        {location.status}
                      </span>
                      {location.capacity && (
                        <span className="text-xs text-base-content/60">
                          👥 {location.capacity} người
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-base-content/50 flex-shrink-0">
                    📍
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {showResults && results.length === 0 && query.length >= 1 && (
        <div className="absolute top-full mt-2 w-full bg-base-100 rounded-lg shadow-xl z-50 p-4 text-center border border-base-300">
          <div className="text-base-content/60">
            Không tìm thấy địa điểm "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
