import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useAuthContext } from '@/auth';

interface MqttContextProps {
  mqttClient?: mqtt.MqttClient;
}

const MqttContext = createContext<MqttContextProps>({});

export const MqttProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthContext();
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | undefined>();

  useEffect(() => {
    if (!auth.currentUser) {
      setMqttClient(undefined);
      return;
    }
    const mqttClient = mqtt.connect(import.meta.env.VITE_APP_MQTT_API, {
      clientId: `${auth.currentUser.id}-${(Math.random() * 1000).toFixed(0)}`,
      username: 'admin',
      password: 'fletrax159',
      clean: true,
      keepalive: 60,
      protocolVersion: 5
    });
    setMqttClient((prev) => {
      prev?.endAsync();
      return mqttClient;
    });

    return () => {
      mqttClient?.endAsync();
    };
  }, [auth.currentUser]);

  return (
    <MqttContext.Provider
      value={{
        mqttClient
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMqttProvider = () => {
  return useContext(MqttContext);
};
