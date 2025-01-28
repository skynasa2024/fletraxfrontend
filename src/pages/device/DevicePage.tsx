import { useEffect, useMemo, useState } from 'react';
import UserMiniCards from '../vehicle/mini-cards/UserMiniCards';
import { DeviceList } from './blocks';
import BlocksIcon from '../vehicle/blocks/svg/BlocksIcon';
import { DeviceStats, getDevicesStats } from '@/api/devices';
import DeviceIcon from './svg/device.svg?react';
import RoleComponent from '@/components/RoleComponent';

const DevicePage = () => {
  const [deviceStats, setDeviceStats] = useState<DeviceStats>();
  const metrics = useMemo(
    () => [
      {
        value: deviceStats?.total || 0,
        label: 'Total Devices',
        textColor: 'text-white',
        bgColor: 'bg-blue-500',
        icon: <BlocksIcon />
      },
      {
        value: deviceStats?.online || 0,
        label: 'Online Devices',
        textColor: 'text-gray-800',
        icon: <DeviceIcon className="text-teal-500" />
      },
      {
        value: deviceStats?.offline || 0,
        label: 'Offline Devices',
        textColor: 'text-gray-800',
        icon: <DeviceIcon className="text-red-500" />
      },
      {
        value: deviceStats?.connected || 0,
        label: 'Connected Devices',
        textColor: 'text-gray-800',
        icon: <DeviceIcon className="text-orange-500" />
      },
      {
        value: deviceStats?.disconnected || 0,
        label: 'Disconnected Devices',
        textColor: 'text-gray-800',
        icon: <DeviceIcon className="text-violet-500" />
      }
    ],
    [deviceStats]
  );

  const refetch = () => {
    getDevicesStats().then(setDeviceStats);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 h-full">
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-800">Devices</h3>

          <RoleComponent role="admin">
            <a href="/devices/add-device">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
                New Device
              </button>
            </a>
          </RoleComponent>
        </div>
      </div>

      <UserMiniCards metrics={metrics} />
      <DeviceList refetchStats={refetch} />
    </div>
  );
};

export { DevicePage };
