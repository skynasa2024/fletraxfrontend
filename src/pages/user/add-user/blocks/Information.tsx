import FileUpload from '@/components/FileUpload';
import { AddUserPageProps } from '../AddUserPage';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/auth';
import RoleComponent from '@/components/RoleComponent';
import { FormattedMessage, useIntl } from 'react-intl';

const Information = ({ user }: AddUserPageProps) => {
  const { currentUser } = useAuthContext();
  const [status, setStatus] = useState<boolean>(currentUser?.role === 'admin');
  const intl = useIntl();

  useEffect(() => {
    if (user?.status) {
      setStatus(user.status);
    }
  }, [user]);

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">
          <FormattedMessage id="USER.ADD.INFORMATION.TITLE" />
        </h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.NAME" />
            </label>
            <input
              required
              type="text"
              className="input"
              name="name"
              placeholder={intl.formatMessage({ id: 'USER.ADD.INFORMATION.NAME.PLACEHOLDER' })}
              defaultValue={user?.name}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.IDENTIFY_NUMBER" />
            </label>
            <input
              required
              type="text"
              className="input"
              name="identifyNumber"
              placeholder={intl.formatMessage({
                id: 'USER.ADD.INFORMATION.IDENTIFY_NUMBER.PLACEHOLDER'
              })}
              defaultValue={user?.identifyNumber}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.SUBSCRIPTION_START_DATE" />
            </label>
            <input
              required
              type="date"
              className="input w-full dark:[color-scheme:dark]"
              name="subscriptionStartDate"
              placeholder={intl.formatMessage({ id: 'COMMON.DATE.FORMAT' })}
              defaultValue={user?.subscriptionStartDate}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.TIMEZONE" />
            </label>
            <select
              required
              className="select"
              name="timezone"
              defaultValue={user?.timezone ? user.timezone : 'Europe/Istanbul'}
            >
              {Intl.supportedValuesOf('timeZone').map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>
          <RoleComponent role="admin">
            <div className="flex flex-col gap-2.5">
              <label className="form-label">
                <FormattedMessage id="USER.ADD.INFORMATION.ROLE" />
              </label>
              <select
                required
                className="select"
                name="role"
                defaultValue={user?.role ? user.role : 'user'}
              >
                <option value="user">
                  <FormattedMessage id="USER.ADD.INFORMATION.ROLE.USER" />
                </option>
                <option value="admin">
                  <FormattedMessage id="USER.ADD.INFORMATION.ROLE.ADMIN" />
                </option>
              </select>
            </div>
          </RoleComponent>
          <RoleComponent role="user">
            <input type="hidden" name="role" value="user" />
          </RoleComponent>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.FRONT_PHOTO" />
            </label>
            <FileUpload name="frontPhotoNationalIdFile" isUploaded={!!user?.frontPhotoNationalId} />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.BACK_PHOTO" />
            </label>
            <FileUpload name="nationalIdBackgroundFile" isUploaded={!!user?.nationalIdBackground} />
          </div>
        </div>
        <RoleComponent role="admin">
          <div className="grid gap-2.5">
            <label className="form-label">
              <FormattedMessage id="USER.ADD.INFORMATION.STATUS" />
            </label>
            <div className="flex items-center">
              <div className="flex items-center gap-2.5">
                <div className="switch switch-sm">
                  <input
                    name="status"
                    type="checkbox"
                    value="true"
                    checked={status}
                    onChange={() => setStatus((s) => !s)}
                  />
                </div>
              </div>
            </div>
          </div>
        </RoleComponent>
        <RoleComponent role="user">
          <input type="hidden" name="status" value={`${user?.status || false}`} />
        </RoleComponent>
      </div>
    </div>
  );
};

export { Information };
