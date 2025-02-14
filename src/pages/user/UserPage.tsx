import { useEffect, useMemo, useState } from 'react';
import UserMiniCards from '../vehicle/mini-cards/UserMiniCards';
import { UserList } from './blocks';
import PeopleIcon from '../vehicle/blocks/svg/PeopleIcon';
import BlocksIcon from '../vehicle/blocks/svg/BlocksIcon';
import { getUserStats, UserStats } from '@/api/user';
import { FormattedMessage, useIntl } from 'react-intl';

const UserPage = () => {
  const [usersStats, setUsersStats] = useState<UserStats>();
  const intl = useIntl();
  const metrics = useMemo(
    () => [
      {
        value: usersStats?.total || 0,
        label: intl.formatMessage({ id: 'USER_PAGE.METRICS.TOTAL_USERS' }),
        textColor: 'text-white',
        bgColor: 'bg-blue-500',
        icon: <BlocksIcon />
      },
      {
        value: usersStats?.active || 0,
        label: intl.formatMessage({ id: 'USER_PAGE.METRICS.ACTIVE_USERS' }),
        textColor: 'text-gray-800',
        icon: <PeopleIcon color="#5271FF" />
      },
      {
        value: usersStats?.unactive || 0,
        label: intl.formatMessage({ id: 'USER_PAGE.METRICS.INACTIVE_USERS' }),
        textColor: 'text-gray-800',
        icon: <PeopleIcon color="#FFA800" />
      }
    ],
    [intl, usersStats?.active, usersStats?.total, usersStats?.unactive]
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
        <h3 className="font-bold text-xl text-gray-800">
          <FormattedMessage id="USER_PAGE.TITLE" />
        </h3>

        <a href="/users/add-user">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            <FormattedMessage id="USER_PAGE.NEW_USER" />
          </button>
        </a>
      </div>

      <UserMiniCards metrics={metrics} />
      <UserList refetch={refetch} />
    </div>
  );
};

export { UserPage };
