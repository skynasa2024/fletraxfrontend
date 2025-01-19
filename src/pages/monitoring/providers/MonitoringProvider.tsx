import { VehicleLocation } from '@/api/cars';
import { User, getUsers } from '@/api/user';
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
import { getMonitoringDevices } from '@/api/devices';
import { useMqttProvider } from '@/providers/MqttProvider';

interface MqttResponse {
  device_id: number;
  device_name: string;
  engine_ignition_status: string;
  existing_kilometers: string;
  external_battery_voltage?: number;
  fuel_level?: number;
  gsm_signal_level?: number;
  ident: string;
  movement_status?: boolean;
  parking_time: string;
  position_altitude: number;
  position_latitude: number;
  position_longitude: number;
  position_satellites?: number;
  position_speed?: number;
  position_valid: boolean;
  position_direction: number;
  protocol: string;
  server_timestamp: string;
  timestamp: string;
  defense_active_status?: boolean;
  battery_charging_status?: boolean;
  engine_blocked_status?: boolean;
  battery_level?: number;
  status?: string;
}

type UserWithDevices = User & { onlineDevices?: number; offlineDevices?: number };

interface MonitoringContextProps {
  clients: UserWithDevices[];
  selectedClient?: UserWithDevices;
  // eslint-disable-next-line no-unused-vars
  setSelectedClient: (v: User | undefined) => void;
  locations: VehicleLocation[];
  selectedLocation?: VehicleLocation;
  // eslint-disable-next-line no-unused-vars
  setSelectedLocation: (v: VehicleLocation | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  search: (target: string, query: string) => void;
  showImei: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowImei: (v: boolean) => void;
}

let memoryMaplocations: Record<string, VehicleLocation> = {};
const defaultLocation: VehicleLocation = {
  online: false,
  lat: 0,
  long: 0,
  angle: 0,
  status: {
    parkingTime: '',
    engineStatus: false,
    timestamp: new Date(),
    batteryLevel: 0,
    defenseStatus: false,
    engineBlocked: false,
    existingKilometer: '',
    satellietes: 0,
    signalLevel: 0,
    speed: 0
  },
  vehicle: {
    id: 0,
    imei: '',
    name: '',
    brandImage: '',
    plate: ''
  }
};

const MonitoringContext = createContext<MonitoringContextProps>({
  clients: [],
  locations: [],
  setSelectedClient: () => {},
  setSelectedLocation: () => {},
  search: () => {},
  showImei: false,
  setShowImei: () => {}
});

export const MonitoringProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState<UserWithDevices[]>([]);
  const [clientToLocations, setClientToLocations] = useState<Record<number, string[]>>({});
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [showImei, setShowImei] = useState(true);
  const selectedClient = useMemo(
    () => clients.find((c) => c.name === searchParams.get('client')),
    [clients, searchParams]
  );
  const selectedLocation = useMemo(
    () => locations.find((v) => v.vehicle.imei === searchParams.get('location')),
    [locations, searchParams]
  );
  const searchQuery = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchParams((params) => {
        query ? params.set('q', query) : params.delete('q');
        return params;
      });
    },
    [setSearchParams]
  );
  const searchTarget = useMemo(() => searchParams.get('target') || 'Vehicle', [searchParams]);
  const setSearchTarget = useCallback(
    (target: string) => {
      setSearchParams((params) => {
        target ? params.set('target', target) : params.delete('target');
        return params;
      });
    },
    [setSearchParams]
  );
  const filteredClientsNames = useMemo(() => {
    if (!searchQuery || searchTarget !== 'User') {
      return null;
    }
    return clients
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((c) => c.id);
  }, [clients, searchQuery, searchTarget]);
  const filteredClients = useMemo(() => {
    if (!filteredClientsNames) {
      return clients;
    }
    return clients.filter((c) => filteredClientsNames.includes(c.id));
  }, [clients, filteredClientsNames]);
  const filteredLocationsImei = useMemo(() => {
    if ((!searchQuery || searchTarget !== 'Vehicle') && !selectedClient) {
      return null;
    }
    return locations
      .filter(
        (l) =>
          l.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.vehicle.imei.includes(searchQuery)
      )
      .map((l) => l.vehicle.imei)
      .filter((l) => (selectedClient ? l in clientToLocations[selectedClient?.id] : true));
  }, [clientToLocations, locations, searchQuery, searchTarget, selectedClient]);
  const filteredLocations = useMemo(() => {
    if (!filteredLocationsImei) {
      return locations;
    }
    return locations.filter((l) => filteredLocationsImei.includes(l.vehicle.imei));
  }, [locations, filteredLocationsImei]);
  const { mqttClient } = useMqttProvider();

  const setSelectedClient = useCallback(
    (client?: User) => {
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
    if (!mqttClient) {
      return;
    }

    mqttClient.on('connect', async () => {
      const availableLocations = await getMonitoringDevices();
      for (const location of availableLocations) {
        const topic = `device/monitoring/${location.ident}`;
        if (memoryMaplocations[topic]) {
          continue;
        }

        memoryMaplocations[topic] = JSON.parse(JSON.stringify(defaultLocation));
        memoryMaplocations[topic].vehicle.imei = location.ident;
        memoryMaplocations[topic].vehicle.plate = location.vehiclePlate;
        memoryMaplocations[topic].online = location.status === 'online';

        setClientToLocations((prev) => ({
          ...prev,
          [location.userId]: [...(prev[location.userId] || []), location.ident]
        }));

        // mqttClient.subscribeAsync(topic, {
        //   qos: 1
        // });
      }
      mqttClient.subscribeAsync('device/monitoring/+', {
        qos: 0
      });
    });
    mqttClient.on('message', (topic, payload) => {
      const device: MqttResponse = JSON.parse(payload.toString('utf-8'));

      type RecursivePartial<T> = {
        [P in keyof T]?: Partial<T[P]>;
      };
      const oldVehicle = memoryMaplocations[topic] || JSON.parse(JSON.stringify(defaultLocation));

      const partialVehicle: RecursivePartial<VehicleLocation> = {
        online: device.status === 'online' ? true : device.status === 'offline' ? false : undefined,
        lat: device.position_latitude,
        long: device.position_longitude,
        angle: device.position_direction,
        status: {
          parkingTime: device.parking_time,
          engineStatus:
            device.engine_ignition_status === 'UNKNOWN'
              ? undefined
              : device.engine_ignition_status === 'true',
          timestamp: new Date(+device.timestamp * 1000),
          batteryLevel: device.battery_charging_status === true ? 100 : device.battery_level,
          defenseStatus: device.defense_active_status,
          engineBlocked: device.engine_blocked_status,
          existingKilometer: device.existing_kilometers,
          satellietes: device.position_satellites,
          signalLevel: device.gsm_signal_level,
          speed: device.position_speed
        },
        vehicle: {
          imei: device.ident,
          name: device.device_name
        }
      };

      // Remove undefined values from partialVehicle
      Object.keys(partialVehicle).forEach((key) => {
        if ((partialVehicle as any)[key] === undefined) {
          delete (partialVehicle as any)[key];
        }
      });
      if (partialVehicle.status !== undefined) {
        Object.keys(partialVehicle.status).forEach((key) => {
          if ((partialVehicle as any).status[key] === undefined) {
            delete (partialVehicle as any).status[key];
          }
        });
      }
      if (partialVehicle.vehicle !== undefined) {
        Object.keys(partialVehicle.vehicle).forEach((key) => {
          if ((partialVehicle as any).vehicle[key] === undefined) {
            delete (partialVehicle as any).vehicle[key];
          }
        });
      }

      memoryMaplocations[topic] = {
        ...oldVehicle,
        ...partialVehicle,
        status: {
          ...oldVehicle.status,
          ...partialVehicle.status
        },
        vehicle: {
          ...oldVehicle.vehicle,
          ...partialVehicle.vehicle
        }
      };
    });

    return () => {
      mqttClient.unsubscribeAsync('device/monitoring/+');
    };
  }, [mqttClient]);

  useEffect(() => {
    getUsers().then((clients) => {
      setClients(clients);
      return clients;
    });
  }, []);

  const updateLocations = useCallback(async () => {
    const locations = Object.values(memoryMaplocations);
    setLocations(locations);
    let newClients = clients;
    for (const client of newClients) {
      client.onlineDevices = 0;
      client.offlineDevices = 0;
    }
    for (const location of locations) {
      const client = newClients.find((c) =>
        clientToLocations[c.id]?.includes(location.vehicle.imei)
      );
      if (client) {
        location.online ? client.onlineDevices!++ : client.offlineDevices!++;
      }
    }
    setClients([...newClients]);
  }, [clientToLocations, clients]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      for (let i = 0; i < 5; i++) {
        updateLocations();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }, 2000);
    const interval = setInterval(async () => {
      updateLocations();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [updateLocations]);

  const search = async (target: string, query: string) => {
    setSearchQuery(query);
    setSearchTarget(target);
  };

  return (
    <MonitoringContext.Provider
      value={{
        locations: filteredLocations ? filteredLocations : locations,
        clients: filteredClients ? filteredClients : clients,
        selectedClient,
        setSelectedClient,
        selectedLocation,
        setSelectedLocation,
        search,
        showImei,
        setShowImei
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMonitoringProvider = () => {
  return useContext(MonitoringContext);
};
