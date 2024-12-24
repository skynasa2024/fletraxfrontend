import { axios } from './axios';
import { ResponseModel } from './response';

interface ClientModel {
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

export interface Client {
  id: number;
  name: string;
  avatar?: string;
  onlineDevices: number;
  offlineDevices: number;
}

export const getClients = async (): Promise<Client[]> => {
  const clients = await axios.get<ResponseModel<ClientModel[]>>(
    '/api/users/get-current-user-with-children'
  );
  return clients.data.result.map((client) => ({
    id: client.id,
    name: client.name,
    onlineDevices: 0,
    offlineDevices: 0
  }));
};
