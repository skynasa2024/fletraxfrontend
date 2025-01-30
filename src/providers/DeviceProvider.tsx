import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useAuthContext } from '@/auth';
import { getProtocols, getTypes } from '@/api/devices';

interface DeviceContextProps {
  // eslint-disable-next-line no-unused-vars
  getProtocolName: (protocolId: string) => string;
  // eslint-disable-next-line no-unused-vars
  getTypeName: (typeId: string) => string;
}

const DeviceContext = createContext<DeviceContextProps>({
  getProtocolName: () => '',
  getTypeName: () => ''
});

export const DeviceProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthContext();
  const [protocols, setProtocols] = useState<Record<string, string>>({});
  const [types, setTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    getProtocols().then(setProtocols);
    getTypes().then(setTypes);
  }, [auth.currentUser]);

  return (
    <DeviceContext.Provider
      value={{
        getProtocolName: (protocolId: string) => protocols[protocolId] || '',
        getTypeName: (typeId: string) => types[typeId] || ''
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
