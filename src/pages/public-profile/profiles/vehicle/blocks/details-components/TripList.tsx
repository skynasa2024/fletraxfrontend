import React from 'react';

interface Trip {
  distance: string;
  date: string;
  startTime: string;
  endTime: string;
  speed: number;
}

interface TripListProps {
  trips: Trip[];
  totalTrips?: number;
  className?: string;
  title?: string;
}

const TripList: React.FC<TripListProps> = ({
  trips,
  totalTrips,
  className = '',
  title = 'Trips'
}) => {
  return (
    <div className={`p-4 card lg:w-1/3 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-gray-500 text-sm">
          {totalTrips || trips.length} Trips
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="text-xl font-semibold">{trip.distance}</div>
             
              <div className="text-gray-500">
                {trip.date}
                <div className="text-sm">{trip.startTime}</div>
              </div>
              <div className="text-gray-500">
                {trip.date}
                <div className="text-sm">{trip.endTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{trip.speed}</span>
              </div>
              <span className="text-sm text-gray-500">kmh</span>
            </div>
          </div>
        ))}
        
        {trips.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No trips available
          </div>
        )}
      </div>
    </div>
  );
};

export default TripList;