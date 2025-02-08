import { DataGrid, useDataGrid } from '@/components';
import { getViolations, updateViolationStatus, Violation } from '@/api/cars';
import { useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { CarView } from '../CarView';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '../StatusDropdown';
import { MaintenanceViolationTableProps } from './MaintenanceViolation';

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
        unpaid: {
          color: '#F1416C',
          backgroundColor: '#FFF5F8',
          name: 'Unpaid'
        },
        under_review: {
          color: '#FFA800',
          backgroundColor: '#FFF8EA',
          name: 'Under Review'
        },
        recorded: {
          color: '#00A3FF',
          backgroundColor: '#EEF9FF',
          name: 'Recorded'
        },
        paid: {
          color: '#50CD89',
          backgroundColor: '#EEFAF4',
          name: 'Paid'
        }
      }}
    />
  );
};

interface ViolationTableProps extends MaintenanceViolationTableProps {
  searchQuery: string;
}

const ViolationTable = ({ searchQuery, id }: ViolationTableProps) => {
  const columns = useMemo<ColumnDef<Violation>[]>(
    () => [
      {
        accessorFn: (row) => row.user,
        id: 'driver',
        header: () => 'Driver',
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
        cell: (info) =>
          info.row.original.vehicle && <CarView vehicle={info.row.original.vehicle} />,
        meta: {
          className: ''
        }
      },
      {
        accessorFn: (row) => row.date,
        id: 'startDate',
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
        id: 'amount',
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
      onFetchData={getViolations}
      pagination={{ sizes: [], size: 4 }}
    />
  );
};

export { ViolationTable };
