import { exportAlarmReport, getAlarmReport, IAlarmReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { downloadFile, toAbsoluteUrl } from '@/utils';
import { NotificationTypeSelect } from '../components/NotificationTypeSelect';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';
import { enqueueSnackbar } from 'notistack';
import { Download } from 'lucide-react';

export default function AlarmReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'createdAt,desc'
  });

  const handleExport = async () => {
    try {
      const response = await exportAlarmReport({
        vehicleId: filters.vehicleId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        alarmCode: filters.type,
        pageIndex: 0,
        pageSize: 100,
        sort: 'date,desc'
      });
      downloadFile(response);

      enqueueSnackbar(
        intl.formatMessage(
          { id: 'COMMON.EXPORT_SUCCESS' },
          { defaultMessage: 'Export successful' }
        ),
        {
          variant: 'success'
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar(
        intl.formatMessage(
          { id: 'COMMON.EXPORT_ERROR' },
          { defaultMessage: 'Failed to export devices' }
        ),
        {
          variant: 'error'
        }
      );
    }
  };

  const columns = useMemo<ColumnDef<IAlarmReport>[]>(
    () => [
      {
        accessorKey: 'deviceIdent',
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
        accessorKey: 'createdAt',
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
      endDate: formData.get('endDate')?.toString() || '',
      type: formData.get('alarmCode')?.toString() || ''
    });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-[90.5%]">
          <div className="grid grid-cols-4 gap-4 grow">
            <VehicleSearch place="bottom" />
            <NotificationTypeSelect />
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
          <button
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
            onClick={handleExport}
            type="button"
          >
            <Download size={16} />
            <span>
              <FormattedMessage id="COMMON.EXPORT" />
            </span>
          </button>
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
          onFetchData={
            filters.vehicleId
              ? (params) =>
                  handleFetchWithSort(
                    params,
                    {
                      ...filters,
                      alarmCode: filters.type
                    },
                    getAlarmReport
                  )
              : undefined
          }
          filters={getDataGridFilters()}
          pagination={{
            size: 100,
            sizes: undefined
          }}
          messages={{
            empty: !filters.ident ? intl.formatMessage({ id: 'COMMON.SELECT_VEHICLE' }) : undefined
          }}
        />
      </div>
    </>
  );
}
