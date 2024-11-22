import { getVehicleLocations, VehicleLocation } from '@/api/cars';
import { Client, getClients } from '@/api/client';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';

interface MonitoringContextProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  clients: Client[];
  selectedClient?: Client;
  // eslint-disable-next-line no-unused-vars
  setSelectedClient: (v: Client | undefined) => void;
  locations: VehicleLocation[];
  selectedLocation?: VehicleLocation;
  // eslint-disable-next-line no-unused-vars
  setSelectedLocation: (v: VehicleLocation | undefined) => void;
}

const MonitoringContext = createContext<MonitoringContextProps>({
  searchQuery: '',
  clients: [],
  locations: [],
  setSearchQuery: () => {},
  setSelectedClient: () => {},
  setSelectedLocation: () => {}
});

export const MonitoringProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const selectedClient = useMemo(
    () => clients.find((c) => c.name === searchParams.get('client')),
    [clients, searchParams]
  );
  const selectedLocation = useMemo(
    () => locations.find((v) => v.vehicle.imei === searchParams.get('location')),
    [locations, searchParams]
  );

  const setSelectedClient = useCallback(
    (client?: Client) => {
      setSearchParams((params) => {
        client ? params.set('client', client.name) : params.delete('client');
        return params;
      });
    },
    [setSearchParams]
  );
  const setSelectedLocation = useCallback(
    (location?: VehicleLocation) => {
      setSearchParams((params) => {
        location ? params.set('location', location.vehicle.imei) : params.delete('location');
        return params;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    getClients(searchQuery).then(setClients);
  }, [searchQuery]);

  useEffect(() => {
    selectedClient && getVehicleLocations(selectedClient).then(setLocations);

    const interval = setInterval(async () => {
      selectedClient && setLocations(await getVehicleLocations(selectedClient));
    }, 50000);

    return () => clearInterval(interval);
  }, [selectedClient]);

  return (
    <MonitoringContext.Provider
      value={{
        locations,
        searchQuery,
        setSearchQuery,
        clients,
        selectedClient,
        setSelectedClient,
        selectedLocation,
        setSelectedLocation
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringProvider = () => {
  return useContext(MonitoringContext);
};
