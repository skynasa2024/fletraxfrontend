import { TDataGridRequestParams } from '@/components';
import { OffsetBounds, Paginated } from '@/api/common.ts';
import { axios } from '@/api/axios.ts';
import { PaginatedResponseModel, ResponseModel } from '@/api/response.ts';

export interface MaintenanceTypeModel {
  id?: string;
  code?: string;
  title?: string;
}

export interface IMaintenanceTypeTableData {
  id: string;
  code: string;
  title: string;
}

export const getMaintenanceTypes = async (
  params: TDataGridRequestParams
): Promise<Paginated<MaintenanceTypeModel>> => {
  const filters =
    params.filters?.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, unknown>
    ) ?? {};
  const maintenanceTypes = await axios.get<PaginatedResponseModel<IMaintenanceTypeTableData>>(
    '/api/maintenances/types/index',
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

  return {
    data: maintenanceTypes.data.result.content.map((maintenanceType) => ({
      id: maintenanceType.id,
      code: maintenanceType.code,
      title: maintenanceType.title
    })),
    totalCount: maintenanceTypes.data.result.totalElements
  };
};

export const searchMaintenanceTypes = async (
  params: TDataGridRequestParams | OffsetBounds
): Promise<Paginated<MaintenanceTypeModel>> => {
  const requestParams =
    'start' in params
      ? {
          offset: params.start,
          size: params.end - params.start + 1,
          search: params.search
        }
      : {
          page: params.pageIndex,
          size: params.pageSize,
          search: params.filters?.[0] && params.filters[0].value,
          ...(params.sorting?.[0] && {
            sort: `${params.sorting[0].id},${params.sorting[0].desc ? 'desc' : 'asc'}`
          })
        };

  const maintenanceTypes = await axios.get<PaginatedResponseModel<MaintenanceTypeModel>>(
    '/api/maintenances/types/index',
    {
      params: requestParams
    }
  );

  return {
    data: maintenanceTypes.data.result.content.map((maintenanceType) => ({
      id: maintenanceType.id,
      code: maintenanceType.code,
      title: maintenanceType.title
    })),
    totalCount: maintenanceTypes.data.result.totalElements
  };
};

export const getMaintenanceTypeById = async (id: string) => {
  return await axios.get<ResponseModel<MaintenanceTypeModel>>(`/api/maintenances/types/show/${id}`);
};

export const createMaintenanceType = async (data: FormData) => {
  const response = await axios.post<ResponseModel<MaintenanceTypeModel>>(
    '/api/maintenances/types/create',
    data
  );
  return response.data.result;
};

export const updateMaintenanceType = async (id: string, data: FormData) => {
  data.append('id', id);
  const response = await axios.put<ResponseModel<MaintenanceTypeModel>>(
    '/api/maintenances/types/update',
    data
  );
  return response.data.result;
};

export const deleteMaintenanceType = async (id: string) => {
  return await axios.get(`/api/maintenances/types/delete/${id}`);
};
