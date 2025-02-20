import { getNotifications, Notification } from '@/api/notifications';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paginated } from '@/api/common.ts';

type NotificationsProps = {
  search?: string;
};

const Notifications = ({ search }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Paginated<Notification>>();

  useEffect(() => {
    getNotifications({
      page: 0,
      size: 5,
      search
    }).then(setNotifications);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card hover:shadow-md h-full">
      <div className="card-header">
        <div className="card-title">
          <h3>
            <FormattedMessage id="DASHBOARD.NOTIFICATIONS.TITLE" />
          </h3>
        </div>
      </div>

      <div className="card-body flex flex-col gap-4 scrollable grow px-3 py-3">
        {notifications?.data.map((notification) => (
          <Fragment key={notification.id}>
            <NotificationCard notification={notification} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

type NotificationProps = {
  notification: Notification;
};

function NotificationCard({ notification }: NotificationProps) {
  return (
    <>
      <div className="flex gap-4">
        {notification.image ? (
          <img src={notification.image} className="size-12 rounded-md object-cover aspect-square" />
        ) : (
          <div className="size-12 rounded-md bg-slate-100 aspect-square" />
        )}
        <div>
          <div className="text-gray-800 text-sm font-semibold">{notification.title}</div>
          <div className="text-gray-600 text-xs font-medium line-clamp-2 text-ellipsis">
            {notification.details}
          </div>
        </div>
      </div>
      <hr className="border-t-2 border-dashed" />
    </>
  );
}

export { Notifications };
