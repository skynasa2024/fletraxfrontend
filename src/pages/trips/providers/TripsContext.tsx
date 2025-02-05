import { searchTrips, Trip, TripGroup, TripPath } from '@/api/trips';
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
  setSelectedTrip: () => {}
});

export const TripsProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTrip, setSelectedTrip] = useState<TripGroup | Trip>();
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
  const search = useCallback(async () => {
    setSearchDeviceQuery(searchDeviceQuery);
    if (!searchDeviceQuery) {
      setTrips([]);
      return;
    }
    const trips = await searchTrips({
      query: searchDeviceQuery,
      startDate,
      endDate,
      startTime,
      endTime
    });
    setTrips(trips);
  }, [endDate, endTime, searchDeviceQuery, setSearchDeviceQuery, startDate, startTime]);

  useEffect(() => {
    search();
  }, [search]);

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
        path
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
