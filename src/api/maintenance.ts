import { TDataGridRequestParams } from '@/components';
import { Paginated } from '@/api/common.ts';
import { axios } from '@/api/axios.ts';
import { PaginatedResponseModel, ResponseModel } from '@/api/response.ts';
import { getVehicle, Vehicle } from '@/api/cars.ts';
import React from 'react';

export interface Maintenance {
  id: string;
  date: Date;
  vehicle: Vehicle | null;
  type: string;
  supplier: string;
  price: number;
  status: string;
}

export interface MaintenanceDTO {
  id: string;
  type: string;
  description: string;
  supplier: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  vehicleId: string;
  userId: string;
}

export interface IMaintenanceStats {
  total: number;
  lastMonth: number;
  ongoing: number;
  finished: number;
}

export interface IMaintenanceCardProps {
  classNames?: {
    root?: string;
    icon?: string;
    label?: string;
    value?: string;
  };
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const getMaintenanceStats = async (): Promise<IMaintenanceStats> => {
  const stats = await axios.get<ResponseModel<IMaintenanceStats>>('/api/maintenances/stats');
  return stats.data.result;
};

export const getMaintenance = async (
  params: TDataGridRequestParams
): Promise<Paginated<Maintenance>> => {
  // Convert filters to map
  const filters =
    params.filters?.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, unknown>
    ) ?? {};
  const maintenances = await axios.get<PaginatedResponseModel<MaintenanceDTO>>(
    filters['vehicleId']
      ? `/api/maintenances/get-by-vehicle-id/${filters['vehicleId']}`
      : '/api/maintenances/index',
    {
      params: {
        page: params.pageIndex,
        size: params.pageSize,
        search: filters['__any'] && filters['__any'].toString(),
        ...(params.sorting?.[0] && {
          sort: `${params.sorting[0].id},${params.sorting[0].desc ? 'desc' : 'asc'}`
        })
      }
    }
  );

  const vehiclePromise = maintenances.data.result.content.map((maintenance) =>
    getVehicle(maintenance.vehicleId)
  );
  const vehicles = await Promise.all(vehiclePromise);

  return {
    data: maintenances.data.result.content.map((maintenance, i) => ({
      id: maintenance.id,
      date: new Date(maintenance.startDate),
      vehicle: vehicles[i],
      type: maintenance.type,
      supplier: maintenance.supplier,
      price: maintenance.amount,
      status: maintenance.status
    })),
    totalCount: maintenances.data.result.totalElements
  };
};

export const updateMaintenanceStatus = async (id: string, status: string): Promise<void> => {
  await axios.patch(`/api/maintenances/update-status/${id}`, undefined, {
    params: {
      status
    }
  });
};

