import { AlarmReportParams, getAlarmReport, IAlarmReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useReportFilters } from '@/hooks/useReportFilters';
import { toAbsoluteUrl } from '@/utils';

export default function AlarmReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();

  const columns = useMemo<ColumnDef<IAlarmReport>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' })
      },
      {
        accessorKey: 'plate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        cell: ({ row }) => <CarPlate plate={row.original.plate} />
      },
      {
        accessorKey: 'date',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DATE' }),
        enableSorting: true
      },
      {
        accessorKey: 'type',
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
      vehicleId: formData.get('vehicleId')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || ''
    });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-[77%]">
          <div className="grid grid-cols-4 gap-4 grow">
            <VehicleSearch place="bottom" />
            <select name="type" className="select"></select>
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
          onFetchData={async (params) => {
            const queryParams: AlarmReportParams = {
              ...params,
              ...filters
            };
            return await getAlarmReport(queryParams);
          }}
          filters={getDataGridFilters()}
        />
      </div>
    </>
  );
}
