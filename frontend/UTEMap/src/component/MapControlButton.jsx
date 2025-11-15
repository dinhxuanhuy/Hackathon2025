import React from 'react';

function MapControlButton({ placingMode, onToggle }) {
    return (
        <button 
            onClick={onToggle}
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                padding: '10px 20px',
                backgroundColor: placingMode ? '#ff4444' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
        >
            {placingMode ? '🚫 Tắt đặt marker' : '📍 Đặt marker'}
        </button>
    );
}

export default MapControlButton;
