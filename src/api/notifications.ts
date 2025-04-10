import { OffsetBounds, Paginated } from './common';
import { axios } from './axios';
import { PaginatedResponseModel } from './response';
import { getUser, User } from './user';

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

export type NotificationSettingType = 'urgent' | 'important' | 'normal' | null;

interface NotificationSettingsDTO {
  id: string;
  userId: string;
  deviceId: string | null;
  notificationTypeId: string;
  notificationTypeCode: string;
  notificationTypeTitle: string;
  webType: NotificationSettingType;
  webStatus: boolean;
  mobileType: NotificationSettingType;
  mobileStatus: boolean;
}

export interface NotificationSettings {
  id: string;
  user: User | null;
  webType: NotificationSettingType;
  webStatus: boolean;
}

export async function getNotificationSettings({
  page,
  size = 100,
  sort = 'id,desc',
  search
}: {
  page: number;
  size: number;
  sort: string;
  search: string;
}): Promise<Paginated<NotificationSettings>> {
  // const settings = await axios.get<PaginatedResponseModel<NotificationSettingsDTO>>(
  //   `/api/notifications/settings/index`,
  //   {
  //     params: {
  //       page,
  //       size,
  //       sort,
  //       search
  //     }
  //   }
  // );

  // const settingsData: NotificationSettings[] = await Promise.all(
  //   settings.data.result.content.map(async (setting) => {
  //     const user = await getUser(setting.userId);
  //     return {
  //       id: setting.id,
  //       user,
  //       webType: setting.webType,
  //       webStatus: setting.webStatus
  //     };
  //   })
  // );

  const staticUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com' },
    { id: '5', name: 'Charlie Davis', email: 'charlie.davis@example.com' },
    { id: '6', name: 'Diana Evans', email: 'diana.evans@example.com' },
    { id: '7', name: 'Eve Foster', email: 'eve.foster@example.com' },
    { id: '8', name: 'Frank Green', email: 'frank.green@example.com' },
    { id: '9', name: 'Grace Hill', email: 'grace.hill@example.com' },
    { id: '10', name: 'Henry Irving', email: 'henry.irving@example.com' }
  ];

  const settingsData: NotificationSettings[] = [
    {
      id: '1',
      user: staticUsers[0],
      webType: 'urgent',
      webStatus: true
    },
    {
      id: '2',
      user: staticUsers[1],
      webType: 'important',
      webStatus: false
    },
    {
      id: '3',
      user: staticUsers[2],
      webType: null,
      webStatus: true
    },
    {
      id: '4',
      user: staticUsers[3],
      webType: 'normal',
      webStatus: false
    },
    {
      id: '5',
      user: staticUsers[4],
      webType: 'urgent',
      webStatus: true
    },
    {
      id: '6',
      user: staticUsers[5],
      webType: 'important',
      webStatus: false
    },
    {
      id: '7',
      user: staticUsers[6],
      webType: null,
      webStatus: true
    },
    {
      id: '8',
      user: staticUsers[7],
      webType: 'normal',
      webStatus: false
    },
    {
      id: '9',
      user: staticUsers[8],
      webType: 'urgent',
      webStatus: true
    },
    {
      id: '10',
      user: staticUsers[9],
      webType: 'important',
      webStatus: false
    }
  ];

  return {
    data: settingsData,
    totalCount: 10
  };
}
