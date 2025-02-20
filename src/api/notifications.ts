import { Paginated } from './common';
import { axios } from './axios';
import { PaginatedResponseModel } from './response';

export interface Notification {
  id: string;
  image?: string;
  title: string;
  details: string;
}

export interface NotificationDTO {
  createdAt: number;
  deviceId: string;
  deviceIdent: string;
  geofenceId: string | null;
  id: string;
  latitude: number;
  longitude: number;
  read: boolean;
  text: string;
  type: string;
  userId: string | null;
  vehiclePlate: string;
}

export const getNotifications = async ({
  page,
  size,
  search
}: {
  page: number;
  size: number;
  search?: string;
}): Promise<Paginated<Notification>> => {
  const notifications = await axios.get<PaginatedResponseModel<NotificationDTO>>(
    '/api/notifications/index',
    {
      params: {
        page,
        size,
        sort: 'createdAt,desc',
        search
      }
    }
  );

  return {
    totalCount: notifications.data.result.totalElements,
    data: notifications.data.result.content.map((notification) => ({
      id: notification.id,
      image: '',
      title: notification.type,
      details: notification.text
    }))
  };
};
