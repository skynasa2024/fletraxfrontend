import { forwardRef } from 'react';
import { KeenIcon } from '@/components';
import { useSettings } from '@/providers';
import { INotificationSnackbarProps } from '@/layouts/demo1/header/notifications/types.tsx';
import { FormattedMessage } from 'react-intl';

const NotificationSnackbar = forwardRef<HTMLDivElement, INotificationSnackbarProps>(
  ({ plate, imei, text, date, info }, ref) => {
    const { settings } = useSettings();
    return (
      <div
        ref={ref}
        className="flex justify-between grow gap-4 px-4 py-3 bg-white dark:bg-[#15171C] border-gray-300 rounded-md shadow-lg"
      >
        <div className="flex justify-center items-center size-12 bg-gray-200 rounded-full">
          <KeenIcon
            icon="notification-on"
            className={settings.themeMode === 'dark' ? 'text-white' : 'text-black'}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-gray-900 text-2sm mb-px">
            <FormattedMessage id="NOTIFICATIONS.VEHICLE_PLATE" values={{ plate }} />
          </div>
          <div className="text-gray-900 text-2sm mb-px">
            <FormattedMessage id="NOTIFICATIONS.DEVICE_IMEI" values={{ imei }} />
          </div>
          <span className="text-2sm text-gray-700">
            <FormattedMessage id="NOTIFICATIONS.MESSAGE" values={{ text }} />
          </span>
          <span className="flex items-center text-2xs font-medium text-gray-500">
            <FormattedMessage id="NOTIFICATIONS.DATE" values={{ date }} />
            <span className="badge badge-circle bg-gray-500 size-1 mx-1.5"></span>
            <FormattedMessage id="NOTIFICATIONS.TYPE" values={{ info }} />
          </span>
        </div>
      </div>
    );
  }
);

NotificationSnackbar.displayName = 'NotificationSnackbar';

export { NotificationSnackbar };
