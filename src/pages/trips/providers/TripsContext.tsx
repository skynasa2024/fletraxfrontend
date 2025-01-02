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
  startDate?: Date;
  // eslint-disable-next-line no-unused-vars
  setStartDate: (date: Date | undefined) => void;
  endDate?: Date;
  // eslint-disable-next-line no-unused-vars
  setEndDate: (date: Date | undefined) => void;
  search: () => void;
  trips: TripGroup[];
  selectedTrip?: TripGroup | Trip;
  // eslint-disable-next-line no-unused-vars
  setSelectedTrip: (trip?: TripGroup | Trip) => void;
  path?: TripPath[];
}

const TripsContext = createContext<TripsContextProps>({
  searchDeviceQuery: '',
  setSearchDeviceQuery: () => {},
  startDate: new Date(),
  setStartDate: () => {},
  endDate: new Date(),
  setEndDate: () => {},
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
  const [startDate, _setStartDate] = useState(() => {
    const date = searchParams.get('startDate');
    return date ? new Date(+date) : undefined;
  });
  const setStartDate = useCallback(
    (date: Date | undefined) => {
      if (date && isNaN(date?.getTime())) {
        return;
      }

      setSearchParams((params) => {
        if (!date) {
          params.delete('startDate');
          return params;
        }
        params.set('startDate', date.getTime().toString());
        return params;
      });
    },
    [setSearchParams]
  );
  const [endDate, _setEndDate] = useState(() => {
    const date = searchParams.get('endDate');
    return date ? new Date(+date) : undefined;
  });
  const setEndDate = useCallback(
    (date: Date | undefined) => {
      setSearchParams((params) => {
        if (!date) {
          params.delete('endDate');
          return params;
        }
        params.set('endDate', date.getTime().toString());
        return params;
      });
    },
    [setSearchParams]
  );
  const [trips, setTrips] = useState<TripGroup[]>([]);
  const search = useCallback(async () => {
    setSearchDeviceQuery(searchDeviceQuery);
    setStartDate(startDate);
    setEndDate(endDate);
    const trips = await searchTrips({
      query: searchDeviceQuery,
      startDate,
      endDate
    });
    setTrips(trips);
  }, [endDate, searchDeviceQuery, setEndDate, setSearchDeviceQuery, setStartDate, startDate]);

  useEffect(() => {
    if (!selectedTrip) {
      setPath(undefined);
      return;
    }

    if ('trips' in selectedTrip) {
      const pathes = selectedTrip.trips.map((trip) => trip.path).reverse();
      setPath(pathes.flat());
      return;
    }

    setPath(selectedTrip.path);
  }, [selectedTrip]);

  return (
    <TripsContext.Provider
      value={{
        searchDeviceQuery,
        setSearchDeviceQuery: _setSearchDeviceQuery,
        startDate,
        setStartDate: _setStartDate,
        endDate,
        setEndDate: _setEndDate,
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
