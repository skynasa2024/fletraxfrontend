import { DataGrid, KeenIcon } from '@/components';
import { getMaintenance, IMaintenanceTableData } from '@/api/maintenance.ts';
import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField.tsx';
import { useSettings } from '@/providers';
import { MaintenanceStatusDropdown } from './MaintenanceStatusDropdown.tsx';

const MaintenanceList = (props: { fetchStats: () => void }) => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const columns = useMemo<ColumnDef<IMaintenanceTableData>[]>(
    () => [
      {
        accessorFn: (row) => row.vehicleBrand,
        id: 'vehicleBrand',
        header: () => 'Car',
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <img
              src={info.row.original.vehicleImage}
              alt="Car logo"
              className="w-6 h-6"
            />
            <div className="flex flex-col">
              <span className="text-gray-800">{Number(info.row.original.vehiclePlate) || 0}</span>
              <span className="text-gray-400 text-sm">{info.row.original.vehicleName}</span>
            </div>
          </div>
        ),
        meta: {
          className: 'min-w-40'
        }
      },
      {
        accessorFn: (row) => row.userId,
        id: 'userId',
        header: () => 'User',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {info.row.original.user?.name}
          </span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: () => 'Maintenance Type',
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
        accessorFn: (row) => row.amount,
        id: 'amount',
        header: () => 'Price',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(info.row.original.amount)}
          </span>
        ),
        meta: {
          className: 'min-w-24'
        }
      },
      {
        id: 'startDate',
        accessorKey: 'startDate',
        header: 'Date',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span>Start: {format(row.original.startDate.toDateString(), 'yyyy-MM-dd')}</span>
            <span>End: {format(row.original.endDate.toDateString(), 'yyyy-MM-dd')}</span>
          </div>
        )
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        enableSorting: true,
        cell: (info) => <MaintenanceStatusDropdown refetch={props?.fetchStats} {...info} />,
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
    [navigate, props?.fetchStats]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance List</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className={`w-64 pl-10 pr-4 py-2 ${settings.themeMode == 'dark' ? 'bg-gray-950' : 'bg-gray-200'} text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info`}
            placeholder="Search"
            onDebounce={setSearchQuery}
          />
        </div>
      </div>

      <DataGrid
        data={[]}
        columns={columns}
        serverSide={true}
        onFetchData={getMaintenance}
        filters={[
          ...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : [])
        ]}
      />
    </div>
  );
};

export { MaintenanceList };