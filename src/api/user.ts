import { axios } from './axios';
import { ResponseModel } from './response';

interface UserModel {
  id: number;
  name: string;
  identifyNumber: string;
  username: string;
  password: string;
  email: string;
  phoneCode: string;
  phone: string;
  role: string;
  status: boolean;
  address: string;
  subscriptionStartDate: string;
  timezone: string;
  locale: string;
  parentId: number;
  keycloakUserId: string;
}

export interface User {
  id: number;
  name: string;
  avatar?: string;
  email: string;
}

export const getUsers = async (): Promise<User[]> => {
  const clients = await axios.get<ResponseModel<UserModel[]>>(
    '/api/users/get-current-user-with-children'
  );
  return clients.data.result.map((client) => ({
    id: client.id,
    name: client.name,
    email: client.email
  }));
};

export const getUser = async (id: number): Promise<User> => {
  const client = await axios.get<ResponseModel<UserModel>>(`/api/users/show/${id}`);
  return {
    id: client.data.result.id,
    name: client.data.result.name,
    email: client.data.result.email
  };
};
