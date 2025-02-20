import { getNotifications, Notification } from '@/api/notifications';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paginated } from '@/api/common.ts';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';

const PAGE_SIZE = 10;

type NotificationsProps = {
  search?: string;
};

const Notifications = ({ search }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Paginated<Notification>>();

  const isRowLoaded = ({ index }: { index: number }) => !!notifications?.data[index];
  const rowCount = notifications?.totalCount;

  const rowRenderer = ({
    index,
    key,
    style
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    const notification = notifications?.data[index];

    return (
      <div key={key} style={style} className="pe-2">
        <NotificationCard notification={notification} />
      </div>
    );
  };

  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const fetched = await getNotifications({
      offset: {
        start: startIndex,
        end: stopIndex
      },
      search
    });

    setNotifications((prev) => {
      const oldData = prev?.data ?? [];
      const newData = [...oldData];
      fetched.data.forEach((item, idx) => {
        newData[startIndex + idx] = item;
      });
      return {
        data: newData,
        totalCount: fetched.totalCount
      };
    });
  };

  useEffect(() => {
    getNotifications({
      offset: {
        start: 0,
        end: PAGE_SIZE - 1
      },
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

      <div className="p-2 pt-0" style={{ width: '100%', height: '100%' }}>
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={rowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(209, 213, 219, 0.8) rgba(209, 213, 219, 0)'
                  }}
                  ref={registerChild}
                  height={height}
                  rowHeight={80}
                  width={width}
                  onRowsRendered={onRowsRendered}
                  rowCount={rowCount || 0}
                  rowRenderer={rowRenderer}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

type NotificationProps = {
  notification?: Notification;
};

function NotificationCard({ notification }: NotificationProps) {
  if (!notification)
    return (
      <>
        <div className="flex gap-4 p-4 pt-5">
          <div className="size-12 rounded-md bg-slate-200 aspect-square animate-pulse" />

          <div className="animate-pulse w-full">
            <div className="bg-slate-200 h-4 w-1/2 rounded-md mb-2" />
            <div className="bg-slate-200 h-3 w-4/5 rounded-md" />
          </div>
        </div>
        <hr className="border-t-2 border-dashed" />
      </>
    );
  return (
    <>
      <div className="flex gap-4 p-4 pt-5">
        {notification.image ? (
          <img src={notification.image} className="size-12 rounded-md object-cover aspect-square" />
        ) : (
          <div className="size-12 rounded-md bg-slate-100 aspect-square" />
        )}
        <div>
          <h4 className="text-gray-800 text-sm font-semibold">{notification.title}</h4>
          <p className="text-gray-600 text-xs font-medium line-clamp-2 text-ellipsis text-pretty">
            {notification.details}
          </p>
        </div>
      </div>
      <div className="border-t-2 border-dashed" />
    </>
  );
}

export { Notifications };
