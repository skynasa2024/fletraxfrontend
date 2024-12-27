import { DataGrid } from '@/components';
import { getMaintenance, Maintenance, Vehicle } from '@/api/cars';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '../StatusDropdown';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';

interface ViolationTableProps {
  searchQuery: string;
}

const MaintenanceTable = ({ searchQuery }: ViolationTableProps) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Maintenance>[]>(
    () => [
      {
        accessorKey: 'orderNumber',
        id: 'orderNumber',
        header: () => 'Order Number',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {faker.number.int({ min: 525144, max: 525147 })}
          </span>
        ),
        meta: {
          className: 'min-w-32'
        }
      },
      {
        accessorFn: (row) => row.date,
        id: 'date',
        header: () => 'Date',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {format('MMM d, yyyy', info.row.original.date)}
          </span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.vehicle,
        id: 'car',
        header: () => 'Car',
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <img 
              src={info.row.original.vehicle?.brandImage || ''} 
              alt="Car logo"
              className="w-6 h-6"
            />
            <div className="flex flex-col">
              <span className="text-gray-800">GL76BR</span>
              <span className="text-gray-400 text-sm">Reno Volvo</span>
            </div>
          </div>
        ),
        meta: {
          className: 'min-w-40'
        }
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: () => 'Type',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {info.row.original.type}
          </span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.supplier,
        id: 'supplier',
        header: () => 'Supplier',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {info.row.original.supplier}
          </span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.price,
        id: 'price',
        header: () => 'Price',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(info.row.original.price)}
          </span>
        ),
        meta: {
          className: 'min-w-24'
        }
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'STATUS',
        enableSorting: false,
        cell: (info) => (
          <StatusDropdown
            selected={info.row.original.status}
            setSelected={() => {}}
            options={{
              'In Maintenance': {
                color: '#FFA800',
                backgroundColor: '#FFF8EA'
              },
              Completed: {
                color: '#50CD89',
                backgroundColor: '#EEFAF4'
              }
            }}
          />
        ),
        meta: {
          className: 'min-w-44'
        }
      },
      {
        id: 'actions',
        header: () => 'Action',
        cell: (info) => (
          <div className="flex gap-3">
            <button onClick={() => navigate('/maintenance/maintenance/view-maintenance')}>
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </button>
            <button>
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
            </button>
            <button>
              <img src={toAbsoluteUrl('/media/icons/more.svg')} alt="More" />
            </button>
          </div>
        ),
        meta: {
          className: 'min-w-24'
        }
      }
    ],
    []
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance List</h2>
      </div>

      <DataGrid
        columns={columns}
        filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
        serverSide={true}
        onFetchData={getMaintenance}
        pagination={{ sizes: [], size: 4 }}
      />
    </div>
  );
};

export { MaintenanceTable };