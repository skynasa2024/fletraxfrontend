import Map from '@/pages/device/Map';
import { useMqttProvider } from '@/providers/MqttProvider';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Device, getDevice } from '@/api/devices';

export default function VehicleCurrentLocation({ deviceId }: { deviceId?: string | null }) {
  const { mqttClient } = useMqttProvider();

  const [parameters, setParameters] = useState<
    Record<string, { data: any; timestamp: Date; latest: boolean }>
  >({});

  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);

  const onMessage = (topic: string, message: Buffer) => {
    const device: Record<string, any> = JSON.parse(message.toString('utf-8'));
    const timestamp = new Date(device.server_timestamp * 1000);
    const newParameters = { ...parameters };
    for (const key in parameters) {
      newParameters[key].latest = false;
    }
    for (const key in device) {
      newParameters[key] = { data: device[key], timestamp, latest: true };
    }
    setParameters(newParameters);
  };

  useEffect(() => {
    if (!mqttClient) return;

    const topic = `user/monitoring/+/${currentDevice?.ident}`;
    if (!topic) return;
    if (mqttClient.connected) {
      mqttClient.subscribeAsync(topic);
    } else {
      mqttClient.once('connect', () => {
        mqttClient.subscribeAsync(topic);
      });
    }

    mqttClient.on('message', onMessage);

    return () => {
      mqttClient.off('message', onMessage);
      mqttClient.unsubscribeAsync(topic);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDevice?.ident, mqttClient]);

  useEffect(() => {
    (async () => {
      if (deviceId) {
        const res = await getDevice(deviceId);
        setCurrentDevice(res);
      }
    })();
  }, [deviceId]);

  return (
    <Map
      location={
        parameters['position_latitude']?.data &&
        parameters['position_longitude']?.data && {
          lat: parameters['position_latitude']?.data,
          lng: parameters['position_longitude']?.data
        }
      }
      direction={parameters['position_direction']?.data}
      engineStatus={parameters['engine_ignition_status']?.data}
      online={parameters['status']?.data === 'online'}
    />
  );
}
