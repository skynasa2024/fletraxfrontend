import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IntervalType, searchTrips, Trip, TripGroup, TripPath, TRIPS_PAGE_SIZE } from '@/api/trips';
import TripCard from '@/pages/trips/blocks/TripCard';
import { TripsContext } from '@/pages/trips/providers/TripsContext';
import L from 'leaflet';
import { toAbsoluteUrl } from '@/utils';
import AppMap from '@/components/AppMap';
import { Marker, Polyline } from 'react-leaflet';
import { getColor } from '@/pages/trips/blocks/PolylineColors';
import { useIntl } from 'react-intl';
import { ButtonRadioGroup } from '@/pages/dashboards/blocks/ButtonRadioGroup';
import { CircularProgress } from '@mui/material';
interface TripListProps {
  deviceIdent?: string;
}

const TripList: React.FC<TripListProps> = ({ deviceIdent }) => {
  const [selectedTrip, setSelectedTrip] = useState<TripGroup | Trip>();
  const [path, setPath] = useState<TripPath[]>();
  const [trips, setTrips] = useState<TripGroup[]>();
  const map = useRef<L.Map>(null);
  const intl = useIntl();
  const [hasMore, setHasMore] = useState(true);
  const [intervalType, setIntervalType] = useState<IntervalType>(IntervalType.Trip);
  const [loading, setLoading] = useState(false);

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
    setSelectedTrip,
    intervalType,
    setIntervalType,
    loading
  };

  useEffect(() => {
    if (!deviceIdent) return;
    setLoading(true);
    searchTrips({ query: deviceIdent, intervalType })
      .then(setTrips)
      .finally(() => setLoading(false));
  }, [deviceIdent, intervalType]);

  useEffect(() => {
    if (!selectedTrip) {
      setPath(undefined);
      return;
    }

    if (intervalType === IntervalType.Parking) {
      if ('trips' in selectedTrip) {
        const firstParking = selectedTrip.trips[0];
        setPath([
          {
            tripId: firstParking.id,
            latitude: firstParking.startLatitude ?? 0,
            longitude: firstParking.startLongitude ?? 0,
            timestamp: firstParking.startDate,
            direction: 0,
            speed: 0
          }
        ]);
      } else {
        setPath([
          {
            tripId: selectedTrip.id,
            latitude: selectedTrip.startLatitude ?? 0,
            longitude: selectedTrip.startLongitude ?? 0,
            timestamp: selectedTrip.startDate,
            direction: 0,
            speed: 0
          }
        ]);
      }
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
  }, [selectedTrip, intervalType]);

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
  const icon = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-green.png'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
    []
  );
  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.current?.flyToBounds(bounds);
  }, [bounds, map]);

  const infiniteLoaderContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMoreTrips = async () => {
    if (!hasMore) return;
    const currentOffset = trips?.length ?? 0;
    const moreTrips = await searchTrips({
      query: deviceIdent ?? '',
      offset: { start: currentOffset, end: currentOffset + TRIPS_PAGE_SIZE },
      intervalType
    });
    if (moreTrips.length === 0 || moreTrips.length < TRIPS_PAGE_SIZE) {
      setHasMore(false);
    }
    setTrips((prevTrips) => {
      const oldData = prevTrips ?? [];
      const newData = [...oldData];
      moreTrips.forEach((item, idx) => {
        newData[currentOffset + idx] = item;
      });
      return newData;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTrips?.();
        }
      },
      {
        root: infiniteLoaderContainerRef?.current,
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef, trips]);

  return (
    <TripsContext.Provider value={{ ...providerValues }}>
      <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full w-600 mt-0">
        <div className="p-4 card hover:shadow-md lg:w-1/2 mt-4 h-[450px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'TRIPS.LIST.TITLE' })}
            </h2>
            <span className="text-gray-500 text-sm">
              {trips
                ? intl.formatMessage(
                    { id: 'TRIPS.COUNT' },
                    { count: trips.reduce((total, group) => total + group.trips.length, 0) }
                  )
                : deviceIdent
                  ? intl.formatMessage({ id: 'TRIPS.LIST.LOADING' })
                  : ''}
            </span>
          </div>
          <ButtonRadioGroup<IntervalType>
            selection={intervalType}
            setSelection={setIntervalType}
            selections={[IntervalType.Trip, IntervalType.Parking]}
            className="w-full btn data-[selected=true]:btn-dark btn-light data-[selected=false]:btn-clear items-center justify-center mb-4"
          />
          {loading ? (
            <div className="text-center text-gray-500 h-full flex items-center justify-center py-2">
              <CircularProgress size={24} color="inherit" />
            </div>
          ) : trips ? (
            trips.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                {intl.formatMessage({ id: 'TRIPS.LIST.NO_TRIPS' })}
              </div>
            ) : (
              <div
                ref={infiniteLoaderContainerRef}
                className="scrollable-y-auto pb-2 flex flex-col gap-[10px]"
              >
                {trips.map((tripGroup) => (
                  <TripCard
                    key={tripGroup.date.getTime()}
                    tripGroup={tripGroup}
                    animation={intervalType === IntervalType.Trip}
                  />
                ))}

                {hasMore ? (
                  <div ref={loaderRef} className="text-center text-gray-500 py-2">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    No more {intervalType === IntervalType.Parking ? 'parkings' : 'trips'}
                  </div>
                )}
              </div>
            )
          ) : deviceIdent ? (
            <div className="text-center text-gray-500 py-4">
              {intl.formatMessage({ id: 'TRIPS.LIST.LOADING' })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              {intl.formatMessage({ id: 'TRIPS.LIST.NO_DEVICE' })}
            </div>
          )}
        </div>
        <div className="card hover:shadow-md w-full">
          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
            <AppMap dragging={false} ref={map}>
              {intervalType === IntervalType.Parking && path && path.length > 0 ? (
                <Marker
                  position={[path[0].latitude, path[0].longitude]}
                  icon={icon}
                  title={`Parking from ${path[0].timestamp.toLocaleString()}`}
                />
              ) : (
                <>
                  {tripsToRender.map((trip) => (
                    <Polyline
                      key={trip.id}
                      pathOptions={{ color: getColor(trip.id) }}
                      positions={trip.path.map((point) => [point.latitude, point.longitude])}
                    />
                  ))}
                  {path && path.length > 1 && (
                    <>
                      <Marker
                        position={[path[0].latitude, path[0].longitude]}
                        icon={iconStartTrip}
                      />
                      <Marker
                        position={[path[path.length - 1].latitude, path[path.length - 1].longitude]}
                        icon={iconEndTrip}
                      />
                    </>
                  )}
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
