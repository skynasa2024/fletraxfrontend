import { faker } from '@faker-js/faker';
import { TDataGridRequestParams } from '@/components';
import { Paginated } from './common';


export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  
}

export const getUsers = async (
  params: TDataGridRequestParams
): Promise<Paginated<User>> => {
  const totalCount = faker.number.int({ min: 10, max: 100 });
  const originalDataset: User[] = Array(params.pageSize)
    .fill(0)
    .map(() => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['Admin', 'User', 'Manager', 'Viewer']),
      status: faker.helpers.arrayElement(['Active', 'Suspended', 'Pending Activation', 'Deactivated']),
   
    }));

  return {
    data: originalDataset,
    totalCount
  };
};