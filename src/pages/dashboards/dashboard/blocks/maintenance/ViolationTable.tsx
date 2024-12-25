import { DataGrid, useDataGrid } from '@/components';
import { getViolations, updateViolationStatus, Violation } from '@/api/cars';
import { useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { CarView } from '../CarView';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '../StatusDropdown';

const ViolationStatusDropdown = (info: CellContext<Violation, unknown>) => {
  const reload = useDataGrid().fetchServerSideData;
  return (
    <StatusDropdown
      selected={info.row.original.status}
      setSelected={async (value) => {
        await updateViolationStatus(info.row.original.id, value);
        reload();
      }}
      options={{
        Unpaid: {
          color: '#F1416C',
          backgroundColor: '#FFF5F8'
        },
        'Under Review': {
          color: '#FFA800',
          backgroundColor: '#FFF8EA'
        },
        Recorded: {
          color: '#00A3FF',
          backgroundColor: '#EEF9FF'
        },
        Paid: {
          color: '#50CD89',
          backgroundColor: '#EEFAF4'
        }
      }}
    />
  );
};

interface ViolationTableProps {
  searchQuery: string;
}

const ViolationTable = ({ searchQuery }: ViolationTableProps) => {
  const columns = useMemo<ColumnDef<Violation>[]>(
    () => [
      {
        accessorFn: (row) => row.user,
        id: 'driver',
        header: () => 'Driver',
        enableSorting: true,
        cell: (info) => (
          <div className="flex gap-2 items-center">
            <img
              src={
                info.row.original.user.avatar ||
                toAbsoluteUrl('/media/avatars/avatar-placeholder.png')
              }
              className="size-8 rounded-full aspect-square"
            />
            <span className="text-gray-800 font-bold">{info.row.original.user.name}</span>
          </div>
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
        cell: (info) => <CarView vehicle={info.row.original.vehicle} />,
        meta: {
          className: ''
        }
      },
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
        cell: (info) => <ViolationStatusDropdown {...info} />,
        meta: {
          className: 'min-w-40'
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
      onFetchData={getViolations}
      pagination={{ sizes: [], size: 4 }}
    />
  );
};

export { ViolationTable };
