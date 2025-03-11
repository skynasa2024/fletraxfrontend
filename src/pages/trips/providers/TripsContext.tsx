import { IntervalType, searchTrips, Trip, TripGroup, TripPath, TRIPS_PAGE_SIZE } from '@/api/trips';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';

interface TripsContextProps {
  searchDeviceQuery: string;
  // eslint-disable-next-line no-unused-vars
  setSearchDeviceQuery: (query: string) => void;
  startDate?: string;
  // eslint-disable-next-line no-unused-vars
  setStartDate: (date: string | undefined) => void;
  endDate?: string;
  // eslint-disable-next-line no-unused-vars
  setEndDate: (date: string | undefined) => void;
  startTime?: string;
  // eslint-disable-next-line no-unused-vars
  setStartTime: (time: string | undefined) => void;
  endTime?: string;
  // eslint-disable-next-line no-unused-vars
  setEndTime: (time: string | undefined) => void;
  search: () => void;
  trips: TripGroup[];
  selectedTrip?: TripGroup | Trip;
  // eslint-disable-next-line no-unused-vars
  setSelectedTrip: (trip?: TripGroup | Trip) => void;
  path?: TripPath[];
  loadMoreTrips?: () => Promise<void>;
  hasMore?: boolean;
  intervalType: IntervalType;
  // eslint-disable-next-line no-unused-vars
  setIntervalType: (intervalType: IntervalType) => void;
  loading: boolean;
  isNewTrips: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TripsContext = createContext<TripsContextProps>({
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
  setSelectedTrip: () => {},
  loadMoreTrips: async () => {},
  hasMore: false,
  intervalType: IntervalType.Trip,
  setIntervalType: () => {},
  loading: false,
  isNewTrips: false
});

interface TripsProviderProps extends PropsWithChildren {
  isNewTrips?: boolean;
}

export const TripsProvider = ({ children, isNewTrips = false }: TripsProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTrip, setSelectedTrip] = useState<TripGroup | Trip>();
  const [intervalType, setIntervalType] = useState<IntervalType>(IntervalType.Trip);
  const [path, setPath] = useState<TripPath[]>();
  const [searchDeviceQuery, _setSearchDeviceQuery] = useState(searchParams.get('device') ?? '');
  const setSearchDeviceQuery = useCallback(
    (query: string) => {
      setSearchParams((params) => {
        if (!query) {
          params.delete('device');
          return params;
        }
        params.set('device', query);
        return params;
      });
    },
    [setSearchParams]
  );
  const startDate = useMemo(() => {
    const date = searchParams.get('startDate') || undefined;
    return date;
  }, [searchParams]);
  const setStartDate = useCallback(
    (date: string | undefined) => {
      setSearchParams((params) => {
        if (!date) {
          params.delete('startDate');
          return params;
        }
        params.set('startDate', date);
        return params;
      });
    },
    [setSearchParams]
  );
  const endDate = useMemo(() => {
    const date = searchParams.get('endDate') || undefined;
    return date;
  }, [searchParams]);
  const setEndDate = useCallback(
    (date: string | undefined) => {
      setSearchParams((params) => {
        if (!date) {
          params.delete('endDate');
          return params;
        }
        params.set('endDate', date);
        return params;
      });
    },
    [setSearchParams]
  );
  const startTime = useMemo(() => {
    const time = searchParams.get('startTime') || undefined;
    return time;
  }, [searchParams]);
  const setStartTime = useCallback(
    (time: string | undefined) => {
      setSearchParams((params) => {
        if (!time) {
          params.delete('startTime');
          return params;
        }
        params.set('startTime', time);
        return params;
      });
    },
    [setSearchParams]
  );
  const endTime = useMemo(() => {
    const time = searchParams.get('endTime') || undefined;
    return time;
  }, [searchParams]);
  const setEndTime = useCallback(
    (time: string | undefined) => {
      setSearchParams((params) => {
        if (!time) {
          params.delete('endTime');
          return params;
        }
        params.set('endTime', time);
        return params;
      });
    },
    [setSearchParams]
  );
  const [trips, setTrips] = useState<TripGroup[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearchDeviceQuery(searchDeviceQuery);
    if (!searchDeviceQuery) {
      setTrips([]);
      setHasMore(false);
      setLoading(false);
      return;
    }
    try {
      const initialTrips = await searchTrips({
        query: searchDeviceQuery,
        startDate,
        endDate,
        startTime,
        endTime,
        offset: { start: 0, end: TRIPS_PAGE_SIZE },
        intervalType,
        isNewTrips
      });
      setTrips(initialTrips);
      setHasMore(initialTrips.length > 0);
    } finally {
      setLoading(false);
    }
  }, [endDate, endTime, searchDeviceQuery, startDate, startTime, intervalType, isNewTrips]);

  const loadMoreTrips = useCallback(async () => {
    if (!hasMore) return;
    const currentOffset = trips.length;
    const moreTrips = await searchTrips({
      query: searchDeviceQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      offset: { start: currentOffset, end: currentOffset + TRIPS_PAGE_SIZE },
      intervalType,
      isNewTrips
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
  }, [
    hasMore,
    trips.length,
    searchDeviceQuery,
    startDate,
    endDate,
    startTime,
    endTime,
    intervalType,
    isNewTrips
  ]);

  useEffect(() => {
    search();
  }, [search]);

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

  useEffect(() => {
    setSelectedTrip(undefined);
    setTrips([]);
  }, [intervalType]);

  return (
    <TripsContext.Provider
      value={{
        searchDeviceQuery,
        setSearchDeviceQuery: _setSearchDeviceQuery,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        search,
        trips,
        selectedTrip,
        setSelectedTrip,
        path,
        loadMoreTrips,
        hasMore,
        intervalType,
        setIntervalType,
        loading,
        isNewTrips
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTripsContext = () => {
  return useContext(TripsContext);
};
