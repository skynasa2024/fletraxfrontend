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

type NotificationParams = {
  offset: OffsetBounds;
  search?: string;
  ident?: string;
  vehicleId?: string;
  alarmType?: string;
};

export const getNotifications = async ({
  offset,
  search,
  ident,
  vehicleId,
  alarmType
}: NotificationParams): Promise<Paginated<NotificationDTO>> => {
  const notifications = await axios.get<PaginatedResponseModel<NotificationDTO>>(
    '/api/notifications/index',
    {
      params: {
        offset: offset.start,
        size: offset.end - offset.start + 1,
        sort: 'createdAt,desc',
        search,
        ident,
        vehilceId: vehicleId,
        alarmType
      }
    }
  );

  return {
    totalCount: notifications.data.result.totalElements,
    data: notifications.data.result.content
  };
};

interface NotificationTypeDTO {
  id: string;
  code: string;
  label: string;
  showToUser: boolean;
}

export async function getNotificationTypes({
  start,
  end
}: {
  start: number;
  end: number;
}): Promise<Paginated<NotificationTypeDTO>> {
  const types = await axios.get<PaginatedResponseModel<NotificationTypeDTO>>(
    `/api/notifications/types/index`,
    {
      params: {
        offset: start,
        size: end - start + 1
      }
    }
  );

  return {
    data: types.data.result.content,
    totalCount: types.data.result.totalElements
  };
}
