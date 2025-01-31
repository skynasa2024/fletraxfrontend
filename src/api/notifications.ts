import { faker } from '@faker-js/faker';

export interface Notification {
  id: string;
  image?: string;
  title: string;
  details: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  return Array(10)
    .fill(0)
    .map(() => ({
      id: faker.string.uuid(),
      title: faker.word.words({ count: { min: 2, max: 4 } }),
      details: faker.lorem.paragraph(),
      image: faker.helpers.maybe(faker.image.avatarGitHub)
    }));
};
