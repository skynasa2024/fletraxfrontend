import { IReplay, ReplayDTO, searchReplays, SearchTripsParams } from '@/api/replay';
import useQueryParam from '@/hooks/useQueryParam';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

interface ReplayContextProps {
  searchDeviceQuery: string;
  setSearchDeviceQuery: (query: string) => void;
  startDate?: string;
  setStartDate: (date: string) => void;
  endDate?: string;
  setEndDate: (date: string) => void;
  startTime?: string;
  setStartTime: (time: string) => void;
  endTime?: string;
  setEndTime: (time: string) => void;
  search: () => void;
  replayData?: IReplay;
  loading: boolean;
  selectedIntervals?: ReplayDTO;
  setSelectedIntervals: (trip?: ReplayDTO) => void;
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
  selectedIntervals: undefined,
  setSelectedIntervals: () => {}
});

export const ReplayProvider = ({ children }: PropsWithChildren) => {
  const {
    value: searchDeviceQuery,
    setValue: _setSearchDeviceQuery,
    setSearchParam: setSearchDeviceQuery
  } = useQueryParam('device');
  const { value: startDate, setSearchParam: setStartDate } = useQueryParam('startDate');
  const { value: endDate, setSearchParam: setEndDate } = useQueryParam('endDate');
  const { value: startTime, setSearchParam: setStartTime } = useQueryParam('startTime');
  const { value: endTime, setSearchParam: setEndTime } = useQueryParam('endTime');
  const [replayData, setReplayData] = useState<IReplay>();
  const [loading, setLoading] = useState(false);
  const [selectedIntervals, setSelectedIntervals] = useState<ReplayDTO>();

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
      setSelectedIntervals(undefined);
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
        selectedIntervals,
        setSelectedIntervals
      }}
    >
      {children}
    </ReplayContext.Provider>
  );
};

export const useReplayContext = () => {
  return useContext(ReplayContext);
};
