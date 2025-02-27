import { useReportFilters } from './useReportFilters';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

interface UseReportTableProps<T> {
  columns: ColumnDef<T>[];
  defaultSort?: string;
  type?: string;
  // eslint-disable-next-line no-unused-vars
  fetchData: (params: any) => Promise<any>;
}

export function useReportTable<T>({
  columns,
  defaultSort = 'date,desc',
  type,
  fetchData
}: UseReportTableProps<T>) {
  const { filters, updateFilters, getDataGridFilters } = useReportFilters();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilters({
      vehicleId: formData.get('vehicleId')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || ''
    });
  };

  const handleFetchData = async (params: any) => {
    const sortParam = params.sorting?.[0]
      ? `${params.sorting[0].id},${params.sorting[0].desc ? 'desc' : 'asc'}`
      : defaultSort;

    const queryParams = {
      ...params,
      type,
      ...filters,
      sort: sortParam
    };

    return await fetchData(queryParams);
  };

  return {
    filters,
    columns,
    handleSearch,
    handleFetchData,
    getDataGridFilters
  };
}
