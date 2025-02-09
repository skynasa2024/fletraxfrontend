import { DataGrid, useDataGrid } from '@/components';
import {
  getMaintenance,
  IMaintenanceTableData,
  updateMaintenanceStatus
} from '@/api/maintenance.ts';
import { useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { CarView } from '../CarView';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '../StatusDropdown';
import { MaintenanceViolationTableProps } from './MaintenanceViolation';
import { Link } from 'react-router';

const MaintenanceStatusDropdown = (info: CellContext<IMaintenanceTableData, unknown>) => {
  const reload = useDataGrid().fetchServerSideData;
  return (
    <StatusDropdown
      selected={info.row.original.status}
      setSelected={async (value) => {
        await updateMaintenanceStatus(info.row.original.id, value);
        reload();
      }}
      options={{
        ongoing: {
          color: '#FFA800',
          backgroundColor: '#FFF8EA',
          name: 'In Maintenance'
        },
        finished: {
          color: '#50CD89',
          backgroundColor: '#EEFAF4',
          name: 'Completed'
        }
      }}
    />
  );
};

interface ViolationTableProps extends MaintenanceViolationTableProps {
  searchQuery: string;
}

const MaintenanceTable = ({ searchQuery, id }: ViolationTableProps) => {
  const columns = useMemo<ColumnDef<IMaintenanceTableData>[]>(
    () => [
      {
        accessorFn: (row) => row.startDate,
        id: 'startDate',
        header: () => 'Date',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">
            {format('MMM d, yyyy', info.row.original.startDate)}
          </span>
        ),
        meta: {
          className: ''
        }
      },
      {
        accessorFn: (row) => row.vehicleId,
        id: 'vehicle',
        header: () => 'Car',
        cell: (info) =>
          info.row.original.vehicleId && (
            <CarView
              vehicle={{
                id: info.row.original.vehicleId,
                name: info.row.original.vehicleName,
                plate: info.row.original.vehiclePlate,
                imei: '',
                brandImage: ''
              }}
            />
          ),
        meta: {
          className: ''
        }
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: () => 'Type',
        enableSorting: true,
        cell: (info) => <span className="text-gray-800 font-bold">{info.row.original.type}</span>,
        meta: {
          className: ''
        }
      },
      {
        accessorFn: (row) => row.supplier,
        id: 'supplier',
        header: () => 'Supplier',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">{info.row.original.supplier}</span>
        ),
        meta: {
          className: ''
        }
      },
      {
        accessorFn: (row) => row.amount,
        id: 'amount',
        header: () => 'Price',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'TRY'
            }).format(info.row.original.amount)}
          </span>
        )
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        enableSorting: true,
        cell: (info) => <MaintenanceStatusDropdown {...info} />,
        meta: {
          className: 'min-w-44'
        }
      },
      {
        id: 'actions',
        header: () => 'Actions',
        cell: (info) => (
          <div className="flex gap-3">
            <Link to={`/maintenance/view/${info.row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </Link>
            <Link to={`/maintenance/edit/${info.row.original.id}`} className="size-7.5">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
            </Link>
          </div>
        ),
        meta: {
          className: ''
        }
      }
    ],
    []
  );

  return (
    <DataGrid
      columns={columns}
      filters={[
        ...(searchQuery.trim().length > 2
          ? [
              {
                id: '__any',
                value: searchQuery
              }
            ]
          : []),
        ...(id ? [{ id: 'vehicleId', value: id }] : [])
      ]}
      serverSide={true}
      onFetchData={getMaintenance}
      pagination={{ sizes: [], size: 4 }}
    />
  );
};

export { MaintenanceTable };
