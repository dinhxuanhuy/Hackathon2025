import React from 'react';

function MapControlButton({ placingMode, onToggle }) {
    return (
        <button 
            onClick={onToggle}
            className={`
                fixed md:absolute top-20 md:top-4 right-4 z-[1000]
                px-4 py-2 md:px-5 md:py-3
                ${placingMode ? 'bg-error' : 'bg-success'}
                text-white font-bold rounded-lg
                shadow-lg hover:shadow-xl
                transition-all duration-200
                text-sm md:text-base
                active:scale-95
            `}
        >
            <span className="mr-2">{placingMode ? '🚫' : '📍'}</span>
            <span className="hidden sm:inline">
                {placingMode ? 'Tắt đặt marker' : 'Đặt marker'}
            </span>
            <span className="sm:hidden">
                {placingMode ? 'Tắt' : 'Đặt'}
            </span>
        </button>
    );
}

export default MapControlButton;
