import { DataGrid } from '@/components';
import { getMaintenance, Maintenance, Vehicle } from '@/api/cars';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '../StatusDropdown';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { Search } from 'lucide-react';

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
              src={info.row.original.vehicle.brandImage} 
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
  function handleFetchData(params: any): Promise<any> {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="card">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance List</h2>
        
        <div className="flex items-center gap-4">
          {/* Search Input */}
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

          {/* Filters Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg border">
            <Filter size={16} />
            <span>Filters</span>
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-100 rounded-full">
              2
            </span>
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <DataGrid
        columns={columns}
        filters={searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []}
        serverSide={true}
        onFetchData={handleFetchData}
        pagination={{
          sizes: [10, 20, 30, 50],
          size: 10
        }}
        loading={isLoading}
      />
    </div>
  );
};

export { MaintenanceTable };