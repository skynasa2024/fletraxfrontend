import { DataGrid, KeenIcon, TDataGridRequestParams, useDataGrid } from '@/components';
import { Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components/menu';
import Image from '@/components/image/Image';
import { toAbsoluteUrl } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { getVehicles, updateVehicleStatus, VehicleDetails } from '@/api/cars';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { VehicleStatusValues } from '@/api/cars.ts';
import { StatusDropdown } from '../StatusDropdown';
import { STATUS_OPTIONS } from '../constants';

type VehiclesGridViewProps = {
  searchQuery: string;
  refetchStats: () => void;
};

export default function VehiclesGridView({ searchQuery, refetchStats }: VehiclesGridViewProps) {
  const navigate = useNavigate();

  const handleViewVehicle = () => {
    navigate('view-vehicle');
  };

  const handleGetVehicles = async (params: TDataGridRequestParams) => {
    return await getVehicles(params);
  };
  const columns = React.useMemo<ColumnDef<VehicleDetails>[]>(
    () => [
      {
        accessorKey: 'customer.name',
        header: 'Owner',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Image
              src={row.original.customer.avatar}
              alt={row.original.customer.name}
              title={row.original.customer.name}
              className="size-9 aspect-square object-cover"
              fallback={
                <div className="bg-neutral-200 size-9 aspect-square rounded-full flex items-center justify-center">
                  <KeenIcon style="duotone" icon="user" className="text-black" />
                </div>
              }
            />
            <div>
              <div className="font-bold text-[#3F4254]">{row.original.customer.name}</div>
              <div className="text-[#B5B5C3]">{row.original.customer.email}</div>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'brandName',
        header: 'Brand',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Image
              src={toAbsoluteUrl(row.original.vehicle.name)}
              className="size-9 object-cover aspect-square"
              fallback={
                <div className="bg-neutral-200 size-9 aspect-square rounded-full flex items-center justify-center">
                  <KeenIcon style="duotone" icon="car" className="text-black" />
                </div>
              }
            />
            <span className="text-[#3F4254] capitalize">{row.original.brandName}</span>
          </div>
        )
      },
      {
        accessorKey: 'vehicle.plate',
        header: 'Plate',
        cell: ({ row }) => <CarPlate plate={row.original.vehicle.plate} />
      },
      {
        accessorKey: 'gear',
        header: 'Gear',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <img src={toAbsoluteUrl('/media/icons/manual.svg')} />
            <span className="capitalize">{row.original.type}</span>
          </div>
        )
      },
      {
        accessorKey: 'device.name',
        header: 'Device Name',
        cell: ({ row }) => <span>{row.original.deviceName}</span>
      },
      {
        accessorKey: 'mileage',
        header: 'Mileage',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <img src={toAbsoluteUrl('/media/icons/gauge.svg')} />
            <span className="uppercase">{row.original.mileage}</span>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <GridViewStatusDropdown vehicleDetails={row.original} refetchStats={refetchStats} />
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => <ActionsDropdown handleViewVehicle={handleViewVehicle} />
      }
    ],
    []
  );
  return (
    <DataGrid
      columns={columns}
      serverSide
      onFetchData={(params) =>
        handleGetVehicles({
          ...params
        })
      }
      filters={searchQuery.trim().length >= 1 ? [{ id: '__any', value: searchQuery.trim() }] : []}
    />
  );
}

type ActionsDropdownProps = {
  handleViewVehicle: () => void;
};

function ActionsDropdown({ handleViewVehicle }: ActionsDropdownProps) {
  return (
    <div className="flex gap-3 items-center justify-center">
      <a
        href="#"
        onClick={handleViewVehicle}
        className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
      >
        <img src={toAbsoluteUrl('/media/icons/view-light.svg')} alt="View" />
      </a>
      <a
        href="#"
        className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#50CD89]/10"
      >
        <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} alt="Edit" />
      </a>
      <Menu>
        <MenuItem toggle="dropdown" trigger="click">
          <MenuToggle>
            <KeenIcon className="text-xl" icon="dots-vertical" />
          </MenuToggle>
          <MenuSub className="menu-default">
            <MenuItem>
              <MenuLink>
                <MenuIcon>
                  <img src={toAbsoluteUrl('/media/icons/rent-light.svg')} />
                </MenuIcon>
                <MenuTitle>Rent</MenuTitle>
              </MenuLink>
            </MenuItem>
            <MenuItem>
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
    </div>
  );
}

type StatusDropdownProps = {
  vehicleDetails: VehicleDetails;
  refetchStats: () => void;
};

function GridViewStatusDropdown({ vehicleDetails, refetchStats }: StatusDropdownProps) {
  const refetch = useDataGrid().fetchServerSideData;

  return (
    <StatusDropdown<VehicleStatusValues>
      selected={vehicleDetails.status}
      setSelected={async (value) => {
        await updateVehicleStatus(vehicleDetails.vehicle.id, value);
        refetch();
        refetchStats();
      }}
      options={STATUS_OPTIONS}
    />
  );
}
