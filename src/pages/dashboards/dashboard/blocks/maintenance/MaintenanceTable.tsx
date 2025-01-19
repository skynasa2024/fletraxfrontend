import { DataGrid, useDataGrid } from '@/components';
import { getMaintenance, Maintenance, updateMaintenanceStatus } from '@/api/cars';
import { useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { CarView } from '../CarView';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '../StatusDropdown';

const MaintenanceStatusDropdown = (info: CellContext<Maintenance, unknown>) => {
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

interface ViolationTableProps {
  searchQuery: string;
}

const MaintenanceTable = ({ searchQuery }: ViolationTableProps) => {
  const columns = useMemo<ColumnDef<Maintenance>[]>(
    () => [
      {
        accessorFn: (row) => row.date,
        id: 'date',
        header: () => 'Date',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">
            {format('MMM d, yyyy', info.row.original.date)}
          </span>
        ),
        meta: {
          className: ''
        }
      },
      {
        accessorFn: (row) => row.vehicle,
        id: 'vehicle',
        header: () => 'Car',
        enableSorting: true,
        cell: (info) =>
          info.row.original.vehicle && <CarView vehicle={info.row.original.vehicle} />,
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
        accessorFn: (row) => row.price,
        id: 'price',
        header: () => 'Price',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'TRY'
            }).format(info.row.original.price)}
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
        cell: (
          info // TODO: Add links
        ) => (
          <div className="flex gap-3">
            <a href="#">
              <img src={toAbsoluteUrl('/media/icons/view.svg')} />
            </a>
            <a href="#">
              <img src={toAbsoluteUrl('/media/icons/edit.svg')} />
            </a>
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
      filters={
        searchQuery.trim().length > 2
          ? [
              {
                id: '__any',
                value: searchQuery
              }
            ]
          : []
      }
      serverSide={true}
      onFetchData={getMaintenance}
      pagination={{ sizes: [], size: 4 }}
    />
  );
};

export { MaintenanceTable };
