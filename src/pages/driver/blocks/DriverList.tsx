import React, { useMemo } from 'react';
import { DataGrid } from '@/components';
import { getDrivers, DriverDetails } from '@/api/drivers';
import { ColumnDef } from '@tanstack/react-table';
import { StatusDropdown } from './maintenance/StatusDropdown';
import { toAbsoluteUrl } from '@/utils';
import { CarView } from '@/pages/vehicle/blocks/CarView';

interface DriverListProps {
  searchQuery?: string;
}

const DriverList: React.FC<DriverListProps> = ({ searchQuery = '' }) => {
  const columns = useMemo<ColumnDef<DriverDetails>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Full Name',
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
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
        cell: ({ row }) => <div>{row.original.dateOfBirth}</div>
      },
      {
        accessorKey: 'nationality',
        header: 'Nationality',
        cell: ({ row }) => (
          <span className={'px-3 py-1 rounded-full bg-blue-100 text-blue-800'}>
            {row.original.nationality}
          </span>
        )
      },
      {
        accessorKey: 'idNumber',
        header: 'ID Number',
        cell: ({ row }) => <div>{row.original.idNumber}</div>
      },
      {
        accessorKey: 'licenseNumber',
        header: 'License Number',
        cell: ({ row }) => <div>{row.original.licenseNumber}</div>
      },
      {
        accessorKey: 'licenseExpiry',
        header: 'License Expiry',
        cell: ({ row }) => <div>{row.original.licenseExpiry}</div>
      },
      {
        accessorKey: 'vehicle',
        header: 'Vehicle',
        cell: ({ row }) => <CarView vehicle={row.original.vehicle} />
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusDropdown
            selected={row.original.status}
            setSelected={() => {}}
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
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <div className="flex gap-3">
            <a href="#">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </a>
            <a href="#">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
            </a>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6 ">
        <h2 className="text-xl font-semibold text-gray-800">Drivers List</h2>
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
