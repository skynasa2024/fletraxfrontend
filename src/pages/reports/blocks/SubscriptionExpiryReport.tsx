import {
  exportSubscriptionExpiryReport,
  getSubscriptionExpiryReport,
  ISubscriptionExpiryReport
} from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { downloadFile, toAbsoluteUrl } from '@/utils';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';
import { enqueueSnackbar } from 'notistack';
import { Download } from 'lucide-react';
import { SubscriptionExpiryPeriodSelect } from '../components/SubscriptionExpiryPeriodSelect';

export default function SubscriptionExpirtyReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'createdAt,desc'
  });

  const calculateDaysLeft = (endDateStr: string): number => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const endDate = new Date(endDateStr);
    const differenceMs = endDate.getTime() - currentDate.getTime();
    return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  };

  const handleExport = async () => {
    try {
      const response = await exportSubscriptionExpiryReport({
        pageIndex: 0,
        pageSize: 100
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

  const columns = useMemo<ColumnDef<ISubscriptionExpiryReport>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.IDENTIFY_NUMBER' }),
        enableSorting: true
      },
      {
        accessorKey: 'plate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PLATE' }),
        cell: ({ row }) => <CarPlate plate={row.original.plate} />
      },
      {
        accessorKey: 'phone',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PHONE_NUMBER' })
      },
      {
        accessorKey: 'startDate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.START_DATE' })
      },
      {
        accessorKey: 'endDate',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.END_DATE' })
      },
      {
        id: 'daysLeft',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.DAYS_LEFT' }),
        cell: ({ row }) => {
          const daysLeft = calculateDaysLeft(row.original.endDate);
          const isExpired = daysLeft < 0;

          return (
            <span className={`font-medium ${isExpired ? 'text-danger' : 'text-success'}`}>
              {intl.formatMessage(
                { id: 'REPORTS.DAYS_LEFT_INFO' },
                { days: daysLeft }
              )}
            </span>
          );
        },
        enableSorting: true
      },
      {
        accessorKey: 'protocol',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.PROTOCOL' })
      },
      {
        accessorKey: 'type',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.TYPE' })
      },
      {
        accessorKey: 'user',
        header: intl.formatMessage({ id: 'REPORTS.COLUMN.USER' }),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            {row.original.user?.name && (
              <span className="text-nowrap">Name: {row.original.user?.name}</span>
            )}
            {row.original.user?.phone && (
              <span className="text-nowrap">Phone: {row.original.user?.phone}</span>
            )}
          </div>
        )
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
      period: formData.get('period')?.toString() || ''
    });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex gap-4 items-center justify-between p-4 w-3/5">
          <div className="grid grid-cols-2 gap-4 grow">
            <VehicleSearch place="bottom" />
            <SubscriptionExpiryPeriodSelect />
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
          columns={columns}
          serverSide
          onFetchData={(params) =>
            handleFetchWithSort(
              params,
              {
                ...filters
              },
              getSubscriptionExpiryReport
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
