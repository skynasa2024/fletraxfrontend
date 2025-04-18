import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useAuthContext } from '@/auth';
import * as authHelper from '../auth/_helpers';
import { getTopics, Topics } from '@/api/user';

interface MqttContextProps {
  mqttClient?: mqtt.MqttClient;
  topics?: Topics;
}

const MqttContext = createContext<MqttContextProps>({});

export const MqttProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthContext();
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | undefined>();
  const [topics, setTopics] = useState<Topics | undefined>();

  useEffect(() => {
    if (!topics) {
      getTopics().then(setTopics);
    }
    if (!localStorage.getItem('mqtt-suffix')) {
      localStorage.setItem('mqtt-suffix', (Math.random() * 1000).toFixed(0));
    }
    const suffix = localStorage.getItem('mqtt-suffix') ?? '';
    if (!auth.currentUser) {
      setMqttClient(undefined);
      return;
    }
    const token = authHelper.getAuth()?.access_token;
    const mqttClient = mqtt.connect(import.meta.env.VITE_APP_MQTT_API, {
      clientId: `${auth.currentUser.username}-${suffix}`,
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
      if (prev) {
        if (!prev.disconnecting) {
          prev.endAsync();
        }
      }
      return mqttClient;
    });

    return () => {
      mqttClient?.endAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser]);

  return (
    <MqttContext.Provider
      value={{
        mqttClient,
        topics
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
