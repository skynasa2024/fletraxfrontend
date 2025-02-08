import { getMonitoringDevices, MonitoringDTO } from '@/api/devices';
import { KeenIcon } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { useEffect, useMemo, useState } from 'react';

interface TripsSearchProps {
  search: string;
  // eslint-disable-next-line no-unused-vars
  setSearch: (value: string) => void;
  onSearch?: () => void;
  // eslint-disable-next-line no-unused-vars
  onSelectDevice?: (device: MonitoringDTO) => void;
}
export const TripsSearch = ({ search, setSearch, onSearch, onSelectDevice }: TripsSearchProps) => {
  const [devices, setDevices] = useState<MonitoringDTO[]>();
  const filteredDevices = useMemo(() => {
    return devices?.filter(
      (device) =>
        device.ident.toLowerCase().includes(search.toLowerCase()) ||
        (device.vehiclePlate
          ? device.vehiclePlate.toLowerCase().includes(search.toLowerCase())
          : false)
    );
  }, [devices, search]);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    getMonitoringDevices()
      .then((devices) => {
        setDevices(devices);
        return devices;
      })
      .then((devices) => {
        if (!search) {
          setSearch(devices[0].ident);
        }
        onSearch?.();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="input input-sm h-[34px] shrink-0 relative">
      <input
        type="text"
        placeholder="Search Devices"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button className="btn btn-icon" onClick={() => setSearch('')}>
        <KeenIcon icon="cross" />
      </button>
      {(focused || hovered) && (
        <div
          className="absolute top-full left-0 w-full max-h-96 card dark:border-gray-200 mt-1 z-50 scrollable-y"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!filteredDevices && <div className="p-2">Loading...</div>}
          {filteredDevices?.map((device) => (
            <div
              key={device.ident}
              className="p-2 hover:bg-gray-100 flex justify-between items-center gap-2 cursor-pointer"
              onClick={() => {
                setSearch(device.ident);
                setHovered(false);
                onSelectDevice?.(device);
              }}
            >
              <CarPlate plate={device.vehiclePlate ?? ''} />
              <div>{device.ident}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
