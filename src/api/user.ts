import { TDataGridRequestParams } from '@/components';
import { axios } from './axios';
import { PaginatedResponseModel, ResponseModel } from './response';
import { OffsetBounds, Paginated } from './common';

export interface UserModel {
  id: number;
  name: string;
  identifyNumber: string;
  username: string;
  password: string | null;
  email: string;
  photo: string | null;
  photoFile: string | null;
  phoneCode: string;
  phone: string;
  secondaryPhoneCode: string;
  secondaryPhone: string;
  country: string;
  state: string;
  city: string;
  role: string;
  status: boolean;
  address: string;
  subscriptionStartDate: string;
  timezone: string;
  locale: string;
  parentId: number | null;
  keycloakUserId: string;
}

export interface User {
  id: number;
  name: string;
  avatar?: string;
  email: string;
}

export const getMonitoringUsers = async (): Promise<User[]> => {
  const clients = await axios.get<ResponseModel<UserModel[]>>(
    '/api/users/get-current-user-with-children'
  );
  return clients.data.result.map((client) => ({
    id: client.id,
    name: client.name,
    email: client.email
  }));
};

export const getUsers = async (
  params: TDataGridRequestParams | OffsetBounds
): Promise<Paginated<UserModel>> => {
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
          search: params.filters?.[0] && params.filters[0].value
        };
  const clients = await axios.get<PaginatedResponseModel<UserModel>>('/api/users/index', {
    params: requestParams
  });
  return {
    data: clients.data.result.content,
    totalCount: clients.data.result.totalElements
  };
};

export const getUserModel = async (id: number): Promise<UserModel> => {
  const client = await axios.get<ResponseModel<UserModel>>(`/api/users/show/${id}`);
  return client.data.result;
};

export const getUser = async (id: number): Promise<User> => {
  const client = await getUserModel(id);
  return {
    id: client.id,
    name: client.name,
    email: client.email
  };
};

export interface Topics {
  monitoring: string;
  notifications: string;
}

export const getTopics = async (): Promise<Topics> => {
  const topics = await axios.get<ResponseModel<Topics>>('/api/users/get-user-topics');
  return topics.data.result;
};

export interface UserStats {
  total: number;
  active: number;
  unactive: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const stats = await axios.get<ResponseModel<UserStats>>('/api/users/stats');
  return stats.data.result;
};

export const updateUserStatus = async (id: number, status: boolean) => {
  await axios.patch(`/api/users/update-status/${id}`, undefined, {
    params: {
      status
    }
  });
};
