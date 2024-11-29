import React, { useState } from 'react';

interface GeofenceListProps {
  items: string[];
  title?: string;
  className?: string;
  onItemClick?: (item: string) => void;
  searchPlaceholder?: string;
}

const GeofenceList: React.FC<GeofenceListProps> = ({
  items,
  title = "Geofences",
  className = "",
  onItemClick,
  searchPlaceholder = "Search..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md w-80 flex-grow ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <input
        type="text"
        placeholder={searchPlaceholder}
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-y-auto h-80">
        <ul className="space-y-2">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              className="p-2 border rounded hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              onClick={() => onItemClick?.(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 py-4">No items found</p>
        )}
      </div>
    </div>
  );
};

export default GeofenceList;