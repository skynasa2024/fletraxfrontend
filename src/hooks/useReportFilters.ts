import { useState } from 'react';

export interface ReportFilters {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
}

export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFilters>({});

  const updateFilters = (newFilters: ReportFilters) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, value]) => value != null && value !== '')
    );

    setFilters(cleanFilters);
  };

  const resetFilters = () => {
    setFilters({});
  };

  const getDataGridFilters = () =>
    Object.entries(filters).map(([key, value]) => ({
      id: key,
      value
    }));

  return {
    filters,
    updateFilters,
    resetFilters,
    getDataGridFilters
  };
}
