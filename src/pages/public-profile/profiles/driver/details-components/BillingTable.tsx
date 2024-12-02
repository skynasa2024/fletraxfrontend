import { DataGrid } from '@/components';
import { getBillingHistory, Billing } from '@/api/billing';
import { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/fp';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from './StatusDropdown';

interface BillingTableProps {
  searchQuery: string;
}

const BillingTable = ({ searchQuery }: BillingTableProps) => {
  const [data, setData] = useState<Billing[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getBillingHistory(searchQuery);
      setData(fetchedData);
    };

    fetchData();
  }, [searchQuery]);

  const columns = useMemo<ColumnDef<Billing>[]>(
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
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: () => 'Type',
        enableSorting: true,
        cell: (info) => <span className="text-gray-800 font-bold">{info.row.original.type}</span>,
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.description,
        id: 'description',
        header: () => 'Description',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">{info.row.original.description}</span>
        ),
        meta: {
          className: 'min-w-36'
        }
      },
      {
        accessorFn: (row) => row.amount,
        id: 'amount',
        header: () => 'Amount',
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-800 font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(info.row.original.amount)}
          </span>
        )
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        enableSorting: true,
        cell: (info) => (
          <StatusDropdown
            selected={info.row.original.status}
            setSelected={() => {}}
            options={{
              Unpaid: {
                color: '#FFA800',
                backgroundColor: '#FFF8EA'
              },
              Paid: {
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
        header: () => 'Actions',
        cell: (info) => (
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
          className: 'min-w-36'
        }
      }
    ],
    []
  );

  return (
    <DataGrid
      columns={columns}
      data={data} 
      
    />
  );
};

export { BillingTable };
