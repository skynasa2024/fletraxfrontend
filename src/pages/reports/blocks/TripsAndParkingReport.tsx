import { getTripsAndParkingReport, ITripsAndParkingReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { toAbsoluteUrl } from '@/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { IntervalType } from '@/api/trips';
import { useAuthContext } from '@/auth';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';

const IntervalTypeOptions = [
  { label: 'Trip', value: IntervalType.Trip },
  { label: 'Parking', value: IntervalType.Parking }
];

export default function TripsAndParkingReport() {
  const intl = useIntl();
  const { currentUser } = useAuthContext();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'startTime,desc'
  });

  const columns = useMemo<ColumnDef<ITripsAndParkingReport>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'plate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        enableSorting: true,
        cell: ({ row }) => <CarPlate plate={row.original.plate} />
      },
      {
        accessorKey: 'startTime',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.START_DATE' }),
        enableSorting: true,
        cell: ({ getValue }) => new Date(getValue<number>() * 1000).toLocaleString()
      },
      {
        accessorKey: 'endTime',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.END_DATE' }),
        cell: ({ row }) =>
          formatInTimeZone(
            new Date(+row.original.endTime * 1000),
            currentUser!.timezone,
            'yyyy/MM/dd HH:mm:ss'
          )
      },
      {
        accessorKey: 'totalDuration',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DURATION' })
      },
      {
        accessorKey: 'maxSpeed',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MAX_SPEED' })
      },
      {
        accessorKey: 'totalDistance',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MILEAGE' })
      },
      {
        accessorKey: 'intervalType',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.TYPE' })
      },
      {
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.ACTION' }),
        cell: () => (
          <button
            className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
            title={intl.formatMessage({ id: 'VEHICLE.GRID.ACTION.VIEW' })}
          >
            <img
              src={toAbsoluteUrl('/media/icons/view-light.svg')}
              alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
            />
          </button>
        )
      }
    ],
    [intl, currentUser]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilters({
      vehicleId: formData.get('vehicleId')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || '',
      type: formData.get('intervalType')?.toString() || ''
    });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-[90.5%]">
          <div className="grid grid-cols-4 gap-4 grow">
            <VehicleSearch place="bottom" />
            <select name="intervalType" className="select" defaultValue={filters.type}>
              <option key="ALL" value="">
                All
              </option>
              {IntervalTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          onFetchData={(params) =>
            handleFetchWithSort(
              params,
              {
                ...filters,
                intervalType: filters.type
              },
              getTripsAndParkingReport
            )
          }
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
