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
import mqtt from 'mqtt';
import { axios } from '@/api/axios';
import { ResponseModel } from '@/api/response';

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
  const [filteredClientsNames, setFilteredClientsNames] = useState<number[]>();
  const filteredClients = useMemo(() => {
    if (!filteredClientsNames) {
      return clients;
    }
    return clients.filter((c) => filteredClientsNames.includes(c.id));
  }, [clients, filteredClientsNames]);
  const [clientToLocations, setClientToLocations] = useState<Record<number, string[]>>({});
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [filteredLocationsImei, setFilteredLocationsImei] = useState<string[]>();
  const filteredLocations = useMemo(() => {
    if (!filteredLocationsImei) {
      return locations;
    }
    return locations.filter((l) => filteredLocationsImei.includes(l.vehicle.imei));
  }, [locations, filteredLocationsImei]);
  const [showImei, setShowImei] = useState(true);
  const selectedClient = useMemo(
    () => clients.find((c) => c.name === searchParams.get('client')),
    [clients, searchParams]
  );
  const selectedLocation = useMemo(
    () => locations.find((v) => v.vehicle.imei === searchParams.get('location')),
    [locations, searchParams]
  );
  const mqttClient = useMemo(
    () =>
      mqtt.connect('wss://app.skynasa.com:8084/mqtt', {
        username: 'super_admin',
        password: 'skynasa159',
        clean: true,
        keepalive: 60,
        protocolVersion: 5
      }),
    []
  );

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
    mqttClient.on('connect', async () => {
      const availableLocations = await axios.get<ResponseModel<string[]>>('api/devices/get-idents');
      for (const location of availableLocations.data.result) {
        mqttClient.subscribeAsync(`device/monitoring/${location}`, {
          qos: 2
        });
      }
    });
    mqttClient.on('message', (topic, payload) => {
      const device: MqttResponse = JSON.parse(payload.toString('utf-8'));

      type RecursivePartial<T> = {
        [P in keyof T]?: Partial<T[P]>;
      };
      const oldVehicle = memoryMaplocations[topic] || defaultLocation;

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
          name: device.device_name,
          brandImage: '',
          plate: 'AAAAAA'
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
  }, [mqttClient]);

  useEffect(() => {
    getUsers()
      .then((clients) => {
        setClients(clients);
        return clients;
      })
      .then((clients) => {
        let promises: ReturnType<typeof axios.get<ResponseModel<string[]>>>[] = [];
        for (const client of clients) {
          promises.push(
            axios.get<ResponseModel<string[]>>(`api/devices/get-idents-by-user-id/${client.id}`)
          );
        }
        Promise.all(promises).then((results) => {
          const clientToImeis: Record<number, string[]> = {};
          for (let i = 0; i < clients.length; i++) {
            clientToImeis[clients[i].id] = results[i].data.result;
          }
          setClientToLocations(clientToImeis);
        });
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
    // TODO: Need to activate this when changing subscriptions
    // memoryMaplocations = {};
    // setLocations([]);
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

  useEffect(() => {
    if (selectedClient) {
      setSelectedLocation(undefined);
      setFilteredLocationsImei(clientToLocations[selectedClient.id] || []);
    } else {
      setFilteredLocationsImei(undefined);
    }
  }, [clientToLocations, selectedClient, setSelectedLocation]);

  const search = async (target: string, query: string) => {
    if (query === '') {
      setFilteredLocationsImei(undefined);
      setFilteredClientsNames(undefined);
      return;
    }

    if (target === 'Vehicle') {
      setFilteredLocationsImei(
        locations
          .filter(
            (l) =>
              l.vehicle.name.toLowerCase().includes(query.toLowerCase()) ||
              l.vehicle.imei.includes(query)
          )
          .map((l) => l.vehicle.imei)
      );
    } else {
      setFilteredClientsNames(
        clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).map((c) => c.id)
      );
    }
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
