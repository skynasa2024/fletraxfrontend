import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useAuthContext } from '@/auth';
import { getProtocols, getTypes } from '@/api/devices';

interface DeviceContextProps {
  protocols: Record<string, string>;
  types: Awaited<ReturnType<typeof getTypes>>;
  // eslint-disable-next-line no-unused-vars
  getProtocolName: (protocolId: string) => string;
  // eslint-disable-next-line no-unused-vars
  getTypeName: (typeId: string) => string;
  getTypesOfProtocol: (
    // eslint-disable-next-line no-unused-vars
    protocolId: string
  ) => { id: string; name: string; protocolId: string }[];
}

const DeviceContext = createContext<DeviceContextProps>({
  getProtocolName: () => '',
  getTypeName: () => '',
  getTypesOfProtocol: () => [],
  protocols: {},
  types: {}
});

export const DeviceProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthContext();
  const [protocols, setProtocols] = useState<Record<string, string>>({});
  const [types, setTypes] = useState<Awaited<ReturnType<typeof getTypes>>>({});

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    getProtocols().then(setProtocols);
    getTypes().then(setTypes);
  }, [auth.currentUser]);

  const getTypesOfProtocol = useCallback(
    (protocolId: string) =>
      Object.entries(types)
        .filter(([, type]) => type.protocolId === protocolId)
        .map(([id, type]) => ({ ...type, id })),
    [types]
  );

  return (
    <DeviceContext.Provider
      value={{
        getProtocolName: (protocolId: string) => protocols[protocolId] || '',
        getTypeName: (typeId: string) => types[typeId].name || '',
        protocols,
        types,
        getTypesOfProtocol
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDeviceProvider = () => {
  return useContext(DeviceContext);
};
