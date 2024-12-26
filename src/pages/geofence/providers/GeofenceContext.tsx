import { Geofence, getGeofences } from '@/api/geofence';
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

interface GeofenceContextProps {
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (query: string) => void;
  search: () => void;
  geofences: Geofence[];
  selectedGeofence?: Geofence | null;
  // eslint-disable-next-line no-unused-vars
  setSelectedGeofence: (geofence?: Geofence | null) => void;
}

const GeofenceContext = createContext<GeofenceContextProps>({
  searchQuery: '',
  setSearchQuery: () => {},
  search: () => {},
  geofences: [],
  setSelectedGeofence: () => {}
});

export const GeofenceProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>();
  const searchQuery = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchParams((params) => {
        params.set('search', query);
        return params;
      });
    },
    [setSearchParams]
  );
  const [geofences, setGeofences] = useState<Geofence[]>([]);

  const search = useCallback(async () => {
    const trips = await getGeofences();
    setGeofences(trips);
  }, []);

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GeofenceContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        search,
        geofences,
        selectedGeofence,
        setSelectedGeofence
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
