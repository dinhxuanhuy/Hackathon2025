import React from 'react';

const RoutePanel = ({ distance, duration, instructions, onClose }) => {
  if (!distance && !duration) return null;

  return (
    <div className="route-info-panel">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold">Thông tin đường đi</h3>
        <button 
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Khoảng cách</div>
          <div className="stat-value text-2xl">{distance}</div>
          <div className="stat-desc">km</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Thời gian</div>
          <div className="stat-value text-2xl">{duration}</div>
          <div className="stat-desc">phút</div>
        </div>
      </div>

      {instructions && instructions.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-sm mb-2">Hướng dẫn:</h4>
          <ol className="text-sm space-y-1 max-h-32 overflow-y-auto">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-semibold">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RoutePanel;
