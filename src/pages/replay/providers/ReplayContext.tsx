import { IReplay, searchReplays, SearchTripsParams, TripRecord } from '@/api/replay';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';
interface ReplayContextProps {
  searchDeviceQuery: string;
  setSearchDeviceQuery: (query: string) => void;
  startDate?: string;
  setStartDate: (date: string | undefined) => void;
  endDate?: string;
  setEndDate: (date: string | undefined) => void;
  startTime?: string;
  setStartTime: (time: string | undefined) => void;
  endTime?: string;
  setEndTime: (time: string | undefined) => void;
  search: () => void;
  replayData?: IReplay;
  loading: boolean;
  selectedTrip?: TripRecord;
  setSelectedTrip: (trip?: TripRecord) => void;
}

const ReplayContext = createContext<ReplayContextProps>({
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
  loading: false,
  setSelectedTrip: () => {}
});

export const ReplayProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [replayData, setReplayData] = useState<IReplay>();
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord>();

  // Device query
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

  // Date and time parameters
  const startDate = searchParams.get('startDate') || undefined;
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

  const endDate = searchParams.get('endDate') || undefined;
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

  const startTime = searchParams.get('startTime') || undefined;
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

  const endTime = searchParams.get('endTime') || undefined;
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

  const search = useCallback(async () => {
    setLoading(true);
    setSearchDeviceQuery(searchDeviceQuery);

    if (!searchDeviceQuery) {
      setReplayData(undefined);
      setLoading(false);
      return;
    }

    try {
      const params: SearchTripsParams = {
        ident: searchDeviceQuery,
        startDate,
        endDate,
        startTime,
        endTime
      };

      const replayDto = await searchReplays(params);

      setReplayData(replayDto);
    } catch (error) {
      console.error('Failed to search for replay data:', error);
      setReplayData(undefined);
    } finally {
      setLoading(false);
    }
  }, [endDate, endTime, searchDeviceQuery, startDate, startTime]);

  useEffect(() => {
    if (searchDeviceQuery && startDate && endDate) {
      search();
    }
  }, []);

  return (
    <ReplayContext.Provider
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
        replayData,
        loading,
        selectedTrip,
        setSelectedTrip
      }}
    >
      {children}
    </ReplayContext.Provider>
  );
};

export const useReplayContext = () => {
  return useContext(ReplayContext);
};
