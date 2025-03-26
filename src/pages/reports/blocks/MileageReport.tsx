import { getStatisticsReport, MileageStatisticsReport } from '@/api/reports';
import { DataGrid } from '@/components';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate';
import { VehicleSearch } from '@/pages/driver/add-driver/blocks/VehicleSearch';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router';
import { useReportFilters } from '@/hooks/useReportFilters';
import { useReportSorting } from '@/hooks/useReportSorting';
import clsx from 'clsx';

const PAGE_LIMIT = 100;

type GroupByOption = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

const groupByOptions: {
  label: React.ReactNode;
  value: GroupByOption;
}[] = [
  {
    label: <FormattedMessage id="REPORTS.COLUMN.Daily" />,
    value: 'Daily'
  },
  {
    label: <FormattedMessage id="REPORTS.COLUMN.WEEKLY" />,
    value: 'Weekly'
  },
  {
    label: <FormattedMessage id="REPORTS.COLUMN.MONTHLY" />,
    value: 'Monthly'
  },
  {
    label: <FormattedMessage id="REPORTS.COLUMN.YEARLY" />,
    value: 'Yearly'
  }
];

export default function MileageReport() {
  const intl = useIntl();
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();
  const [selectedGroup, setSelectedGroup] = React.useState<GroupByOption>('Daily');

  const { handleFetchWithSort } = useReportSorting({
    defaultSort: 'date,desc',
    reportType: 'Mileage'
  });

  const handleGroupByChange = (option: GroupByOption) => {
    setSelectedGroup(option);
  };

  const handleFilterDataByGroup = async (params: any) => {
    const res = await handleFetchWithSort(params, filters, getStatisticsReport);
    if (selectedGroup === 'Weekly') {
      return {
        ...res,
        data: res.data.filter((statistic: any) => {
          return new Date(statistic.date).getDay() === 0;
        })
      };
    }
    if (selectedGroup === 'Monthly') {
      return {
        ...res,
        data: res.data.filter((statistic: any) => {
          const date = new Date(statistic.date);
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          return nextDay.getMonth() !== date.getMonth();
        })
      };
    }
    if (selectedGroup === 'Yearly') {
      return {
        ...res,
        data: res.data.filter((statistic: any) => {
          const date = new Date(statistic.date);
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          return nextDay.getFullYear() !== date.getFullYear();
        })
      };
    }
    return res;
  };

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
      ...(selectedGroup === 'Daily'
        ? [
            {
              accessorKey: 'dailyExistingKilometers',
              header: intl.formatMessage({ id: 'REPORTS.COLUMN.Daily' })
            }
          ]
        : []),
      ...(selectedGroup === 'Weekly'
        ? [
            {
              accessorKey: 'weeklyExistingKilometers',
              header: intl.formatMessage({ id: 'REPORTS.COLUMN.WEEKLY' })
            }
          ]
        : []),
      ...(selectedGroup === 'Monthly'
        ? [
            {
              accessorKey: 'monthlyExistingKilometers',
              header: intl.formatMessage({ id: 'REPORTS.COLUMN.MONTHLY' })
            }
          ]
        : []),
      ...(selectedGroup === 'Yearly'
        ? [
            {
              accessorKey: 'yearlyExistingKilometers',
              header: intl.formatMessage({ id: 'REPORTS.COLUMN.YEARLY' })
            }
          ]
        : []),
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
    [intl, selectedGroup] // Added selectedGroup as dependency
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
      <div className="grid grid-cols-10 items-center justify-start gap-8 p-4 bg-white rounded-lg w-full">
        <form onSubmit={handleSearch} className="col-span-7">
          <div className="flex gap-4 items-center justify-between">
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
        <div className="flex gap-4 items-center col-span-3">
          {groupByOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                'flex items-center gap-2 text-sm',
                !filters.vehicleId && 'opacity-60 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                name="groupBy"
                className="radio radio-sm checked:!bg-info checked:!border-info hover:!border-info"
                value={option.value}
                checked={selectedGroup === option.value}
                onChange={() => handleGroupByChange(option.value)}
                disabled={!filters.vehicleId}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="report-table-container">
        <DataGrid
          rowSelect
          columns={columns}
          serverSide
          onFetchData={(params) => handleFilterDataByGroup(params)}
          filters={[
            ...getDataGridFilters(),
            {
              id: 'GROUP',
              value: selectedGroup
            }
          ]}
          pagination={{
            size: PAGE_LIMIT,
            sizes: undefined
          }}
        />
      </div>
    </>
  );
}
