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
import { Download, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useExportLoading } from '../context/ExportLoadingContext';

const PAGE_LIMIT = 100;
const REPORT_ID = 'alarm';

export default function AlarmReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { isExporting, startExporting, stopExporting, exportingReportId } = useExportLoading();

  const isThisReportExporting = isExporting && exportingReportId === REPORT_ID;
  const isOtherReportExporting = isExporting && exportingReportId !== REPORT_ID;

  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'createdAt,desc'
  });

  const handleExport = async () => {
    if (isExporting) return;

    try {
      startExporting(REPORT_ID);
      const response = await exportAlarmReport({
        vehicleId: filters.vehicleId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        alarmCode: filters.type,
        pageIndex: 0,
        pageSize: PAGE_LIMIT,
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
    } finally {
      stopExporting();
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
            className={clsx(
              'flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg border',
              isThisReportExporting || isOtherReportExporting
                ? 'opacity-60 cursor-not-allowed bg-gray-100'
                : 'hover:bg-gray-50'
            )}
            onClick={handleExport}
            type="button"
            disabled={isThisReportExporting || isOtherReportExporting}
            title={isOtherReportExporting ? 'Another report is being exported' : ''}
          >
            {isThisReportExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
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
