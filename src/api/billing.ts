import { faker } from '@faker-js/faker';

export interface Billing {
  date: string;
  type: string;
  description: string;
  amount: number;
  status: string;
}

export const getBillingHistory = async (filter: string): Promise<Billing[]> => {
  const data = Array.from({ length: faker.number.int({ min: 10, max: 100 }) }).map(() => ({
    date: faker.date.recent().toISOString(),
    type: faker.finance.transactionType(),
    description: faker.lorem.sentence(),
    amount: parseFloat((Math.random() * (1000 - 50) + 50).toFixed(2)),
    status: faker.helpers.arrayElement(['Paid', 'Unpaid'])
  }));
  console.log('Generated Billing Data:', data); 
  return data;
};
