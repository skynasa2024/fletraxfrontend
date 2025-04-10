import { Paginated } from '@/api/common';
import {
  getNotificationSettings,
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

export default function ManageNotifications() {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Paginated<NotificationSettings>>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  // Create a dedicated handler for DataGrid fetch requests
  const handleFetchData = useCallback((params: any) => {
    return getNotificationSettings(params);
  }, []);

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
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#50CD89]/10"
              title={intl.formatMessage({ id: 'COMMON.EDIT' })}
              onClick={() => openEditModal(row.original)}
            >
              <img
                src={toAbsoluteUrl('/media/icons/edit-light.svg')}
                alt={intl.formatMessage({ id: 'COMMON.EDIT' })}
              />
            </button> */}
          </div>
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
        <form>
          <div className="report-table-container">
            <DataGrid
              columns={columns}
              serverSide={true}
              onFetchData={handleFetchData}
              pagination={{ size: 100, sizes: undefined }}
              filters={[
                ...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])
              ]}
              supplementaryHeaderRow={<QuickAddNotificationsUserFrom />}
            />
          </div>
        </form>
      </div>
    </Container>
  );
}

function QuickAddNotificationsUserFrom() {
  // const intl = useIntl();
  return <></>;
}
