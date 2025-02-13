import React, { useMemo } from 'react';
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
import { useSnackbar } from 'notistack';

const DriverListDropdown = (
  info: CellContext<DriverDetails, unknown> & { refetch: () => void }
) => {
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
          backgroundColor: '#FFF8EA'
        },
        Active: {
          color: '#50CD89',
          backgroundColor: '#EEFAF4'
        }
      }}
    />
  );
};

interface DriverListProps {
  refetch: () => void;
  searchQuery: string;
}

const DriversGridView: React.FC<DriverListProps> = ({ refetch, searchQuery }) => {
  const { enqueueSnackbar } = useSnackbar();
  const columns = useMemo<ColumnDef<DriverDetails>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Full Name',
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
        header: 'Birth Date',
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.dateOfBirth}</div>
      },
      {
        accessorKey: 'nationality',
        header: 'Nationality',
        enableSorting: true,
        cell: ({ row }) => (
          <span className={'px-3 py-1 rounded-full bg-blue-100 text-blue-800'}>
            {row.original.nationality}
          </span>
        )
      },
      {
        accessorKey: 'idNumber',
        header: 'ID Number',
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.idNumber}</div>
      },
      {
        accessorKey: 'licenseSerialNumber',
        header: 'License Number',
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.licenseNumber}</div>
      },
      {
        accessorKey: 'licenseExpiryDate',
        header: 'License Expiry',
        enableSorting: true,
        cell: ({ row }) => <div>{row.original.licenseExpiry}</div>
      },
      {
        accessorKey: 'vehiclePlate',
        header: 'Vehicle',
        enableSorting: true,
        cell: ({ row }) => <CarView vehicle={row.original.vehicle} />
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: (info) => <DriverListDropdown refetch={refetch} {...info} />
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-3">
            <a href={`/drivers/driver/${row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </a>
            <a href={`/drivers/edit/${row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
            </a>
            <Menu>
              <MenuItem toggle="dropdown" trigger="click">
                <MenuToggle>
                  <KeenIcon className="text-xl" icon="dots-vertical" />
                </MenuToggle>
                <MenuSub className="menu-default">
                  <MenuItem
                    onClick={async () => {
                      await deleteDriver(row.original.id);
                      enqueueSnackbar('Driver deleted successfully', {
                        variant: 'success'
                      });
                      refetch();
                    }}
                  >
                    <MenuLink>
                      <MenuIcon>
                        <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                      </MenuIcon>
                      <MenuTitle>Delete</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                </MenuSub>
              </MenuItem>
            </Menu>
          </div>
        )
      }
    ],
    [enqueueSnackbar, refetch]
  );

  return (
    <div className="driver-table">
      <DataGrid
        columns={columns}
        data={[]}
        serverSide={true}
        onFetchData={getDrivers}
        filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
      />
    </div>
  );
};

export { DriversGridView };
