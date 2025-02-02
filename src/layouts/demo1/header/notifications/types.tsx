export interface INotificationsDropdownProps {
  menuItemRef: any;
}

export interface INotificationItemProps {
  userName: string;
  text: string;
  date: string;
  info: string;
  badgeColor: string;
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