import DeviceNavigation from './DeviceNavigation';
import DeviceIcon from './svg/device.svg?react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { deleteDevice, DeviceDTO, getDeviceModelByImei } from '@/api/devices';
import { CarPlate } from '../dashboards/blocks/CarPlate';
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
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDialogs } from '@toolpad/core/useDialogs';

const DeviceDetailsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dialogs = useDialogs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProtocolName, getTypeName } = useDeviceProvider();
  const intl = useIntl();

  const [device, setDevice] = useState<DeviceDTO | null>(null);
  useEffect(() => {
    if (!id) return;
    getDeviceModelByImei(id)
      .then((data) => {
        setDevice(data);
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
                <span>
                  <FormattedMessage id="DEVICE.DETAILS.PROTOCOL" />:{' '}
                  {getProtocolName(device.protocolId)}
                </span>
                <span>
                  <FormattedMessage id="DEVICE.DETAILS.TYPE" />: {getTypeName(device.typeId)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span>
                  <FormattedMessage id="COMMON.START" />: {device.subscriptionStartDate}
                </span>
                <span>
                  <FormattedMessage id="COMMON.END" />: {device.subscriptionEndDate}
                </span>
              </div>
              <div className="flex gap-3">
                <a href={`/devices/device/${device.id}`}>
                  <img
                    src={toAbsoluteUrl('/media/icons/view.svg')}
                    alt={intl.formatMessage({ id: 'COMMON.VIEW' })}
                  />
                </a>
                <RoleComponent role="admin">
                  <a href={`/devices/edit/${device.id}`}>
                    <img
                      src={toAbsoluteUrl('/media/icons/edit.svg')}
                      alt={intl.formatMessage({ id: 'COMMON.EDIT' })}
                    />
                  </a>
                  <Menu>
                    <MenuItem toggle="dropdown" trigger="click">
                      <MenuToggle>
                        <KeenIcon className="text-xl" icon="dots-vertical" />
                      </MenuToggle>
                      <MenuSub className="menu-default">
                        <MenuItem
                          onClick={async () => {
                            if (
                              !(await dialogs.confirm(
                                intl.formatMessage({
                                  id: 'DEVICE.DELETE.MODAL_MESSAGE'
                                }),
                                {
                                  title: intl.formatMessage({ id: 'DEVICE.DELETE.MODAL_TITLE' }),
                                  okText: intl.formatMessage({ id: 'COMMON.DELETE' }),
                                  cancelText: intl.formatMessage({ id: 'COMMON.CANCEL' })
                                }
                              ))
                            )
                              return;
                            await deleteDevice(device.id);
                            enqueueSnackbar(intl.formatMessage({ id: 'DEVICE.DELETE_SUCCESS' }), {
                              variant: 'success'
                            });
                            navigate('/devices/device');
                          }}
                        >
                          <MenuLink>
                            <MenuIcon>
                              <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                            </MenuIcon>
                            <MenuTitle>
                              <FormattedMessage id="COMMON.DELETE" />
                            </MenuTitle>
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
