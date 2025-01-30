import { getUserModel, UserModel } from '@/api/user';
import Image from '@/components/image/Image';
import { toAbsoluteUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

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
  if (!id) {
    navigate('/error/404');
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="card max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="card-body p-8">
        <div className="flex">
          <div className="w-1/3 border-r border-gray-200 pr-8">
            <Image
              src={user.photoFile ?? undefined}
              alt={user.name}
              title={user.name}
              className="w-full rounded-lg object-cover mb-4"
              fallback={
                <div className="w-full rounded-lg object-cover mb-4 bg-neutral-200 overflow-hidden flex items-center justify-center">
                  <img src={toAbsoluteUrl('/media/avatars/avatar-placeholder.png')} />
                </div>
              }
            />
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-400">{user.country}</p>
          </div>

          <div className="w-1/3 px-8">
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Identify Number</p>
              <p className="text-gray-800 font-semibold">{user.identifyNumber}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Subscription Start Date</p>
              <p className="text-gray-800 font-semibold">{user.subscriptionStartDate}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Phone</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/phone.svg')} />
                <span>
                  {user.phoneCode} {user.phone}
                </span>
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Country</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.country}</span>
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Area</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.state}</span>
              </p>
            </div>
          </div>

          <div className="w-1/3 px-8">
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Time Zone</p>
              <p className="text-gray-800 font-semibold">{user.timezone}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Role</p>
              <p className="text-gray-800 font-semibold">{user.role}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Phone2</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/phone.svg')} />
                <span>
                  {user.secondaryPhoneCode} {user.secondaryPhone}
                </span>
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">City</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.city}</span>
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-1">Address In Detail</p>
              <p className="text-gray-800 font-semibold flex gap-2 items-center">
                <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                <span>{user.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
