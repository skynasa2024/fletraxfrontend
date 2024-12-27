import React, { useMemo } from 'react';
import { DataGrid } from '@/components';
import { getDrivers, Driver } from '@/api/drivers';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CarView } from '../../../../../pages/dashboards/dashboard/blocks/CarView';
import { StatusDropdown } from './maintenance/StatusDropdown';
import { toAbsoluteUrl } from '@/utils';
import { useNavigate } from 'react-router';
import { Download, Filter, Search } from 'lucide-react';
interface DriverListProps {
  searchQuery?: string;
}

const DriverList: React.FC<DriverListProps> = ({ searchQuery = '' }) => {
  const columns = useMemo<ColumnDef<Driver>[]>(
    () => [
      {
        accessorKey: 'owner',
        header: 'Owner',
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
              {row.original.owner.charAt(0)}
            </div>
            <div>
              <div className="font-bold">{row.original.owner}</div>
            </div>
          </div>
        )
      },
      {
        accessorFn: (row) => row.vehicle,
        id: 'vehicle',
        header: () => 'Car',
        cell: (info) => <CarView vehicle={info.row.original.vehicle} />,
        meta: {
          className: 'min-w-60'
        }
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
        accessorKey: 'date',
        header: 'Date',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-800">{format(row.original.date, 'MMM d, yyyy')}</span>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <div className="flex gap-3">
            <a href="#" onClick={handleViewDriverClick}>
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

  const navigate = useNavigate();
  const handleViewDriverClick = () => {
    navigate('view-driver');
  };

  return (
    <div className="card">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Drivers List</h2>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg border">
            <Filter size={16} />
            <span>Filters</span>
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-100 rounded-full">
              2
            </span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border">
            <Download size={16} />
            <span>Export</span>
          </button>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="search"
              className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
            />
          </div>
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
