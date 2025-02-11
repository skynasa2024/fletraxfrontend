import React, { useEffect, useMemo, useRef, useState } from 'react';
import { searchTrips, Trip, TripGroup, TripPath } from '@/api/trips';
import TripCard from '@/pages/trips/blocks/TripCard';
import { TripsContext } from '@/pages/trips/providers/TripsContext';
import L from 'leaflet';
import { toAbsoluteUrl } from '@/utils';
import AppMap from '@/components/AppMap';
import { Marker, Polyline } from 'react-leaflet';
import { getColor } from '@/pages/trips/blocks/PolylineColors';

interface TripListProps {
  deviceIdent?: string;
}

const TripList: React.FC<TripListProps> = ({ deviceIdent }) => {
  const [selectedTrip, setSelectedTrip] = useState<TripGroup | Trip>();
  const [path, setPath] = useState<TripPath[]>();
  const [trips, setTrips] = useState<TripGroup[]>();
  const map = useRef<L.Map>(null);

  const providerValues = {
    searchDeviceQuery: '',
    setSearchDeviceQuery: () => {},
    startDate: undefined,
    setStartDate: () => {},
    endDate: undefined,
    setEndDate: () => {},
    startTime: undefined,
    setStartTime: () => {},
    endTime: undefined,
    setEndTime: () => {},
    search: () => {},
    trips: [],
    selectedTrip,
    setSelectedTrip
  };

  useEffect(() => {
    if (!deviceIdent) return;

    searchTrips({ query: deviceIdent }).then(setTrips);
  }, [deviceIdent]);

  useEffect(() => {
    if (!selectedTrip) {
      setPath(undefined);
      return;
    }

    const pathesMap: Record<number, TripPath> = {};

    if ('trips' in selectedTrip) {
      const pathes = selectedTrip.trips.map((trip) => trip.path).flat();
      pathes.forEach((path) => {
        pathesMap[path.timestamp.getTime()] = path;
      });
    } else {
      selectedTrip.path.forEach((path) => {
        pathesMap[path.timestamp.getTime()] = path;
      });
    }

    setPath(Object.values(pathesMap).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  }, [selectedTrip]);

  const tripsToRender = useMemo(() => {
    if (!selectedTrip) {
      return [];
    }
    if ('trips' in selectedTrip) {
      return selectedTrip.trips;
    }
    return [selectedTrip];
  }, [selectedTrip]);
  const bounds = useMemo(() => {
    if (!path || path.length === 0) {
      return undefined;
    }
    const latLng = L.latLng([path[0].latitude, path[0].longitude]);
    return path.reduce(
      (acc, point) => acc.extend([point.latitude, point.longitude]),
      L.latLngBounds(latLng, latLng)
    );
  }, [path]);
  const iconStartTrip = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/trip-start.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
    []
  );
  const iconEndTrip = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/trip-end.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      }),
    []
  );
  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.current?.flyToBounds(bounds);
  }, [bounds, map]);

  return (
    <TripsContext.Provider value={providerValues}>
      <div className="flex flex-col px-5 mb-4 md:flex-row space-y-4 md:space-x-4 h-full w-600 mt-0">
        <div className="p-4 card hover:shadow-md lg:w-1/2 mt-4 h-[450px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Trips</h2>
            <span className="text-gray-500 text-sm">
              {trips
                ? `${trips.reduce((total, group) => total + group.trips.length, 0)} Trips`
                : deviceIdent
                  ? 'Loading...'
                  : ''}
            </span>
          </div>
          {trips ? (
            trips.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No trips available</div>
            ) : (
              <div className="scrollable-y-auto pb-2 flex flex-col gap-[10px]">
                {trips.map((tripGroup) => (
                  <TripCard
                    key={tripGroup.date.getTime()}
                    tripGroup={tripGroup}
                    animation={false}
                  />
                ))}
              </div>
            )
          ) : deviceIdent ? (
            <div className="text-center text-gray-500 py-4">Loading...</div>
          ) : (
            <div className="text-center text-gray-500 py-4">No device assigned to this vehicle</div>
          )}
        </div>
        <div className="card hover:shadow-md w-full">
          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
            <AppMap dragging={false} ref={map}>
              {tripsToRender.map((trip) => (
                <Polyline
                  key={trip.id}
                  pathOptions={{ color: getColor(trip.id) }}
                  positions={trip.path.map((point) => [point.latitude, point.longitude])}
                />
              ))}
              {path && path.length > 1 && (
                <>
                  <Marker position={[path[0].latitude, path[0].longitude]} icon={iconStartTrip} />
                  <Marker
                    position={[path[path.length - 1].latitude, path[path.length - 1].longitude]}
                    icon={iconEndTrip}
                  />
                </>
              )}
            </AppMap>
          </div>
        </div>
      </div>
    </TripsContext.Provider>
  );
};

export default TripList;
