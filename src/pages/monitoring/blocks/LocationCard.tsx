import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import 'react-resizable/css/styles.css';
import { toAbsoluteUrl } from '@/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { reverseGeoLocation } from '@/api/devices';

export const LocationCard = () => {
  const { selectedLocation: location } = useMonitoringProvider();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      return;
    }

    reverseGeoLocation(location.lat, location.long).then((data) => {
      setAddress(data);
    });
  }, [location]);

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
          {location.online ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="card-body px-[34px] py-[10px] border-b grid grid-cols-4 gap-y-[10px] gap-x-[14px]">
        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/hash.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">IMEI</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{location.vehicle.imei}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/device.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Device Name</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{location.vehicle.name}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img
            src={toAbsoluteUrl(`/media/icons/${location.status.engineStatus ? 'on' : 'off'}.svg`)}
            className="size-[21px]"
          />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Engine Status</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.engineStatus ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Parking Time</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.parkingTime}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl(`/media/icons/calendar.svg`)} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Time</div>
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
            <div className="text-[#A1A5B7] text-[10px]">Speed</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{`${location.status.speed.toFixed(0)} kmh`}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/satellites.svg')} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Satellites</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.satellietes}
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/battery-icon.svg')} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Battery Level</div>
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
            <div className="text-[#A1A5B7] text-[10px]">Engine Blocked Status</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.engineBlocked ? 'Active' : 'Inactive'}
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
            <div className="text-[#A1A5B7] text-[10px]">Defense Status</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.defenseStatus ? 'Active' : 'Inactive'}
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
            <div className="text-[#A1A5B7] text-[10px]">Siginal Level</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{`${location.status.signalLevel}%`}</div>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} className="size-[21px]" />
          <div className="font-semibold">
            <div className="text-[#A1A5B7] text-[10px]">Existing Kilometers</div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {location.status.existingKilometer}
            </div>
          </div>
        </div>
      </div>
      <div className="card-body flex gap-2 px-[34px] py-[10px] text-[#A1A5B7] font-medium text-xs max-w-[680px]">
        <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} />
        <div>{address || 'Loading...'}</div>
      </div>
      <div className="card-footer justify-center p-0 text-[#1F242E] dark:text-gray-800">
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>Report</span>
        </a>
        <a
          href={`/trips?device=${location.vehicle.imei}`}
          className="px-5 py-2 flex gap-2 !text-inherit"
        >
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>Play back</span>
        </a>
        <a
          href={`/devices/device/${location.vehicle.imei}/telemetry`}
          className="px-5 py-2 flex gap-2 !text-inherit"
        >
          <img src={toAbsoluteUrl('/media/icons/calendar-gray.svg')} />
          <span>Tracking</span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>Command</span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>Streetview</span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 !text-inherit">
          <img src={toAbsoluteUrl('/media/icons/delete-gray.svg')} />
          <span>Share</span>
        </a>
      </div>
    </div>
  );
};
