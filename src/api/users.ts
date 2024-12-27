import { faker } from '@faker-js/faker';
import { TDataGridRequestParams } from '@/components';
import { Paginated } from './common';

export interface User {
  id: string;
  username: string;
  owner: string;
  email: string;
  role: string;
  status: string;
  date: string;
  city: string;
  timezone: string;
}

export const getUsers = async (
  params: TDataGridRequestParams
): Promise<Paginated<User>> => {
  const totalCount = faker.number.int({ min: 10, max: 100 });
  const originalDataset: User[] = Array(params.pageSize)
    .fill(0)
    .map(() => ({
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      owner: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['Admin', 'User', 'Manager', 'Viewer']),
      status: faker.helpers.arrayElement(['Active', 'Suspended', 'Pending Activation', 'Deactivated']),
      date: faker.date.past().toISOString(),
      city: faker.location.city(),
      timezone: faker.location.timeZone()
    }));

  return {
    data: originalDataset,
    totalCount
  };
};