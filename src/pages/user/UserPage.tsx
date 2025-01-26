import { useEffect, useMemo, useState } from 'react';
import UserMiniCards from '../vehicle/mini-cards/UserMiniCards';
import { UserList } from './blocks';
import PeopleIcon from '../vehicle/blocks/svg/PeopleIcon';
import BlocksIcon from '../vehicle/blocks/svg/BlocksIcon';
import { getUserStats, UserStats } from '@/api/user';

const UserPage = () => {
  const [usersStats, setUsersStats] = useState<UserStats>();
  const metrics = useMemo(
    () => [
      {
        value: usersStats?.total || 0,
        label: 'Total Users',
        textColor: 'text-white',
        bgColor: 'bg-blue-500',
        icon: <BlocksIcon />
      },
      {
        value: usersStats?.active || 0,
        label: 'Active Users',
        textColor: 'text-gray-800',
        icon: <PeopleIcon color="#5271FF" />
      },
      {
        value: usersStats?.unactive || 0,
        label: 'Under Review Users',
        textColor: 'text-gray-800',
        icon: <PeopleIcon color="#FFA800" />
      }
    ],
    [usersStats]
  );

  const refetch = () => {
    getUserStats().then(setUsersStats);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">User List</h3>

        <a href="/users/add-user">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            New User
          </button>
        </a>
      </div>

      <UserMiniCards metrics={metrics} />
      <UserList refetch={refetch} />
    </div>
  );
};

export { UserPage };
