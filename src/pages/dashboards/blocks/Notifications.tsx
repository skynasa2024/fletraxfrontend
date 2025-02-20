import { getNotifications, NotificationDTO } from '@/api/notifications';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paginated } from '@/api/common.ts';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { format } from 'date-fns';
import { CarPlate } from './CarPlate';
import {
  BatteryAlarmNotificationIcon,
  DefaultNotificationIcon,
  EngineOffNotificationIcon,
  EngineOnNotificationIcon,
  EnterGeofenceNotificationIcon,
  ExceedSpeedNotificationIcon,
  ExitGeofenceNotificationIcon,
  PowerCutAlarmNotificationIcon,
  SharpTurnNotificationIcon,
  VibrationAlarmNotificationIcon
} from '@/assets/svg';

const PAGE_SIZE = 10;
const ROW_HEIGHT = 90;

const NOTIFICATION_ICONS = {
  BATTERY_ALARM: <BatteryAlarmNotificationIcon />,
  engine_off: <EngineOffNotificationIcon />,
  engine_on: <EngineOnNotificationIcon />,
  ENTER_GEOFENCE: <EnterGeofenceNotificationIcon />,
  EXIT_GEOFENCE: <ExitGeofenceNotificationIcon />,
  speeding_alarm: <ExceedSpeedNotificationIcon />,
  unplug: <PowerCutAlarmNotificationIcon />,
  sharp_turn_alarm: <SharpTurnNotificationIcon />,
  vibration_alarm: <VibrationAlarmNotificationIcon />
} as const;

const NOTIFICATION_PATTERNS = [
  { pattern: /turn off the power switch/i, icon: 'engine_off' },
  { pattern: /turn on the power switch/i, icon: 'engine_on' },
  { pattern: /sharp turn alarm/i, icon: 'sharp_turn_alarm' },
  { pattern: /vibration alarm/i, icon: 'vibration_alarm' },
  { pattern: /battery/i, icon: 'BATTERY_ALARM' },
  { pattern: /enter(ed)? (the )?(?:geo)?fence/i, icon: 'ENTER_GEOFENCE' },
  { pattern: /exit(ed)? (the )?(?:geo)?fence/i, icon: 'EXIT_GEOFENCE' },
  { pattern: /speed|speeding/i, icon: 'speeding_alarm' },
  { pattern: /unplug|power cut/i, icon: 'unplug' }
] as const;

const findClosestNotificationIcon = (text: string) => {
  // Find the first matching pattern
  const match = NOTIFICATION_PATTERNS.find(({ pattern }) => pattern.test(text));

  if (match) {
    return NOTIFICATION_ICONS[match.icon as keyof typeof NOTIFICATION_ICONS];
  }

  return <DefaultNotificationIcon />;
};

type NotificationsProps = {
  search?: string;
};

const Notifications = ({ search }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Paginated<NotificationDTO>>();

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
      const data = prev?.data ?? [];
      fetched?.data.forEach((notification, index) => {
        data[startIndex + index] = notification;
      });
      return {
        data,
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
                  rowHeight={ROW_HEIGHT}
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
  notification?: NotificationDTO;
};

function NotificationCard({ notification }: NotificationProps) {
  if (!notification)
    return (
      <div className="flex flex-col gap-3 mt-3 ps-1 pe-2 h-20">
        <div className="flex gap-4 items-center justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="size-12 rounded-md bg-slate-200 aspect-square animate-pulse" />
            <div>
              <div className="bg-slate-200 h-4 w-32 rounded-md mb-2 animate-pulse" />
              <div className="bg-slate-200 h-3 w-24 rounded-md mb-2 animate-pulse" />
              <div className="bg-slate-200 h-3 w-48 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-1">
            <CarPlate />
            <div className="bg-slate-200 h-4 w-20 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="border-t-2 border-dashed" />
      </div>
    );
  return (
    <div className="flex flex-col gap-3 mt-3 ps-1 pe-2 h-20">
      <div className="flex gap-4 items-center justify-between w-full">
        <div className="flex gap-2 items-center">
          <div className="size-12 rounded-md card border-none aspect-square flex items-center justify-center">
            {NOTIFICATION_ICONS[notification.text as keyof typeof NOTIFICATION_ICONS] ||
              findClosestNotificationIcon(notification.text)}
          </div>
          <div>
            <h4 className="text-gray-800 text-md font-semibold">{notification.type}</h4>
            <p className="text-gray-600 text-xs font-medium line-clamp-1 text-ellipsis text-pretty">
              {!isNaN(+new Date(+notification.createdAt * 1000)) &&
                format(new Date(+notification.createdAt * 1000), 'yyyy/MM/dd HH:mm:ss')}
            </p>
            <p className="text-gray-600 text-sm font-medium line-clamp-1 text-ellipsis text-pretty">
              {notification.text}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center gap-1">
          <CarPlate plate={notification.vehiclePlate} />
          <span className="text-sm font-monospace">{notification.deviceIdent}</span>
        </div>
      </div>
      <div className="border-t-2 border-dashed" />
    </div>
  );
}

export { Notifications };
