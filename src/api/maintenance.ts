import { TDataGridRequestParams } from '@/components';
import { Paginated } from '@/api/common.ts';
import { axios } from '@/api/axios.ts';
import { PaginatedResponseModel, ResponseModel } from '@/api/response.ts';
import React from 'react';
import { getUser, User } from '@/api/user.ts';
import { Vehicle } from '@/api/cars.ts';

export interface Maintenance {
  id: string;
  date: Date;
  vehicle: Vehicle | null;
  type: string;
  supplier: string;
  price: number;
  status: string;
}

export interface MaintenanceModel {
  id: string;
  type: string;
  description: string;
  supplier: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number | undefined;
  vehicleId: string;
  vehiclePlate: string;
  vehicleImage: string;
  vehicleBrand: string;
  vehicleModel: string;
  userId: string;
}

export interface MaintenanceUpdateModel {
  id: string;
  type: string;
  description: string;
  supplier: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number | undefined;
  vehicleId: string;
  vehiclePlate: string;
  vehicleImage: string;
  vehicleBrand: string;
  vehicleModel: string;
  userId: string;
}

export interface IMaintenanceTableData {
  id: string;
  type: string;
  supplier: string;
  startDate: Date;
  endDate: Date;
  status: string;
  amount: number;
  vehicleId: string;
  vehiclePlate: string;
  vehicleImage: string;
  vehicleName: string;
  vehicleBrand: string;
  userId: string;
  user: User | null;
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
): Promise<Paginated<IMaintenanceTableData>> => {
  const filters =
    params.filters?.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, unknown>
    ) ?? {};
  const maintenances = await axios.get<PaginatedResponseModel<MaintenanceModel>>(
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

  const users = await Promise.all(
    maintenances.data.result.content
      .filter((maintenance) => maintenance.userId !== null)
      .map((maintenance) => getUser(maintenance.userId!))
  );

  return {
    data: maintenances.data.result.content.map((maintenance, i) => ({
      id: maintenance.id,
      type: maintenance.type,
      supplier: maintenance.supplier,
      amount: maintenance.amount!,
      status: maintenance.status,
      user: users[i],
      vehicleId: maintenance.vehicleId,
      vehiclePlate: maintenance.vehiclePlate,
      vehicleImage: maintenance.vehicleImage,
      vehicleName: maintenance.vehicleBrand + ' ' + maintenance.vehicleModel,
      startDate: new Date(maintenance.startDate!),
      endDate: new Date(maintenance.endDate!),
      userId: maintenance.userId,
      vehicleBrand: maintenance.vehicleBrand
    })),
    totalCount: maintenances.data.result.totalElements
  };
};

export const updateMaintenanceStatus = async (id: string, status: string): Promise<void> => {
  await axios.patch(`/api/maintenances/update-status/${id}`, undefined, { params: { status } });
};

export const getMaintenanceById = async (id: string) => {
  return await axios.get<ResponseModel<MaintenanceModel>>(`/api/maintenances/show/${id}`);
};

export const createMaintenance = async (data: FormData) => {
  // Fix startDate and endDate
  if (data.get('startDate')) {
    data.set('startDate', new Date(data.get('startDate') as string).toISOString());
  }
  if (data.get('endDate')) {
    data.set('endDate', new Date(data.get('endDate') as string).toISOString());
  }
  const response = await axios.post<ResponseModel<MaintenanceModel>>(
    '/api/maintenances/create',
    data
  );
  return response.data.result;
};

export const updateMaintenance = async (id: string, data: FormData) => {
  data.append('id', id);
  // Fix startDate and endDate
  if (data.get('startDate')) {
    data.set('startDate', new Date(data.get('startDate') as string).toISOString());
  }
  if (data.get('endDate')) {
    data.set('endDate', new Date(data.get('endDate') as string).toISOString());
  }
  const response = await axios.put<ResponseModel<MaintenanceModel>>(
    '/api/maintenances/update',
    data
  );
  return response.data.result;
};

export const deleteMaintenance = async (id: string) => {
  return await axios.get(`/api/maintenances/delete/${id}`);
};
