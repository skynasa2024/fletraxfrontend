import { getMaxSpeedReport, IMaxSpeedReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { toAbsoluteUrl } from '@/utils';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';

export default function MaxSpeedReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'ident,desc'
  });

  const columns = useMemo<ColumnDef<IMaxSpeedReport>[]>(
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
        accessorKey: 'timestamp',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.START_DATE' }),
        enableSorting: true
      },
      {
        accessorKey: 'ignitionStatus',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DURATION' }),
        cell: ({ row }) => {
          const status = row.original.ignitionStatus ? 'On' : 'Off';
          return <span>{status}</span>;
        }
      },
      {
        accessorKey: 'positionSpeed',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MAX_SPEED' })
      },
      {
        accessorKey: 'positionLatitude',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.MILEAGE' })
      },
      {
        accessorKey: 'positionLongitude',
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
    [intl]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateFilters({
      ident: formData.get('ident')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || '',
      type: formData.get('intervalType')?.toString() || '',
      startTime: formData.get('startTime')?.toString() || '',
      endTime: formData.get('endTime')?.toString() || ''
    });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-full">
          <div className="grid grid-cols-5 gap-4 grow">
            <div className="relative">
              <VehicleSearch place="bottom" />
            </div>
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
            <input
              type="time"
              name="startTime"
              className="input"
              placeholder="Start Time"
              defaultValue={filters.startTime}
            />
            <input
              type="time"
              name="endTime"
              className="input"
              placeholder="End Time"
              defaultValue={filters.endTime}
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
              getMaxSpeedReport
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
