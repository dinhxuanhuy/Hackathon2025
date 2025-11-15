import React, { useState, useEffect } from 'react';

const LocationSearch = ({ mapInstance, locations = [] }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = locations.filter(loc =>
      loc.name?.toLowerCase().includes(query.toLowerCase()) ||
      loc.description?.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setShowResults(filtered.length > 0);
  }, [query, locations]);

  const handleSelectLocation = (location) => {
    if (mapInstance) {
      mapInstance.flyTo([location.latitude, location.longitude], 18);
    }
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
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
          placeholder="Tìm kiếm địa điểm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {query && (
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

      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-base-100 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(location)}
              className="w-full px-4 py-3 text-left hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0"
            >
              <div className="font-semibold">{location.name}</div>
              {location.description && (
                <div className="text-sm text-base-content/70">{location.description}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
