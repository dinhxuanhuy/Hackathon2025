// Hook tùy chỉnh để quản lý map instance và routing

import { useRef } from 'react';
import L from 'leaflet';
import { MAP_CONFIG, MARKER_ICONS } from '../../config/mapConfig';
import { fetchRoute, convertCoordinates, formatRouteInfo, getInstructions } from '../../service/routingService';
import { getUserLocation } from '../../service/geolocationService';

export function useMapInstance() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userLocationRef = useRef(null);
    const currentRouteLineRef = useRef(null);
    const placedMarkersRef = useRef([]);

    const placeMarker = (lat, lng, label = null, color = 'custom') => {
        if (!mapInstanceRef.current) return;

        const markerIcon = L.icon({
            iconUrl: color === 'red' ? MARKER_ICONS.user.iconUrl : MARKER_ICONS.custom.iconUrl,
            iconSize: MARKER_ICONS.user.iconSize,
            iconAnchor: MARKER_ICONS.user.iconAnchor,
            popupAnchor: MARKER_ICONS.user.popupAnchor,
            shadowUrl: MARKER_ICONS.user.shadowUrl,
            shadowSize: MARKER_ICONS.user.shadowSize
        });

        const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstanceRef.current);
        
        if (label) {
            marker.bindPopup(label).openPopup();
        }

        return marker;
    };

    const placeCustomMarker = (lat, lng, label = 'Marker') => {
        if (!mapInstanceRef.current) return;

        const marker = placeMarker(lat, lng, null, 'custom');
        placedMarkersRef.current.push(marker);

        const popupContent = `
            <div style="text-align: center;">
                <strong>${label}</strong><br/>
                <button onclick="window.routeFromUser(${lat}, ${lng})" style="margin: 5px; padding: 5px 10px; cursor: pointer;">
                    Đường từ vị trí hiện tại
                </button><br/>
                <button onclick="window.routeFromGate(${lat}, ${lng})" style="margin: 5px; padding: 5px 10px; cursor: pointer;">
                    Đường từ cổng chính
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        return marker;
    };

    const drawRoute = async (startLat, startLng, endLat, endLng) => {
        if (!mapInstanceRef.current) return;

        try {
            // Xóa route cũ
            if (currentRouteLineRef.current) {
                mapInstanceRef.current.removeLayer(currentRouteLineRef.current);
                currentRouteLineRef.current = null;
            }

            // Fetch route từ API
            const path = await fetchRoute(startLat, startLng, endLat, endLng);
            
            // Convert coordinates
            const coordinates = convertCoordinates(path);
            
            // Vẽ đường trên map
            currentRouteLineRef.current = L.polyline(coordinates, {
                color: '#6FA1EC',
                weight: 4,
                opacity: 0.8
            }).addTo(mapInstanceRef.current);

            // Fit map
            mapInstanceRef.current.fitBounds(currentRouteLineRef.current.getBounds(), {
                padding: [50, 50]
            });

            // Hiển thị thông tin
            const { distance, duration } = formatRouteInfo(path);
            const instructions = getInstructions(path, 3);
            
            let popupContent = `<div style="text-align: center;">
                <b>Khoảng cách:</b> ${distance} km<br/>
                <b>Thời gian:</b> ${duration} phút`;
            
            if (instructions.length > 0) {
                popupContent += `<br/><br/><b>Hướng dẫn:</b><br/>`;
                instructions.forEach((text, idx) => {
                    popupContent += `${idx + 1}. ${text}<br/>`;
                });
            }
            
            popupContent += `</div>`;
            
            L.popup()
                .setLatLng([endLat, endLng])
                .setContent(popupContent)
                .openOn(mapInstanceRef.current);

        } catch (error) {
            console.error('Error drawing route:', error);
            alert(`Lỗi khi tìm đường: ${error.message}`);
        }
    };

    const initUserLocation = () => {
        getUserLocation(
            (location) => {
                userLocationRef.current = location;
                if (mapInstanceRef.current) {
                    placeMarker(location.lat, location.lng, 'Vị trí của bạn', 'red');
                    mapInstanceRef.current.setView([location.lat, location.lng], 18);
                }
            },
            (error) => {
                console.warn('User location error:', error);
            }
        );
    };

    return {
        mapRef,
        mapInstanceRef,
        userLocationRef,
        placeMarker,
        placeCustomMarker,
        drawRoute,
        initUserLocation,
        placedMarkersRef
    };
}
