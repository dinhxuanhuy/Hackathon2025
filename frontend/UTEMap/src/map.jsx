import React, { useEffect, useRef } from 'react';

//process env

export const GOOGLE_API_KEY = import .meta.env.VITE_GOOGLE_API_KEY;
export const MAPS_ID = import.meta.env.VITE_MAP_ID;
console.log('MAPS_ID:', MAPS_ID);


export default function GoogleMap({
    center = { lat: 37.7749, lng: -122.4194 },
    zoom = 12,
    style = { width: '100%', height: '400px' },
}) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initMap = () => {
            if (!window.google || !window.google.maps) return;
            if (mapRef.current && !mapRef.current.__mapInitialized) {
                new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    mapId: MAPS_ID || undefined,
                });
                mapRef.current.__mapInitialized = true;
            }
        };

        if (window.google && window.google.maps) {
            initMap();
            return;
        }

        const existing = document.querySelector('script[data-google-maps]');
        if (existing) {
            existing.addEventListener('load', initMap, { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=weekly&map_ids=${MAPS_ID || ''}`;
        script.async = true;
        script.defer = true;
        script.setAttribute('data-google-maps', 'true');
        script.addEventListener('load', initMap, { once: true });
        document.head.appendChild(script);

        // no explicit cleanup required for the injected script
    }, [center, zoom]);

    return <div ref={mapRef} style={style} />;
}