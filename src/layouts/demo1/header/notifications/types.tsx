export interface INotificationsDropdownProps {
  menuItemRef: any;
}

export interface INotificationItemProps {
  plate: string;
  imei: string;
  text: string;
  date: string;
  info: string;
  badgeColor: string;
}

export interface INotificationSnackbarProps {
  plate: string;
  imei: string;
  text: string;
  date: string;
  info: string;
}

export interface INotification {
  id: string;
  type: string;
  text: string;
  userId: string;
  deviceId: string;
  deviceIdent: string;
  vehiclePlate: string;
  geofenceId: string | null;
  latitude: number;
  longitude: number;
  createdAt: number;
  read: boolean;
}
