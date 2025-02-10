import SpeedGauge from '../SpeedGuage';
import Car from '../Car';
import Map from '../Map';
import ParameterList from '../ParameterList';
import { useMqttProvider } from '@/providers/MqttProvider';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useOutletContext } from 'react-router';
import { DeviceDTO } from '@/api/devices';

const Telemetry = () => {
  const { mqttClient } = useMqttProvider();
  const [parameters, setParameters] = useState<
    Record<string, { data: any; timestamp: Date; latest: boolean }>
  >({});
  const { device }: { device: DeviceDTO } = useOutletContext();
  const topic = `user/monitoring/+/${device.ident}`;

  const onMessage = (incomingTopic: string, message: Buffer) => {
    if (incomingTopic !== topic) return;
    setParameters((prev) => {
      const device: Record<string, any> = JSON.parse(message.toString('utf-8'));
      const timestamp = new Date(device.server_timestamp * 1000);
      const newParameters = { ...prev };
      for (const key in prev) {
        newParameters[key].latest = false;
      }
      for (const key in device) {
        newParameters[key] = { data: device[key], timestamp, latest: true };
      }
      return newParameters;
    });
  };

  useEffect(() => {
    if (!mqttClient) return;

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
  }, [device.ident, mqttClient]);

  return (
    <div className="flex flex-col space-y-4 overflow-hidden">
      <div className="flex justify-between gap-4 p-2">
        {/* Speed Gauge */}
        <div className="flex items-center justify-start">
          <div className="card flex flex-col max-w-sm p-8 w-96 h-[454px]">
            <SpeedGauge value={parameters['position_speed']?.data} maxValue={160} />
            <div className="flex flex-col gap-4 justify-center mt-4">
              <div>
                <span className="font-bold">Existing kilometers:</span>{' '}
                <span>{parameters['existing_kilometers']?.data ?? '?'}</span>
              </div>
              <div>
                <span className="font-bold">Parking time:</span>{' '}
                <span>{parameters['parking_time']?.data ?? '?'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex flex-1 items-center justify-center">
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
        </div>

        {/* Car */}
        <div className="flex items-center justify-end">
          <Car
            satalites={parameters['position_satellites']?.data}
            signalStrength={parameters['gsm_signal_level']?.data}
            battery={
              parameters['battery_charging_status']?.data === true
                ? 100
                : parameters['battery_level']?.data
            }
            direction={parameters['position_direction']?.data}
          />
        </div>
      </div>

      <ParameterList items={parameters} />
    </div>
  );
};

export default Telemetry;
