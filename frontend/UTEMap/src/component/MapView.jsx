import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import * as config from '../config.js';
import { useMapInstance } from '../hooks/useMapInstance';

function MapView({ onMapClick, isPlacingMarker }) {
    const isPlacingMarkerRef = useRef(isPlacingMarker);
    
    const {
        mapRef,
        mapInstanceRef,
        userLocationRef,
        placeMarker,
        placeCustomMarker,
        drawRoute,
        initUserLocation
    } = useMapInstance();

    // Cập nhật ref khi isPlacingMarker thay đổi
    useEffect(() => {
        isPlacingMarkerRef.current = isPlacingMarker;
    }, [isPlacingMarker]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Khởi tạo map
        mapInstanceRef.current = L.map(mapRef.current).setView(
            [config.MAP_CONFIG.center.lat, config.MAP_CONFIG.center.lng],
            config.MAP_CONFIG.defaultZoom
        );

        // Thêm tile layer
        L.tileLayer(config.MAP_CONFIG.tileLayer.url, {
            attribution: config.MAP_CONFIG.tileLayer.attribution,
            maxZoom: config.MAP_CONFIG.tileLayer.maxZoom,
        }).addTo(mapInstanceRef.current);

        // Đặt marker cổng chính
        placeMarker(
            config.MAP_CONFIG.center.lat, 
            config.MAP_CONFIG.center.lng, 
            "Cổng chính", 
            'red'
        );

        // Lấy vị trí người dùng
        initUserLocation();

        // Xử lý click trên map - sử dụng ref để có giá trị mới nhất
        mapInstanceRef.current.on('click', function(e) {
            if (isPlacingMarkerRef.current) {
                placeCustomMarker(e.latlng.lat, e.latlng.lng, 'Điểm đã chọn');
            }
        });

        // Expose functions cho popup buttons
        window.routeFromUser = function(endLat, endLng) {
            if (userLocationRef.current) {
                drawRoute(
                    userLocationRef.current.lat, 
                    userLocationRef.current.lng, 
                    endLat, 
                    endLng
                );
            } else {
                alert('Không tìm thấy vị trí của bạn. Vui lòng bật GPS và cho phép truy cập vị trí.');
            }
        };

        window.routeFromGate = function(endLat, endLng) {
            drawRoute(
                config.MAP_CONFIG.center.lat, 
                config.MAP_CONFIG.center.lng, 
                endLat, 
                endLng
            );
        };

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            delete window.routeFromUser;
            delete window.routeFromGate;
        };
    }, []);

    // Update cursor khi thay đổi chế độ đặt marker
    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.getContainer().style.cursor = 
                isPlacingMarker ? 'crosshair' : '';
        }
    }, [isPlacingMarker]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default MapView;
