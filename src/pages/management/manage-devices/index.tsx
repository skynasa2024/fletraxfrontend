import { Paginated } from '@/api/common';
import { DeviceDTO, getDevices } from '@/api/devices';
import { Container, DataGrid, KeenIcon } from '@/components';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { useDeviceProvider } from '@/providers/DeviceProvider';
import { toAbsoluteUrl } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export default function ManageDevices() {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState<Paginated<DeviceDTO>>();
  const { getProtocolName, getTypeName } = useDeviceProvider();

  useEffect(() => {
    getDevices({
      pageIndex: 0,
      pageSize: 1
    }).then((data) => {
      setDevices(data);
    });
  }, []);

  const columns = useMemo<ColumnDef<DeviceDTO>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'name',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.NAME' }),
        enableSorting: true
      },
      {
        accessorKey: 'phone',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PHONE' }),
        enableSorting: true
      },
      {
        accessorKey: 'protocol',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PROTOCOL' }),
        cell: ({ row }) => <span>{getProtocolName(row.original.protocolId)}</span>
      },
      {
        accessorKey: 'type',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.TYPE' }),
        cell: ({ row }) => <span>{getTypeName(row.original.typeId)}</span>
      },
      {
        accessorKey: 'vehiclePlate',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.PLATE' }),
        cell: ({ row }) => <CarPlate plate={row.original.vehiclePlate} />
      },
      // {
      //   accessorKey: 'branch',
      //   header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.BRANCH' })
      // },
      {
        accessorKey: 'subscriptionStartDate',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.START_DATE' })
      },
      {
        accessorKey: 'subscriptionEndDate',
        header: intl.formatMessage({ id: 'MANAGEMENT.DEVICES.COLUMN.END_DATE' })
      },
      {
        header: intl.formatMessage({ id: 'COMMON.ACTIONS' }),
        cell: () => (
          <div className="flex items-center gap-2">
            <button
              className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
              title={intl.formatMessage({ id: 'COMMON.VIEW' })}
            >
              <img
                src={toAbsoluteUrl('/media/icons/view-light.svg')}
                alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
              />
            </button>

            <button
              className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#50CD89]/10"
              title={intl.formatMessage({ id: 'COMMON.EDIT' })}
            >
              <img
                src={toAbsoluteUrl('/media/icons/edit-light.svg')}
                alt={intl.formatMessage({ id: 'COMMON.EDIT' })}
              />
            </button>
          </div>
        )
      }
    ],
    [intl, getProtocolName, getTypeName]
  );

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading
          title={<FormattedMessage id="SIDEBAR.MENU.MANAGEMENT" />}
          description={<FormattedMessage id="MANAGEMENT.TOOLBAR.DESCRIPTION" />}
        />
      </Toolbar>

      <div className="card">
        <div className="flex justify-between items-center p-4">
          <h2 className="font-semibold">
            <FormattedMessage
              id="MANAGEMENT.DEVICES.DEVICE_COUNT"
              values={{ count: devices?.totalCount ?? 0 }}
            />
          </h2>

          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeenIcon style="duotone" icon="magnifier" />
              </div>
              <DebouncedSearchInput
                value={searchQuery}
                onDebounce={setSearchQuery}
                type="text"
                placeholder={intl.formatMessage({ id: 'COMMON.SEARCH' })}
                className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info input"
              />
            </div>
            <button className="btn btn-info rounded-lg">
              <img src={toAbsoluteUrl('/media/icons/white-device.svg')} alt="Add" />
              <span>
                <FormattedMessage id="COMMON.DEVICE" />
              </span>
            </button>
          </div>
        </div>
        <div className="report-table-container">
          <DataGrid
            columns={columns}
            serverSide={true}
            onFetchData={getDevices}
            filters={[
              ...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])
            ]}
          />
        </div>
      </div>
    </Container>
  );
}
