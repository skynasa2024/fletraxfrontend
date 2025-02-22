import { OffsetBounds, Paginated } from './common';
import { axios } from './axios';
import { PaginatedResponseModel } from './response';

export interface NotificationDTO {
  createdAt: number;
  deviceId: string;
  deviceIdent: string;
  geofenceId: string | null;
  geofenceName: string | null;
  id: string;
  latitude: number;
  longitude: number;
  read: boolean;
  text: string;
  textTrans: string;
  type: string;
  typeTrans: string;
  userId: string | null;
  vehiclePlate: string;
}

export const getNotifications = async ({
  offset,
  search
}: {
  offset: OffsetBounds;
  search?: string;
}): Promise<Paginated<NotificationDTO>> => {
  const notifications = await axios.get<PaginatedResponseModel<NotificationDTO>>(
    '/api/notifications/index',
    {
      params: {
        offset: offset.start,
        size: offset.end - offset.start + 1,
        sort: 'createdAt,desc',
        search
      }
    }
  );

  return {
    totalCount: notifications.data.result.totalElements,
    data: notifications.data.result.content
  };
};
