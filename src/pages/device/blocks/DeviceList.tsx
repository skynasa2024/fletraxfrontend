import { useMemo, useState } from 'react';
import { deleteDevice, DeviceDTO, getDevices } from '@/api/devices';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import DeviceIcon from '../svg/device.svg?react';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import {
  DataGrid,
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
import { ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { useDeviceProvider } from '@/providers/DeviceProvider';

type DeviceListProps = {
  refetchStats?: () => void;
  userId?: string;
};

const DeviceList = ({ refetchStats: refetch, userId }: DeviceListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getProtocolName, getTypeName } = useDeviceProvider();
  const columns = useMemo<ColumnDef<DeviceDTO>[]>(
    () => [
      {
        accessorKey: 'ident',
        header: 'IMEI',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <DeviceIcon color="#5151F9" className="size-12 min-w-12" />
            <div>
              <p className="text-lg text-gray-700 font-monospace">{row.original.ident}</p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'vehiclePlate',
        header: 'Vehicle Plate',
        cell: ({ row }) => <CarPlate plate={row.original.vehiclePlate} />
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => (
          <span>
            {row.original.phoneCode} {row.original.phone}
          </span>
        )
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span>Protocol: {getProtocolName(row.original.protocolId)}</span>
            <span>Type: {getTypeName(row.original.typeId)}</span>
          </div>
        )
      },
      {
        accessorKey: 'subscription',
        header: 'Subscription',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span>Start: {row.original.subscriptionStartDate}</span>
            <span>End: {row.original.subscriptionEndDate}</span>
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-3">
            <a href={`/devices/device/${row.original.ident}`}>
              <img src={toAbsoluteUrl('/media/icons/view.svg')} alt="View" />
            </a>
            <RoleComponent role="admin">
              <a href={`/devices/edit/${row.original.id}`}>
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
                        await deleteDevice(row.original.id);
                        refetch?.();
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
        )
      }
    ],
    [getProtocolName, getTypeName, refetch]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6 ">
        <h2 className="text-xl font-semibold text-gray-800">Devices List</h2>
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
            placeholder="Search"
            onDebounce={setSearchQuery}
          />
        </div>
      </div>
      <div className="driver-table">
        <DataGrid
          columns={columns}
          data={[]}
          serverSide={true}
          onFetchData={getDevices}
          filters={[
            ...(searchQuery.trim().length > 2 ? [{ id: '__any', value: searchQuery }] : []),
            ...(userId ? [{ id: 'userId', value: userId }] : [])
          ]}
        />
      </div>
    </div>
  );
};

export { DeviceList as DeviceList };
