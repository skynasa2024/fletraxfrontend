import SpeedGauge from '../SpeedGuage';
import Car from '../Car';
import Map from '../Map';
import ParameterList from '../ParameterList';
import { useMqttProvider } from '@/providers/MqttProvider';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useOutletContext } from 'react-router';
import { DeviceDTO } from '@/api/devices';
import { FormattedMessage, useIntl } from 'react-intl';
import SignalStrenghtIcon from '../svg/SignalStrenghtIcon';
import SignalIcon from '../svg/SignalIcon';
import BatteryIcon from '../svg/BatteryIcon';
import { toAbsoluteUrl } from '@/utils';

const Telemetry = () => {
  const intl = useIntl();
  const { mqttClient } = useMqttProvider();
  const [parameters, setParameters] = useState<
    Record<string, { data: any; timestamp: Date; latest: boolean }>
  >({});
  const { device }: { device: DeviceDTO } = useOutletContext();
  const topic = `user/monitoring/+/${device.ident}`;

  const onMessage = (incomingTopic: string, message: Buffer) => {
    if (!incomingTopic.startsWith('user/monitoring') && !incomingTopic.includes(device.ident))
      return;
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
      <div className="flex justify-between gap-4">
        {/* Speed Gauge */}
        <div className="flex items-center justify-start">
          <div className="card flex flex-col max-w-sm p-4 w-96">
            <SpeedGauge value={parameters['position_speed']?.data} maxValue={160} />

            <div className="flex gap-4 justify-between items-center mt-4 bg-neutral-100 p-4 rounded-lg">
              <div>
                <div className="flex gap-1 items-center">
                  <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
                  <span className="text-xs font-medium text-[#5E6278] dark:text-gray-700">
                    <FormattedMessage id="DEVICE.TELEMETRY.PARKING_TIME" />:
                  </span>
                </div>
                <span className="font-semibold text-dark text-md">
                  {parameters['parking_time']?.data ?? '?'}
                </span>
              </div>
              <div>
                <div className="flex gap-1 items-center">
                  <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} />
                  <span className="text-xs font-medium text-[#5E6278] dark:text-gray-700">
                    <FormattedMessage id="DEVICE.TELEMETRY.EXISTING_KILOMETERS" />:
                  </span>
                </div>
                <span className="font-semibold text-dark text-md">
                  {parameters['existing_kilometers']?.data ?? '?'}
                </span>
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
          <Car direction={parameters['position_direction']?.data} />
        </div>
      </div>

      <div className="flex w-full justify-center gap-8 mb-8 p-4">
        {/* Signal Icon */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg bg-[#5151F9] flex items-center justify-center"
            title={intl.formatMessage({ id: 'DEVICE.CAR.SATELLITE.TITLE' })}
          >
            <SignalIcon />
          </div>
          <span className="text-gray-700">{parameters['position_satellites']?.data ?? '?'}</span>
        </div>

        {/* Signal Strength Icon */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg bg-[#FFA800] flex items-center justify-center"
            title={intl.formatMessage({ id: 'DEVICE.CAR.SIGNAL.TITLE' })}
          >
            <SignalStrenghtIcon />
          </div>
          <span className="text-gray-700">{parameters['gsm_signal_level']?.data ?? '?'}%</span>
        </div>

        {/* Battery Icon */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center"
            title={intl.formatMessage({ id: 'DEVICE.CAR.BATTERY.TITLE' })}
          >
            <BatteryIcon />
          </div>
          <span className="text-gray-700">
            {parameters['battery_charging_status']?.data === true
              ? 100
              : (parameters['battery_level']?.data ?? '?')}
            %
          </span>
        </div>
      </div>

      <ParameterList items={parameters} />
    </div>
  );
};

export default Telemetry;
