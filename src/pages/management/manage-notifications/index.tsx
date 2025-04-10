import { Paginated } from '@/api/common';
import {
  getNotificationSettings,
  linkNotificationSettings,
  NotificationSettings,
  NotificationSettingType
} from '@/api/notifications';
import { ResponseModel } from '@/api/response';
import { Container, DataGrid } from '@/components';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { ColumnDef } from '@tanstack/react-table';
import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState, FormEvent, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserSelect } from './components';

export default function ManageNotifications() {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Paginated<NotificationSettings>>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = useCallback(
    (
      params = {
        page: 0,
        size: 100,
        sort: 'createdAt,desc',
        search: searchQuery.trim()
      }
    ) => {
      return getNotificationSettings({
        ...params
      }).then((data) => {
        setNotifications(data);
        return data;
      });
    },
    [searchQuery]
  );

  useEffect(() => {
    if (isInitialLoad) {
      fetchNotifications();
      setIsInitialLoad(false);
    }
  }, [fetchNotifications, isInitialLoad]);

  const handleFetchData = useCallback((params: any) => {
    return getNotificationSettings(params);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const webType = (formData.get('webType') as NotificationSettingType) || 'normal';
    const webStatus = formData.get('webStatus') === 'on';
    const selectedUserId = formData.get('userId') as string;

    if (!selectedUserId) {
      enqueueSnackbar(
        intl.formatMessage(
          { id: 'NOTIFICATIONS.USER_REQUIRED' },
          {
            defaultMessage: 'Please select a user'
          }
        ),
        {
          variant: 'error'
        }
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await linkNotificationSettings({
        notificationTypeId: null,
        notificationTypeCode: 'web',
        userId: selectedUserId,
        webType,
        webStatus
      });

      enqueueSnackbar(
        intl.formatMessage(
          { id: 'NOTIFICATIONS.SETTINGS_SAVED' },
          {
            defaultMessage: 'Notification settings saved successfully'
          }
        ),
        {
          variant: 'success'
        }
      );

      // Refresh the notification settings list without resetting the form
      fetchNotifications();
    } catch (error) {
      let errorMessage = intl.formatMessage(
        { id: 'COMMON.ERROR' },
        {
          defaultMessage: 'An error occurred while saving notification settings'
        }
      );

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ResponseModel<any>>;
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo<ColumnDef<NotificationSettings>[]>(
    () => [
      {
        accessorKey: 'user.name',
        header: intl.formatMessage({ id: 'MANAGEMENT.NOTIFICATIONS.COLUMN.NAME' })
      },
      {
        accessorKey: 'webType',
        header: intl.formatMessage({ id: 'MANAGEMENT.NOTIFICATIONS.COLUMN.URGENT' }),
        cell: ({ row }) => {
          const webType: NotificationSettingType = row.getValue('webType');
          return (
            <input
              type="radio"
              className="radio radio-sm checked:!bg-danger checked:!border-danger hover:!border-danger checked:disabled:!border-danger checked:disabled:!bg-danger"
              value={'urgent'}
              checked={webType === 'urgent'}
              disabled
            />
          );
        }
      },
      {
        accessorKey: 'webType',
        header: intl.formatMessage({ id: 'MANAGEMENT.NOTIFICATIONS.COLUMN.IMPORTANT' }),
        cell: ({ row }) => {
          const webType: NotificationSettingType = row.getValue('webType');
          return (
            <input
              type="radio"
              className="radio radio-sm checked:!bg-warning checked:!border-warning hover:!border-warning checked:disabled:!border-warning checked:disabled:!bg-warning"
              value={'important'}
              checked={webType === 'important'}
              disabled
            />
          );
        }
      },
      {
        accessorKey: 'webType',
        header: intl.formatMessage({ id: 'MANAGEMENT.NOTIFICATIONS.COLUMN.NORMAL' }),
        cell: ({ row }) => {
          const webType: NotificationSettingType = row.getValue('webType');
          return (
            <input
              type="radio"
              className="radio radio-sm checked:!bg-success checked:!border-success hover:!border-success checked:disabled:!border-success checked:disabled:!bg-success"
              value={'normal'}
              checked={webType === 'normal'}
              disabled
            />
          );
        }
      },
      {
        accessorKey: 'webStatus',
        header: intl.formatMessage({ id: 'MANAGEMENT.NOTIFICATIONS.COLUMN.STATUS' }),
        cell: ({ row }) => {
          const webStatus: boolean = row.getValue('webStatus');
          return (
            <div className="switch switch-lg">
              <input
                type="checkbox"
                className="switch switch-lg switch-info checked:!bg-info checked:!border-info hover:!border-info checked:disabled:!border-info checked:disabled:!bg-info !opacity-100"
                value={'webStatus'}
                checked={webStatus}
                disabled
              />
            </div>
          );
        }
      },
      {
        header: intl.formatMessage({ id: 'COMMON.ACTIONS' }),
        cell: () => (
          <div className="flex items-center gap-2">{/* Action buttons would go here */}</div>
        )
      }
    ],
    [intl]
  );

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
          description={<FormattedMessage id="MANAGEMENT.NOTIFICATIONS.TOOLBAR.DESCRIPTION" />}
        />
      </Toolbar>

      <div className="card">
        <div className="flex justify-between items-center p-4">
          <h2 className="font-semibold">
            <FormattedMessage
              id="MANAGEMENT.NOTIFICATIONS.NOTIFICATION_COUNT"
              values={{ count: notifications?.totalCount ?? 0 }}
            />
          </h2>
          <DebouncedSearchInput
            onDebounce={setSearchQuery}
            placeholder={intl.formatMessage({ id: 'COMMON.SEARCH' })}
            className="w-64 py-2 text-sm border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info input"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="report-table-container">
            <DataGrid
              columns={columns}
              serverSide={true}
              onFetchData={handleFetchData}
              pagination={{ size: 100, sizes: undefined }}
              filters={[
                ...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])
              ]}
              supplementaryHeaderRow={<QuickAddNotificationsUserFrom isSubmitting={isSubmitting} />}
            />
          </div>
        </form>
      </div>
    </Container>
  );
}

interface QuickAddNotificationsUserFromProps {
  isSubmitting: boolean;
}

function QuickAddNotificationsUserFrom({ isSubmitting }: QuickAddNotificationsUserFromProps) {
  return (
    <>
      <th colSpan={1} className="!p-1 !bg-green-700/5">
        <UserSelect place="bottom" />
      </th>
      <th colSpan={1} className="!py-1 !px-4 !bg-green-700/5">
        <input
          type="radio"
          className="radio radio-sm checked:!bg-danger checked:!border-danger hover:!border-danger"
          value="urgent"
          name="webType"
        />
      </th>
      <th colSpan={1} className="!py-1 !px-4 !bg-green-700/5">
        <input
          type="radio"
          className="radio radio-sm checked:!bg-warning checked:!border-warning hover:!border-warning"
          value="important"
          name="webType"
        />
      </th>
      <th colSpan={1} className="!py-1 !px-4 !bg-green-700/5">
        <input
          type="radio"
          className="radio radio-sm checked:!bg-success checked:!border-success hover:!border-success"
          value="normal"
          name="webType"
          defaultChecked
        />
      </th>
      <th colSpan={1} className="!py-1 !px-4 !bg-green-700/5">
        <div className="switch switch-lg">
          <input
            type="checkbox"
            className="switch switch-lg switch-info checked:!bg-info checked:!border-info hover:!border-info"
            name="webStatus"
            defaultChecked
          />
        </div>
      </th>
      <th colSpan={1} className="!p-1 !bg-green-700/5 flex items-center justify-center">
        <button
          type="submit"
          className="btn btn-success flex items-center justify-center w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="animate-pulse">
              <FormattedMessage id="COMMON.SAVING" defaultMessage="Saving..." />
            </span>
          ) : (
            <FormattedMessage id="COMMON.ADD" defaultMessage="Add" />
          )}
        </button>
      </th>
    </>
  );
}
