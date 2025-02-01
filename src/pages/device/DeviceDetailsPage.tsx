import DeviceNavigation from './DeviceNavigation';
import DeviceIcon from './svg/device.svg?react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { deleteDevice, DeviceDTO, getDeviceModelByImei } from '@/api/devices';
import { CarPlate } from '../dashboards/dashboard/blocks/CarPlate';
import { useDeviceProvider } from '@/providers/DeviceProvider';
import {
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components';
import RoleComponent from '@/components/RoleComponent';
import { toAbsoluteUrl } from '@/utils';

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProtocolName, getTypeName } = useDeviceProvider();

  const [device, sedivevice] = useState<DeviceDTO | null>(null);
  useEffect(() => {
    if (!id) return;
    getDeviceModelByImei(id)
      .then((data) => {
        sedivevice(data);
      })
      .catch(() => {
        navigate('/error/404');
      });
  }, [id, navigate]);

  if (!id) {
    navigate('/error/404');
    return null;
  }

  if (!device) {
    return null;
  }

  return (
    <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full m-5">
      <div className="p-4 w-full">
        <div className="space-y-4">
          <div className="card w-full p-2">
            <div className="w-full flex justify-between gap-6 items-center py-2">
              <div className="flex items-center gap-4">
                <DeviceIcon color="#5151F9" className="size-12 min-w-12" />
                <p className="text-lg text-gray-700">{device.ident}</p>
              </div>
              <CarPlate className="w-auto" plate={device.vehiclePlate} />
              <div className="flex flex-col gap-2">
                <span>Protocol: {getProtocolName(device.protocolId)}</span>
                <span>Type: {getTypeName(device.typeId)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span>Start: {device.subscriptionStartDate}</span>
                <span>End: {device.subscriptionEndDate}</span>
              </div>
              <div className="flex gap-3">
                <a href={`/devices/device/${device.id}`}>
                  <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
                </a>
                <RoleComponent role="admin">
                  <a href={`/devices/edit/${device.id}`}>
                    <img src={toAbsoluteUrl('/media/icons/edit.svg')} alt="Edit" />
                  </a>
                  <Menu>
                    <MenuItem toggle="dropdown" trigger="click">
                      <MenuToggle>
                        <KeenIcon className="text-xl" icon="dots-vertical" />
                      </MenuToggle>
                      <MenuSub className="menu-default">
                        <MenuItem
                          onClick={async () => {
                            await deleteDevice(device.id);
                            navigate('/devices/device');
                          }}
                        >
                          <MenuLink>
                            <MenuIcon>
                              <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                            </MenuIcon>
                            <MenuTitle>Delete</MenuTitle>
                          </MenuLink>
                        </MenuItem>
                      </MenuSub>
                    </MenuItem>
                  </Menu>
                </RoleComponent>
              </div>
            </div>
            <DeviceNavigation />
          </div>

          <Outlet context={{ device }} />
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsPage;
