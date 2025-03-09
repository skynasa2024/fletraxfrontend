import { searchReplays, SearchTripsParams } from '@/api/replay';
import { TripPath } from '@/api/trips';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';

interface ReplayData {
  id: string;
  imei: string;
  startDate: Date;
  endDate: Date;
  mileage: number;
  maxSpeed: number;
  path: TripPath[];
  startLatitude: number;
  startLongitude: number;
  formattedTotalDuration: string;
  totalDuration: number;
}

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
  replayData?: ReplayData;
  path?: TripPath[];
  loading: boolean;
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
  loading: false
});

export const ReplayProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [path, setPath] = useState<TripPath[]>();
  const [replayData, setReplayData] = useState<ReplayData>();
  const [loading, setLoading] = useState(false);

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
      setPath(undefined);
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

      const replayData: ReplayData = {
        id: replayDto.id,
        imei: replayDto.ident,
        startDate: new Date(replayDto.startTime * 1000),
        endDate: new Date(replayDto.endTime * 1000),
        mileage: replayDto.totalDistance,
        maxSpeed: replayDto.maxSpeed,
        path: replayDto.pointsList.map((point) => ({
          tripId: replayDto.id,
          latitude: point.latitude,
          longitude: point.longitude,
          direction: point.direction,
          speed: point.speed,
          timestamp: new Date(point.timestamp * 1000)
        })),
        startLatitude: replayDto.startLatitude,
        startLongitude: replayDto.startLongitude,
        formattedTotalDuration: replayDto.formatedTotalDuration,
        totalDuration: replayDto.totalDuration
      };

      setReplayData(replayData);
      setPath(replayData.path);
    } catch (error) {
      console.error('Failed to search for replay data:', error);
      setReplayData(undefined);
      setPath(undefined);
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
        path,
        loading
      }}
    >
      {children}
    </ReplayContext.Provider>
  );
};

export const useReplayContext = () => {
  return useContext(ReplayContext);
};
