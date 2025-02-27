import React, { useState } from 'react';

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFilters = {
      vehicleId: formData.get('vehicleId')?.toString() || '',
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || '',
      type: formData.get('type')?.toString() || ''
    };

    updateFilters(newFilters);
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
    handleSearch,
    updateFilters,
    resetFilters,
    getDataGridFilters
  };
}
