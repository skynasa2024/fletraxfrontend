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
import { toAbsoluteUrl } from '@/utils';
import { format } from 'date-fns';

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

      <div className="flex w-full justify-between mb-8 py-4 px-20 md:px-32 lg:px-56 gap-8 bg-gray-200 rounded-lg">
        {/* Timestamp */}
        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/calendar.svg`)} className="size-8" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.TIME" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {!isNaN(+new Date(+parameters['timestamp']?.data * 1000)) &&
                format(new Date(+parameters['timestamp']?.data * 1000), 'yyyy/MM/dd HH:mm:ss')}
            </div>
          </div>
        </div>

        {/* Battery */}
        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/battery-icon.svg')} className="size-8" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.BATTERY_LEVEL" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {parameters['battery_charging_status']?.data === true
                ? 100
                : (parameters['battery_level']?.data ?? '?')}
              %
            </div>
          </div>
        </div>

        {/* Engine Status */}
        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${parameters['engine_ignition_status']?.data === 'true' ? 'on' : 'off'}.svg`
            )}
            className="size-8"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.ENGINE_STATUS" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {intl.formatMessage({
                id:
                  parameters['engine_ignition_status']?.data === 'UNKNOWN'
                    ? undefined
                    : parameters['engine_ignition_status']?.data === 'true'
                      ? 'STATUS.ON'
                      : 'STATUS.OFF'
              })}
            </div>
          </div>
        </div>

        {/* Engine Block Status */}
        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${parameters['engine_blocked_status']?.data ? 'engine-block-active' : 'engine-block-inactive'}.svg`
            )}
            className="size-8"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.ENGINE_BLOCKED_STATUS" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {intl.formatMessage({
                id: parameters['engine_blocked_status']?.data ? 'STATUS.ACTIVE' : 'STATUS.INACTIVE'
              })}
            </div>
          </div>
        </div>

        {/* Speed Icon */}
        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${parameters['position_speed']?.data > 1 ? 'speed-moving' : 'speed-stop'}.svg`
            )}
            className="size-8"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.SPEED" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{`${parameters['position_speed']?.data.toFixed(0) || '?'} kmh`}</div>
          </div>
        </div>

        {/* Satellites */}
        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/satellites.svg')} className="size-8" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.SATELLITES" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {parameters['position_satellites']?.data ?? '?'}
            </div>
          </div>
        </div>
      </div>

      <ParameterList items={parameters} />
    </div>
  );
};

export default Telemetry;
