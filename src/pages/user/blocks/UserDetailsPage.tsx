import { getUserModel, UserModel } from '@/api/user';
import { Container } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FileList, { FileInfo } from '@/pages/driver/details-components/FileList';
import { DeviceList } from '@/pages/device/blocks';
import Toolbar from './Toolbar';

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
      url: user.frontPhotoNationalIdFile ?? undefined
    });
    files.push({
      name: 'National ID Background Image',
      url: user.nationalIdBackgroundFile ?? undefined
    });
    files.push({
      name: 'Contract PDF',
      url: user.contractPdfFile ?? undefined
    });
    files.push({
      name: 'Tax Plate',
      url: user.taxPlateFile ?? undefined
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="card-body p-8">
            <div className="flex gap-3 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-400">{user.country}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 mt-4">
              <h2 className="text-xl font-semibold mb-4">Documents</h2>
              <FileList files={files} />
            </div>
          </div>
        </div>
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="card-body p-8 grid grid-cols-2 gap-6">
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

export default UserDetailsPage;
