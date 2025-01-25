import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useAuthContext } from '@/auth';
import * as authHelper from '../auth/_helpers';

interface MqttContextProps {
  mqttClient?: mqtt.MqttClient;
}

const MqttContext = createContext<MqttContextProps>({});

export const MqttProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthContext();
  const token = authHelper.getAuth()?.access_token;
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | undefined>();

  useEffect(() => {
    if (!localStorage.getItem('mqtt-suffix')) {
      localStorage.setItem('mqtt-suffix', (Math.random() * 1000).toFixed(0));
    }
    const suffix = localStorage.getItem('mqtt-suffix') ?? '';
    if (!auth.currentUser) {
      setMqttClient(undefined);
      return;
    }
    const mqttClient = mqtt.connect(import.meta.env.VITE_APP_MQTT_API, {
      clientId: `${auth.currentUser.id}-${suffix}`,
      username: auth.currentUser.username,
      password: token,
      clean: true,
      keepalive: 60,
      protocolVersion: 5,
      properties: {
        sessionExpiryInterval: 600
      }
    });
    setMqttClient((prev) => {
      prev?.endAsync();
      return mqttClient;
    });

    return () => {
      mqttClient?.endAsync();
    };
  }, [auth.currentUser, token]);

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
