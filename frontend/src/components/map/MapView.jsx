import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../../config/mapConfig';
import { useMapInstance } from './useMapInstance';

function MapView({ isPlacingMarker, locations = [], mapInstanceRef }) {
    const isPlacingMarkerRef = useRef(isPlacingMarker);
    const locationMarkersRef = useRef([]);
    
    const {
        mapRef,
        mapInstanceRef: internalMapRef,
        userLocationRef,
        placeMarker,
        placeCustomMarker,
        drawRoute,
        initUserLocation
    } = useMapInstance();

    useEffect(() => {
        isPlacingMarkerRef.current = isPlacingMarker;
    }, [isPlacingMarker]);

    useEffect(() => {
        if (!mapRef.current || internalMapRef.current) return;

        internalMapRef.current = L.map(mapRef.current).setView(
            [MAP_CONFIG.center.lat, MAP_CONFIG.center.lng],
            MAP_CONFIG.defaultZoom
        );

        if (mapInstanceRef) {
            mapInstanceRef.current = internalMapRef.current;
        }

        L.tileLayer(MAP_CONFIG.tileLayer.url, {
            attribution: MAP_CONFIG.tileLayer.attribution,
            maxZoom: MAP_CONFIG.tileLayer.maxZoom,
        }).addTo(internalMapRef.current);

        placeMarker(
            MAP_CONFIG.center.lat, 
            MAP_CONFIG.center.lng, 
            "Cổng chính UTE", 
            'red'
        );

        initUserLocation();

        internalMapRef.current.on('click', function(e) {
            if (isPlacingMarkerRef.current) {
                placeCustomMarker(e.latlng.lat, e.latlng.lng, 'Điểm đã chọn');
            }
        });

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
                MAP_CONFIG.center.lat, 
                MAP_CONFIG.center.lng, 
                endLat, 
                endLng
            );
        };

        return () => {
            if (internalMapRef.current) {
                internalMapRef.current.remove();
                internalMapRef.current = null;
                if (mapInstanceRef) {
                    mapInstanceRef.current = null;
                }
            }
            delete window.routeFromUser;
            delete window.routeFromGate;
        };
    }, []);

    // Không tự động hiển thị markers cho tất cả rooms
    // Markers sẽ chỉ được tạo khi user search và chọn một địa điểm

    useEffect(() => {
        if (internalMapRef.current) {
            internalMapRef.current.getContainer().style.cursor = 
                isPlacingMarker ? 'crosshair' : '';
        }
    }, [isPlacingMarker]);

    return <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />;
}

export default MapView;
