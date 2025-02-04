import FileUpload from '@/components/FileUpload';
import { AddUserPageProps } from '../AddUserPage';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/auth';
import RoleComponent from '@/components/RoleComponent';

const Information = ({ user }: AddUserPageProps) => {
  const { currentUser } = useAuthContext();
  const [status, setStatus] = useState<boolean>(currentUser?.role === 'admin');

  useEffect(() => {
    if (user?.status) {
      setStatus(user.status);
    }
  }, [user]);

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">Information</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Name</label>
            <input
              required
              type="text"
              className="input"
              name="name"
              placeholder="Name"
              defaultValue={user?.name}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Identify Number</label>
            <input
              required
              type="text"
              className="input"
              name="identifyNumber"
              placeholder="Identify Number"
              defaultValue={user?.identifyNumber}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Subscription Start Date</label>
            <input
              required
              type="date"
              className="input w-full"
              name="subscriptionStartDate"
              placeholder="DD/MM/YYYY"
              defaultValue={user?.subscriptionStartDate}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Time Zone</label>
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
              <label className="form-label">Role</label>
              <select
                required
                className="select"
                name="role"
                defaultValue={user?.role ? user.role : 'user'}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </RoleComponent>
          <RoleComponent role="user">
            <input type="hidden" name="role" value="user" />
          </RoleComponent>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Front Photo Of National ID Image</label>
            <FileUpload
              name="frontPhotoNationalIdFile"
              isUploaded={!!user?.frontPhotoNationalIdFile}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">National ID Background Image</label>
            <FileUpload
              name="nationalIdBackgroundFile"
              isUploaded={!!user?.nationalIdBackgroundFile}
            />
          </div>
        </div>
        <RoleComponent role="admin">
          <div className="grid gap-2.5">
            <label className="form-label">Status</label>
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
          <input type="hidden" name="status" value="false" />
        </RoleComponent>
      </div>
    </div>
  );
};

export { Information };
