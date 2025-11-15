import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import MapView from './component/MapView';
import MapControlButton from './component/MapControlButton';

function SchoolMap() {
    const [placingMode, setPlacingMode] = useState(false);

    const handleTogglePlacing = () => {
        setPlacingMode(!placingMode);
        if (!placingMode) {
            alert('Click vào map để đặt marker. Click nút lại để tắt chế độ đặt marker.');
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <MapView isPlacingMarker={placingMode} />
            <MapControlButton 
                placingMode={placingMode} 
                onToggle={handleTogglePlacing} 
            />
        </div>
    );
}

export default SchoolMap;
