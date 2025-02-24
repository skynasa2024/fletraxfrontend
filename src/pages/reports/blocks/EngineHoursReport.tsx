import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { CircularProgress } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

interface EngineHoursData {
  id: string;
  plate: string;
  date: string;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
}

interface SearchParams {
  vehicleId: string;
  startDate: string;
  endDate: string;
}

export default function EngineHoursReport() {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EngineHoursData[]>([]);

  const columns = useMemo<ColumnDef<EngineHoursData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'plate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        enableSorting: true,
        cell: ({ row }) => <CarPlate />
      },
      {
        accessorKey: 'date',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DATE' }),
        enableSorting: true
      },
      {
        accessorKey: 'daily',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.Daily' }),
        enableSorting: true
      },
      {
        accessorKey: 'weekly',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.WEEKLY' }),
        enableSorting: true
      },
      {
        accessorKey: 'monthly',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MONTHLY' }),
        enableSorting: true
      },
      {
        accessorKey: 'yearly',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.YEARLY' }),
        enableSorting: true
      },
      {
        accessorKey: 'total',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.TOTAL' }),
        enableSorting: true
      },
      {
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.ACTION' })
      }
    ],
    [intl]
  );

  const handleSearch = async (formData: FormData) => {
    const searchData: SearchParams = {
      vehicleId: formData.get('vehicleId') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string
    };

    console.log(searchData);

    try {
      setIsLoading(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(new FormData(e.currentTarget));
        }}
      >
        <div className="flex gap-4 items-center justify-between p-4 w-[60%]">
          <div className="grid grid-cols-3 gap-4 grow">
            <VehicleSearch place="bottom" />
            <input
              type="date"
              name="startDate"
              className="input"
              placeholder="Start Date"
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="date"
              name="endDate"
              className="input"
              placeholder="End Date"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button
            type="submit"
            className="btn btn-info w-28 items-center justify-center"
            disabled={isLoading}
          >
            <span>{intl.formatMessage({ id: 'COMMON.SEARCH' })}</span>
            {isLoading && <CircularProgress size={14} color="inherit" />}
          </button>
        </div>
      </form>
      <div className="[&_table>thead>tr>th]:border-[#F1F1F4] [&_table>thead>tr>th]:border [&_table>thead>tr>th]:bg-[#FCFCFC] [&_table>thead>tr>th]:!rounded-t-none [&_table>thead>tr>td]:border [&_table>thead>tr>td]:border-[#F1F1F4]">
        <DataGrid rowSelect columns={columns} data={data} serverSide={true} />
      </div>
    </>
  );
}
