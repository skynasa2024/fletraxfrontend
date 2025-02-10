import { getUserModel, UserModel } from '@/api/user';
import { Container } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FileList, { FileInfo } from '@/pages/driver/details-components/FileList';
import { DeviceList } from '@/pages/device/blocks';
import Toolbar from './Toolbar';
import { Chip } from '@mui/material';
import clsx from 'clsx';

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserModel | null>(null);
  useEffect(() => {
    if (!id) return;
    getUserModel(id)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        navigate('/error/404');
      });
  }, [id, navigate]);

  const files = useMemo(() => {
    if (!user) return [];

    const files: FileInfo[] = [];

    files.push({
      name: 'Front Photo Of National ID Image',
      url: user.frontPhotoNationalId ?? undefined
    });
    files.push({
      name: 'National ID Background Image',
      url: user.nationalIdBackground ?? undefined
    });
    files.push({
      name: 'Contract PDF',
      url: user.contractPdf ?? undefined
    });
    files.push({
      name: 'Tax Plate',
      url: user.taxPlate ?? undefined
    });

    return files;
  }, [user]);

  if (!id) {
    navigate('/error/404');
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <Container className="mb-10 flex flex-col gap-6">
      <Toolbar />

      <div className="card bg-white shadow-md rounded-lg overflow-hidden">
        <div className="card-body p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-400">{user.country}</p>
          </div>
          <UserStatusTag status={user.status} />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="card-body p-8">
            <div className="flex gap-3 items-center"></div>
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4">
              <h2 className="text-xl font-semibold mb-4 text-dark">Documents</h2>
              <FileList files={files} />
            </div>
          </div>
        </div>
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="card-body p-8 flex flex-col gap-6">
            <div>
              <p className="text-gray-400 mb-1">Identify Number</p>
              <p className="text-gray-800 font-semibold">{user.identifyNumber}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Subscription Start Date</p>
              <p className="text-gray-800 font-semibold">{user.subscriptionStartDate}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Phone</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/phone.svg')} />
                <span>
                  {user.phoneCode} {user.phone}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Country</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.country}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Area</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.state}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="card-body p-8 flex flex-col gap-6">
            <div>
              <p className="text-gray-400 mb-1">Time Zone</p>
              <p className="text-gray-800 font-semibold">{user.timezone}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Role</p>
              <p className="text-gray-800 font-semibold">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Phone2</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/phone.svg')} />
                <span>
                  {user.secondaryPhoneCode} {user.secondaryPhone}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">City</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.city}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Address In Detail</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <DeviceList userId={id} />
    </Container>
  );
};

function UserStatusTag({ status }: { status: boolean }) {
  return (
    <div
      className={clsx('px-4 py-2 rounded-md font-semibold text-lg', {
        'bg-green-500/10 border border-success text-success': status,
        'bg-red-500/10 border border-danger text-danger': !status
      })}
    >
      {status ? 'Active' : 'Inactive'}
    </div>
  );
}

export default UserDetailsPage;
