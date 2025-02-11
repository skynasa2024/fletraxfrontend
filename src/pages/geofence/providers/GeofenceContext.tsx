import { Paginated } from '@/api/common';
import { Geofence, getGeofences } from '@/api/geofence';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';

interface GeofenceContextProps {
  // eslint-disable-next-line no-unused-vars
  search: (query: string) => void;
  refetch: () => void;
  geofences?: Geofence[];
  selectedGeofence?: Geofence | null;
  // eslint-disable-next-line no-unused-vars
  setSelectedGeofence: (geofence?: Geofence | null) => void;
  remoteRowCount: number;
  // eslint-disable-next-line no-unused-vars
  isRowLoaded: ({ index }: { index: number }) => boolean;
  loadMoreRows: ({
    // eslint-disable-next-line no-unused-vars
    startIndex,
    // eslint-disable-next-line no-unused-vars
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => Promise<void>;
}

const GeofenceContext = createContext<GeofenceContextProps>({
  search: () => {},
  refetch: () => {},
  setSelectedGeofence: () => {},
  remoteRowCount: 0,
  isRowLoaded: () => false,
  loadMoreRows: async () => {}
});

export const GeofenceProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>();
  const [geofences, setGeofences] = useState<Paginated<Geofence>>();
  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);

  const search = useCallback(
    async (query: string) => {
      if (!query) {
        setSearchParams({});
        return;
      }
      setSearchParams({ query });
    },
    [setSearchParams]
  );

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => !!geofences?.data[index],
    [geofences]
  );

  const loadMoreRows = useCallback(
    async ({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
      const newGeofences = await getGeofences({ start: startIndex, end: stopIndex });
      setGeofences((prev) => {
        const data = [...(prev?.data ?? [])];
        newGeofences.data.forEach((geofence, index) => {
          data[startIndex + index] = geofence;
        });
        return {
          data,
          totalCount: newGeofences.totalCount
        };
      });
      setMaxLoadedIndex((prevMax) => Math.max(prevMax, stopIndex));
    },
    []
  );

  const refetch = useCallback(async () => {
    setGeofences(undefined);
    const query = searchParams.get('query');
    getGeofences({ start: 0, end: maxLoadedIndex + 1, search: query ?? undefined }).then(
      setGeofences
    );
  }, [maxLoadedIndex, searchParams]);

  useEffect(() => {
    const query = searchParams.get('query');
    setGeofences(undefined);
    getGeofences({ start: 0, end: 10, search: query ?? undefined }).then(setGeofences);
  }, [searchParams]);

  return (
    <GeofenceContext.Provider
      value={{
        search,
        geofences: geofences?.data,
        selectedGeofence,
        setSelectedGeofence,
        remoteRowCount: geofences?.totalCount ?? 0,
        isRowLoaded,
        loadMoreRows,
        refetch
      }}
    >
      {children}
    </GeofenceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGeofenceContext = () => {
  return useContext(GeofenceContext);
};
