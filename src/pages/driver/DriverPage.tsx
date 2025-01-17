import BlocksIcon from '../vehicle/blocks/svg/BlocksIcon';
import PeopleIcon from '../vehicle/blocks/svg/PeopleIcon';
import UserMiniCards, { MetricData } from '../vehicle/mini-cards/UserMiniCards';
import { DriverList } from './blocks';

const DriverPage = () => {
  const metrics: MetricData[] = [
    {
      value: 250,
      label: 'Total Drivers',
      textColor: 'text-white',
      bgColor: 'bg-blue-500',
      icon: <BlocksIcon />
    },
    {
      value: 100,
      label: 'Active Drivers',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#5271FF" />
    },
    {
      value: 150,
      label: 'Under Review Drivers',
      textColor: 'text-gray-800',
      icon: <PeopleIcon color="#FFA800" />
    }
  ];

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
