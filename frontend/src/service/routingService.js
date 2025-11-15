// Service xử lý routing với GraphHopper API

const GRAB_HOPPER_KEY = import.meta.env.VITE_GRAB_HOPPER;

export async function fetchRoute(startLat, startLng, endLat, endLng, profile = 'foot') {
    const requestBody = {
        points: [
            [startLng, startLat],  // GraphHopper yêu cầu [lng, lat]
            [endLng, endLat]
        ],
        profile: profile,
        locale: "vi",
        instructions: true,
        calc_points: true,
        points_encoded: false
    };

    const url = `https://graphhopper.com/api/1/route?key=${GRAB_HOPPER_KEY}`;
    
    console.log('Request URL:', url);
    console.log('Request Body:', requestBody);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Response:', data);

    if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(`API Error: ${response.status} - ${data.message || 'Unknown error'}`);
    }

    if (!data || !data.paths || data.paths.length === 0) {
        throw new Error('Không tìm thấy đường đi');
    }

    return data.paths[0];
}

export function convertCoordinates(path) {
    if (!path.points || !path.points.coordinates) {
        throw new Error('No coordinates in response');
    }
    
    // GraphHopper trả về [lng, lat], cần đổi thành [lat, lng] cho Leaflet
    return path.points.coordinates.map(coord => [coord[1], coord[0]]);
}

export function formatRouteInfo(path) {
    const distance = (path.distance / 1000).toFixed(2); // km
    const duration = Math.round(path.time / 1000 / 60); // phút
    
    return { distance, duration };
}

export function getInstructions(path, limit = 3) {
    if (!path.instructions || path.instructions.length === 0) {
        return [];
    }
    
    return path.instructions.slice(0, limit).map(inst => inst.text);
}
