import { DriverStats, getDriversStats } from '@/api/drivers';
import BlocksIcon from '../vehicle/blocks/svg/BlocksIcon';
import PeopleIcon from '../vehicle/blocks/svg/PeopleIcon';
import UserMiniCards from '../vehicle/mini-cards/UserMiniCards';
import { DriverList } from './blocks';
import { useEffect, useMemo, useState } from 'react';

const DriverPage = () => {
  const [driversStats, setDriversStats] = useState<DriverStats>();
  const metrics = useMemo(
    () => [
      {
        value: driversStats?.total || 0,
        label: 'Total Drivers',
        textColor: 'text-white',
        bgColor: 'bg-blue-500',
        icon: <BlocksIcon />
      },
      {
        value: driversStats?.active || 0,
        label: 'Active Drivers',
        textColor: 'text-gray-800',
        icon: <PeopleIcon color="#5271FF" />
      },
      {
        value: driversStats?.unactive || 0,
        label: 'Under Review Drivers',
        textColor: 'text-gray-800',
        icon: <PeopleIcon color="#FFA800" />
      }
    ],
    [driversStats]
  );

  useEffect(() => {
    getDriversStats().then(setDriversStats);
  }, []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">Driver List</h3>

        <a href="/users/add-user">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            New Driver
          </button>
        </a>
      </div>

      <UserMiniCards metrics={metrics} />
      <DriverList />
    </div>
  );
};

export { DriverPage };
