import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  access_token: string;
  refreshToken: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface UserModel {
  id: string;
  name: string;
  identifyNumber: string;
  username: string;
  password: string | null;
  email: string;
  phoneCode: string;
  phone: string;
  role: string;
  status: boolean;
  address: string;
  subscriptionStartDate: string;
  timezone: string;
  locale: TLanguageCode;
  parentId: string | null;
}
