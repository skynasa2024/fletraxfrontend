import { getVehicleLocations, VehicleLocation } from '@/api/cars';
import { Client, getClients } from '@/api/client';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';

interface MonitoringContextProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  clients: Client[];
  selectedClient?: Client;
  setSelectedClient: Dispatch<SetStateAction<Client | undefined>>;
  locations: VehicleLocation[];
  selectedLocation?: VehicleLocation;
  setSelectedLocation: Dispatch<SetStateAction<VehicleLocation | undefined>>;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [selectedLocation, setSelectedLocation] = useState<VehicleLocation>();

  useEffect(() => {
    getClients(searchQuery).then(setClients);
  }, [searchQuery]);

  useEffect(() => {
    const interval = setInterval(async () => {
      selectedClient && setLocations(await getVehicleLocations(selectedClient));
    }, 5000);

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
