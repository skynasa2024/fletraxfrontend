import { getStatisticsReport, MileageStatisticsReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useReportTable } from '@/hooks/useReportTable';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router';

export default function MileageReport() {
  const intl = useIntl();

  const columns = useMemo<ColumnDef<MileageStatisticsReport>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'vehiclePlate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        enableSorting: true,
        cell: ({ row }) => <CarPlate plate={row.original.vehiclePlate} />
      },
      {
        accessorKey: 'date',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DATE' }),
        enableSorting: true
      },
      {
        accessorKey: 'dailyExistingKilometers',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.Daily' })
      },
      {
        accessorKey: 'weeklyExistingKilometers',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.WEEKLY' })
      },
      {
        accessorKey: 'monthlyExistingKilometers',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MONTHLY' })
      },
      {
        accessorKey: 'yearlyExistingKilometers',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.YEARLY' })
      },
      {
        accessorKey: 'totalExistingKilometers',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.TOTAL' })
      },
      {
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.ACTION' }),
        cell: () => (
          <Link
            to={''}
            className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
            title={intl.formatMessage({ id: 'VEHICLE.GRID.ACTION.VIEW' })}
          >
            <img
              src={toAbsoluteUrl('/media/icons/view-light.svg')}
              alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
            />
          </Link>
        )
      }
    ],
    [intl]
  );

  const { handleSearch, handleFetchData, filters, getDataGridFilters } = useReportTable({
    columns,
    defaultSort: 'date,desc',
    type: 'Mileage',
    fetchData: getStatisticsReport
  });

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-[70%]">
          <div className="grid grid-cols-3 gap-4 grow">
            <VehicleSearch place="bottom" />
            <input
              type="date"
              name="startDate"
              className="input"
              placeholder="Start Date"
              max={new Date().toISOString().split('T')[0]}
              defaultValue={filters.startDate}
            />
            <input
              type="date"
              name="endDate"
              className="input"
              placeholder="End Date"
              max={new Date().toISOString().split('T')[0]}
              defaultValue={filters.endDate}
            />
          </div>
          <button type="submit" className="btn btn-info w-28 items-center justify-center">
            <span>{intl.formatMessage({ id: 'COMMON.SEARCH' })}</span>
          </button>
        </div>
      </form>
      <div className="report-table-container">
        <DataGrid
          rowSelect
          columns={columns}
          serverSide
          onFetchData={handleFetchData}
          filters={getDataGridFilters()}
          pagination={{
            size: 100,
            sizes: undefined
          }}
        />
      </div>
    </>
  );
}
