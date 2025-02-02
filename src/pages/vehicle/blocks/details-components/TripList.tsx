import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';
import MapPin from '../svg/MapPin';
import { searchTrips, Trip } from '@/api/trips';

interface TripListProps {
  deviceIdent?: string;
}

const SpeedIndicator = ({ speed, maxSpeed = 280 }: { speed: number; maxSpeed?: number }) => (
  <div className="w-20 h-20">
    <CircularProgressbar
      value={speed}
      maxValue={maxSpeed}
      text={`${speed}`}
      styles={{
        path: { stroke: speed > 120 ? 'red' : '#FFB200' },
        text: { fontSize: '24px', fill: '#000', dominantBaseline: 'middle', textAnchor: 'middle' },
        trail: { stroke: '#F5F5F5' }
      }}
    />
    <div className="text-center text-xs mt-1">kmh</div>
  </div>
);

const TripList: React.FC<TripListProps> = ({ deviceIdent }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [paginationMarker, setPaginationMarker] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!deviceIdent) return;
    (async () => {
      const groups = await searchTrips({ query: deviceIdent });
      const newTrips = groups.map((group) => group.trips).flat();
      setTrips(newTrips);
      if (groups.length < 2) {
        setHasMore(false);
      } else {
        const lastGroup = groups[groups.length - 1];
        setPaginationMarker(lastGroup.id);
      }
    })();
  }, [deviceIdent]);

  const loadMoreRows = async () => {
    if (!deviceIdent || loading || !hasMore) return;
    setLoading(true);
    const params: any = { query: deviceIdent };
    if (paginationMarker) {
      params.endDate = paginationMarker;
    }
    const groups = await searchTrips(params);
    const newTrips = groups.map((group) => group.trips).flat();
    if (newTrips.length === 0) {
      setHasMore(false);
    } else {
      setTrips((prev) => [...prev, ...newTrips]);
      const lastGroup = groups[groups.length - 1];
      setPaginationMarker(lastGroup.id);
      if (groups.length < 2) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  const loadMoreRowsWrapper = ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    return loadMoreRows();
  };

  const isRowLoaded = ({ index }: { index: number }) => index < trips.length;

  const rowRenderer = ({
    index,
    key,
    style
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    if (!isRowLoaded({ index })) {
      return (
        <div key={key} style={style} className="p-4 text-center text-gray-500">
          Loading...
        </div>
      );
    }
    const trip = trips[index];
    return (
      <div
        key={key}
        style={style}
        className="p-4 rounded-lg flex justify-between items-center border-b border-gray-200"
      >
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center space-x-4 grow">
            <div className="text-lg font-medium w-16">{trip.mileage.toFixed(3)} KM</div>
            <MapPin />
          </div>
          <div className="w-1/3 text-gray-800 text-lg">
            {trip.startDate.toLocaleDateString()}
            <br />
            <div className="text-gray-400 text-md">{trip.startDate.toLocaleTimeString()}</div>
          </div>
          <div className="w-1/3 text-gray-800 text-lg">
            {trip.endDate.toLocaleDateString()}
            <br />
            <div className="text-gray-400 text-md">{trip.endDate.toLocaleTimeString()}</div>
          </div>
        </div>
        <SpeedIndicator
          speed={Math.round(trip.maxSpeed) || 1}
          maxSpeed={Math.round(trip.maxSpeed) || 1}
        />
      </div>
    );
  };

  const rowCount = hasMore ? trips.length + 1 : trips.length;

  return (
    <div className="p-4 card hover:shadow-md lg:w-1/2 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trips</h2>
        <span className="text-gray-500 text-sm">{trips.length} Trips</span>
      </div>
      {trips.length === 0 && !hasMore ? (
        <div className="text-center text-gray-500 py-4">No trips available</div>
      ) : (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRowsWrapper}
          rowCount={rowCount}
          threshold={2}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  height={400}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={rowCount}
                  rowHeight={100}
                  rowRenderer={rowRenderer}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      )}
    </div>
  );
};

export default TripList;
