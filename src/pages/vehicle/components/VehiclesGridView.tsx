import { DataGrid, KeenIcon, TDataGridRequestParams, useDataGrid } from '@/components';
import {
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components/menu';
import Image from '@/components/image/Image';
import { toAbsoluteUrl } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { deleteVehicle, getVehicles, updateVehicleStatus, VehicleDetails } from '@/api/cars';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { STATUS_OPTIONS } from '../constants';
import { StatusDropdown } from '@/pages/dashboards/dashboard/blocks/StatusDropdown';
import { Link } from 'react-router-dom';

type VehiclesGridViewProps = {
  searchQuery: string;
  refetchStats: () => void;
};

export default function VehiclesGridView({ searchQuery, refetchStats }: VehiclesGridViewProps) {
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
            <img
              src={
                row.original.customer.avatar ||
                toAbsoluteUrl('/media/avatars/avatar-placeholder.png')
              }
              alt={row.original.customer.name}
              className="size-9 aspect-square object-cover rounded-full"
            />
            <div className="font-bold text-[#3F4254]">{row.original.customer.name}</div>
          </div>
        )
      },
      {
        accessorKey: 'brand',
        header: 'Brand',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Image
              src={toAbsoluteUrl(row.original.vehicle.brandImage)}
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
        accessorKey: 'plate',
        header: 'Plate',
        enableSorting: true,
        cell: ({ row }) => <CarPlate plate={row.original.vehicle.plate} />
      },
      {
        accessorKey: 'gear',
        header: 'Gear',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <img src={toAbsoluteUrl('/media/icons/manual.svg')} />
            <span className="capitalize">{row.original.type}</span>
          </div>
        )
      },
      {
        accessorKey: 'deviceIdent',
        header: 'Device Name',
        enableSorting: true,
        cell: ({ row }) => <span>{row.original.vehicle.imei}</span>
      },
      {
        accessorKey: 'maintenanceMileage',
        header: 'Maintenance Mileage',
        enableSorting: true,
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
        enableSorting: true,
        cell: ({ row }) => (
          <GridViewStatusDropdown vehicleDetails={row.original} refetchStats={refetchStats} />
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsDropdown vehicleId={row.original.vehicle.id} />
      }
    ],
    [refetchStats]
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

function ActionsDropdown({ vehicleId }: { vehicleId: string }) {
  const reload = useDataGrid().fetchServerSideData;

  return (
    <div className="flex gap-3 items-center justify-center">
      <Link
        to={'/vehicles/vehicle/' + vehicleId}
        className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#5271FF]/10"
      >
        <img src={toAbsoluteUrl('/media/icons/view-light.svg')} alt="View" />
      </Link>
      <Link
        to={'/vehicles/edit/' + vehicleId}
        className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#50CD89]/10"
      >
        <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} alt="Edit" />
      </Link>
      <Menu>
        <MenuItem toggle="dropdown" trigger="click">
          <MenuToggle>
            <KeenIcon className="text-xl" icon="dots-vertical" />
          </MenuToggle>
          <MenuSub className="menu-default">
            <MenuItem
              onClick={async () => {
                await deleteVehicle(vehicleId);
                reload();
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
    <StatusDropdown
      selected={vehicleDetails.status}
      setSelected={async (value) => {
        await updateVehicleStatus(vehicleDetails.carId, value);
        refetch();
        refetchStats();
      }}
      options={STATUS_OPTIONS}
    />
  );
}
