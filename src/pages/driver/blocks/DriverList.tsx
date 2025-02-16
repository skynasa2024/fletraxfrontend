import React, { useMemo, useState } from 'react';
import {
  DataGrid,
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle,
  useDataGrid
} from '@/components';
import { getDrivers, DriverDetails, updateDriverStatus, deleteDriver } from '@/api/drivers';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { CarView } from '@/pages/vehicle/blocks/CarView';
import { StatusDropdown } from '@/pages/dashboards/blocks/StatusDropdown';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDialogs } from '@toolpad/core/useDialogs';

const DriverListDropdown = (
  info: CellContext<DriverDetails, unknown> & { refetch: () => void }
) => {
  const intl = useIntl();
  const reload = useDataGrid().fetchServerSideData;
  return (
    <StatusDropdown
      selected={info.row.original.status}
      setSelected={async (status) => {
        await updateDriverStatus(info.row.original.id, status === 'Active');
        reload();
        info.refetch();
      }}
      options={{
        'Under Review': {
          color: '#FFA800',
          backgroundColor: '#FFF8EA',
          name: intl.formatMessage({ id: 'DRIVER.STATUS.UNDER_REVIEW' })
        },
        Active: {
          color: '#50CD89',
          backgroundColor: '#EEFAF4',
          name: intl.formatMessage({ id: 'DRIVER.STATUS.ACTIVE' })
        }
      }}
    />
  );
};

interface DriverListProps {
  refetch: () => void;
}

const DriverList: React.FC<DriverListProps> = ({ refetch }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const dialogs = useDialogs();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columns = useMemo<ColumnDef<DriverDetails>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.FULL_NAME' }),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center me-3">
              {row.original.driver.name[0]}
            </div>
            <div>
              <div className="font-bold">{row.original.driver.name}</div>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'dateOfBirth',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.BIRTH_DATE' }),
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.dateOfBirth}</div>
      },
      {
        accessorKey: 'nationality',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.NATIONALITY' }),
        enableSorting: true,
        cell: ({ row }) => (
          <span className={'px-3 py-1 rounded-full bg-blue-100 text-blue-800'}>
            {row.original.nationality}
          </span>
        )
      },
      {
        accessorKey: 'idNumber',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.ID_NUMBER' }),
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.idNumber}</div>
      },
      {
        accessorKey: 'licenseSerialNumber',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.LICENSE_NUMBER' }),
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.licenseNumber}</div>
      },
      {
        accessorKey: 'licenseExpiryDate',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.LICENSE_EXPIRY' }),
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.licenseExpiry}</div>
      },
      {
        accessorKey: 'vehiclePlate',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.VEHICLE' }),
        enableSorting: true,
        cell: ({ row }) => <CarView vehicle={row.original.vehicle} />
      },
      {
        accessorKey: 'status',
        header: intl.formatMessage({ id: 'DRIVER.LIST.COLUMN.STATUS' }),
        enableSorting: true,
        cell: (info) => <DriverListDropdown refetch={refetch} {...info} />
      },
      {
        id: 'actions',
        header: intl.formatMessage({ id: 'COMMON.ACTIONS' }),
        cell: ({ row }) => (
          <div className="flex gap-3">
            <a href={`/drivers/driver/${row.original.id}`} className="size-7.5">
              <img
                src={toAbsoluteUrl('/media/icons/view.svg')}
                alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
              />
            </a>
            <a href={`/drivers/edit/${row.original.id}`} className="size-7.5">
              <img
                src={toAbsoluteUrl('/media/icons/edit.svg')}
                alt={intl.formatMessage({ id: 'COMMON.EDIT' })}
              />
            </a>
            <Menu>
              <MenuItem toggle="dropdown" trigger="click">
                <MenuToggle>
                  <KeenIcon className="text-xl" icon="dots-vertical" />
                </MenuToggle>
                <MenuSub className="menu-default">
                  <MenuItem
                    onClick={async () => {
                      if (
                        !(await dialogs.confirm(
                          intl.formatMessage({
                            id: 'DRIVER.DELETE.MODAL_MESSAGE'
                          }),
                          {
                            title: intl.formatMessage({ id: 'DRIVER.DELETE.MODAL_TITLE' }),
                            okText: intl.formatMessage({ id: 'COMMON.DELETE' }),
                            cancelText: intl.formatMessage({ id: 'COMMON.CANCEL' })
                          }
                        ))
                      )
                        return;
                      await deleteDriver(row.original.id);
                      enqueueSnackbar(intl.formatMessage({ id: 'DRIVER.DELETE_SUCCESS' }), {
                        variant: 'success'
                      });
                      refetch();
                    }}
                  >
                    <MenuLink>
                      <MenuIcon>
                        <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                      </MenuIcon>
                      <MenuTitle>
                        <FormattedMessage id="COMMON.DELETE" />
                      </MenuTitle>
                    </MenuLink>
                  </MenuItem>
                </MenuSub>
              </MenuItem>
            </Menu>
          </div>
        )
      }
    ],
    [intl, refetch, dialogs, enqueueSnackbar]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6 ">
        <h2 className="text-xl font-semibold text-gray-800">
          <FormattedMessage id="DRIVER.LIST.TITLE" />
        </h2>
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
            placeholder={intl.formatMessage({ id: 'COMMON.SEARCH' })}
            onDebounce={setSearchQuery}
          />
        </div>
      </div>
      <div className="driver-table">
        <DataGrid
          columns={columns}
          data={[]}
          serverSide={true}
          onFetchData={getDrivers}
          filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
        />
      </div>
    </div>
  );
};

export { DriverList };
