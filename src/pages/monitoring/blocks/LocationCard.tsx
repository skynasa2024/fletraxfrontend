import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import 'react-resizable/css/styles.css';
import { toAbsoluteUrl } from '@/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { reverseGeoLocation } from '@/api/devices';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLanguage } from '@/i18n';

export const LocationCard = () => {
  const intl = useIntl();
  const { currentLanguage } = useLanguage();
  const { selectedLocation: location } = useMonitoringProvider();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      return;
    }

    reverseGeoLocation(location.lat, location.long, currentLanguage.code).then((data) => {
      setAddress(data);
    });
  }, [currentLanguage.code, location]);

  if (!location) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header border-dashed border-b-2 px-10 py-[14px]">
        <CarPlate plate={location.vehicle.plate} />
        <div
          data-online={location.online}
          className="rounded-md font-medium text-xs bg-[#F1416C]/10 text-[#F1416C] data-[online=true]:bg-[#50CD89]/10 data-[online=true]:text-[#50CD89] px-[10px] py-[6px] self-center"
        >
          {location.online
            ? intl.formatMessage({ id: 'DASHBOARD.MOVING_DEVICE.ONLINE' })
            : intl.formatMessage({ id: 'DASHBOARD.MOVING_DEVICE.OFFLINE' })}
        </div>
      </div>

      <div className="card-body px-[34px] py-[10px] border-b grid grid-cols-4 gap-y-[10px] gap-x-[14px]">
        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/hash.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.IMEI" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{location.vehicle.imei}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/device.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.DEVICE_NAME" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{location.vehicle.name}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(`/media/icons/${location.status.engineStatus ? 'on' : 'off'}.svg`)}
            className="size-[21px]"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.ENGINE_STATUS" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {intl.formatMessage({
                id: location.status.engineStatus ? 'STATUS.ON' : 'STATUS.OFF'
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.PARKING_TIME" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.parkingTime}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/calendar.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.TIME" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {format(location.status.timestamp, 'yyyy/MM/dd HH:mm:ss')}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${location.status.speed > 1 ? 'speed-moving' : 'speed-stop'}.svg`
            )}
            className="size-[21px]"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.SPEED" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{`${location.status.speed.toFixed(0)} kmh`}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/satellites.svg')} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.SATELLITES" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.satellietes}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/battery-icon.svg')} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.BATTERY_LEVEL" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.batteryLevel}%
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${location.status.engineBlocked ? 'engine-block-active' : 'engine-block-inactive'}.svg`
            )}
            className="size-[21px]"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.ENGINE_BLOCKED_STATUS" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {intl.formatMessage({
                id: location.status.engineBlocked ? 'STATUS.ACTIVE' : 'STATUS.INACTIVE'
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${location.status.defenseStatus ? 'defense-active' : 'defense-inactive'}.svg`
            )}
            className="size-[21px]"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.DEFENSE_STATUS" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {intl.formatMessage({
                id: location.status.defenseStatus ? 'STATUS.ACTIVE' : 'STATUS.INACTIVE'
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(
              `/media/icons/${location.status.signalLevel >= 50 ? 'signal-good' : 'signal-medium'}.svg`
            )}
            className="size-[21px]"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.SIGNAL_LEVEL" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{`${location.status.signalLevel}%`}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="LOCATION.FIELD.EXISTING_KILOMETERS" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.existingKilometer}
            </div>
          </div>
        </div>
      </div>
      <div className="card-body flex gap-2 px-[34px] py-[10px] text-[#A1A5B7] font-medium text-xs max-w-[680px]">
        <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} />
        <div>{address || <FormattedMessage id="COMMON.LOADING" />}</div>
      </div>
      <div className="card-footer justify-center p-0 text-[#1F242E] dark:text-gray-800">
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>
            <FormattedMessage id="LOCATION.ACTION.REPORT" />
          </span>
        </a>
        <a
          href={`/trips?device=${location.vehicle.imei}`}
          className="px-5 py-2 flex gap-2 !text-inherit"
        >
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>
            <FormattedMessage id="LOCATION.ACTION.PLAY_BACK" />
          </span>
        </a>
        <a
          href={`/devices/device/${location.vehicle.imei}/telemetry`}
          className="px-5 py-2 flex gap-2 !text-inherit"
        >
          <img src={toAbsoluteUrl('/media/icons/calendar-gray.svg')} />
          <span>
            <FormattedMessage id="LOCATION.ACTION.TRACKING" />
          </span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>
            <FormattedMessage id="LOCATION.ACTION.COMMAND" />
          </span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>
            <FormattedMessage id="LOCATION.ACTION.STREETVIEW" />
          </span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>
            <FormattedMessage id="LOCATION.ACTION.SHARE" />
          </span>
        </a>
      </div>
    </div>
  );
};
