import React, { useMemo, useState } from 'react';
import { DataGrid, KeenIcon, TDataGridRequestParams, useDataGrid } from '@/components';
import {
  Menu,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle,
  MenuIcon
} from '@/components/menu';
import {
  getVehicles,
  updateVehicleStatus,
  VehicleDetails,
  VehicleStatusValues
} from '@/api/cars.ts';
import { Paginated } from '@/api/common.ts';
import { ColumnDef } from '@tanstack/react-table';
import { toAbsoluteUrl } from '@/utils';
import { DropdownOptions, StatusDropdown } from '../StatusDropdown.tsx';

import { useNavigate } from 'react-router';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate.tsx';
import { Download, Filter } from 'lucide-react';
import clsx from 'clsx';
import Image from '@/components/image/Image.tsx';

const STATUS_OPTIONS: DropdownOptions<VehicleStatusValues> = {
  unavailable: {
    color: '#F1416C',
    backgroundColor: '#FFF5F8',
    name: 'Unavailable'
  },
  in_maintenance: {
    color: '#FFA800',
    backgroundColor: '#FFF8EA',
    name: 'Maintenance'
  },
  available: {
    color: '#50CD89',
    backgroundColor: '#EEFAF4',
    name: 'Available'
  },
  rented: {
    color: '#00A3FF',
    backgroundColor: '#E5F7FF',
    name: 'Rented'
  }
};

type ViewMode = 'grid' | 'card';

function VehicleStatusDropdown({ vehicleDetails }: { vehicleDetails: VehicleDetails }) {
  const reload = useDataGrid().fetchServerSideData;

  return (
    <StatusDropdown<VehicleStatusValues>
      selected={vehicleDetails.status}
      setSelected={async (value) => {
        console.log('Updating vehicle status to:', value);
        await updateVehicleStatus(vehicleDetails.vehicle.id, value);
        reload();
      }}
      options={STATUS_OPTIONS}
    />
  );
}

function VehicleList() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();

  const handleGetVehicles = async (params: TDataGridRequestParams) => {
    const vehicles = await getVehicles(params);
    setVehicles(vehicles);
    return vehicles;
  };

  const columns = useMemo<ColumnDef<VehicleDetails>[]>(
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
        cell: ({ row }) => <VehicleStatusDropdown vehicleDetails={row.original} />
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => <ActionsDropdown handleViewVehicle={handleViewVehicleClick} />
      }
    ],
    []
  );
  const navigate = useNavigate();
  const handleViewVehicleClick = () => {
    navigate('view-vehicle');
  };

  return (
    <div className="card">
      <div className="px-4 sm:px-7 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="card-title">
          <h3>Vehicle</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            You have {vehicles?.totalCount}{' '}
            {(vehicles?.totalCount ?? 0 > 1) ? 'vehicles' : 'vehicle'}
          </h4>
        </div>
        <div className="flex items-center gap-4">
          {/* View Mode Buttons */}
          <button
            className={clsx(
              'p-3 transition-colors border rounded-lg flex items-center justify-center',
              viewMode === 'card' ? 'text-info' : 'hover:bg-gray-50'
            )}
            onClick={() => setViewMode('card')}
            title="Card View"
          >
            <KeenIcon
              style="duotone"
              icon="category"
              className={clsx(viewMode === 'card' ? 'text-info' : 'text-gray-400')}
            />
          </button>
          <button
            className={clsx(
              'p-3 transition-colors border rounded-lg flex items-center justify-center',
              viewMode === 'grid' ? 'text-info' : 'hover:bg-gray-50'
            )}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <KeenIcon
              style="duotone"
              icon="row-horizontal"
              className={clsx(viewMode === 'grid' ? 'text-info' : 'text-gray-400')}
            />
          </button>
          {/* Filters Button */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg border hover:bg-gray-50">
              <Filter size={16} />
              <span>Filters</span>
              <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-100 rounded-full">
                2
              </span>
            </button>
          </div>
          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border">
            <Download size={16} />
            <span>Export</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <KeenIcon style="duotone" icon="magnifier" />
            </div>
            <input
              type="search"
              className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
      <div className="gap-cols responsive-card">
        <div className="card-body pt-2 px-2 sm:px-6 pb-7">
          {viewMode === 'grid' ? (
            <DataGrid columns={columns} serverSide onFetchData={handleGetVehicles} />
          ) : (
            <div className="w-full">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {vehicles?.data.map(
                  (vehicle) =>
                    vehicle && (
                      <VehicleCard
                        key={vehicle.vehicle.plate}
                        vehicle={vehicle}
                        handleViewVehicle={handleViewVehicleClick}
                      />
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VehicleCard({
  vehicle,
  handleViewVehicle
}: {
  vehicle: VehicleDetails;
  handleViewVehicle: () => void;
}) {
  return (
    <div className="flex flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] w-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col gap-5 px-4 sm:px-6 lg:px-8 py-6 grow">
        <div className="flex justify-between items-center">
          <CarPlate plate={vehicle.vehicle.plate} />
          <StatusDropdown<VehicleStatusValues>
            selected={vehicle.status}
            setSelected={() => {}}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[38px] sm:justify-between">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <Image
                src={vehicle.customer.avatar}
                alt={vehicle.customer.name}
                title={vehicle.customer.name}
                className="size-10 object-cover aspect-square"
                fallback={
                  <div className="bg-neutral-200 size-10 aspect-square rounded-full flex items-center justify-center">
                    <KeenIcon style="duotone" icon="user" className="text-black" />
                  </div>
                }
              />
              <div className="w-full sm:w-48 text-nowrap">
                <div className="text-[#3F4254] font-bold text-[15px] text-ellipsis overflow-hidden">
                  {vehicle.customer.name}
                </div>
                <div className="text-[#B5B5C3] font-medium text-2sm text-ellipsis overflow-hidden">
                  {vehicle.customer.email}
                </div>
              </div>
            </div>
          </div>
          <Image
            src={vehicle.brandName}
            alt={vehicle.brandName}
            title={vehicle.brandName}
            className="size-10 object-cover aspect-square"
            fallback={
              <div className="bg-neutral-200 size-10 aspect-square rounded-full flex items-center justify-center">
                <KeenIcon style="duotone" icon="car" className="text-black" />
              </div>
            }
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div className="flex flex-wrap gap-4 sm:gap-[18px] text-[#72767C] font-dm-sans">
            <div className="flex gap-1">
              <img src={toAbsoluteUrl('/media/icons/gauge.svg')} />
              <span className="uppercase">{vehicle.mileage}</span>
            </div>
            <div className="flex gap-1">
              <img src={toAbsoluteUrl('/media/icons/manual.svg')} />
              <span>{vehicle.type}</span>
            </div>
          </div>
          <div className="text-md capitalize font-semibold text-[#3F4254] max-w-full sm:max-w-[92px] text-ellipsis overflow-hidden text-nowrap">
            {vehicle.brandName}
          </div>
        </div>
      </div>
      <div className="text-xs border-t grid grid-cols-4 w-full overflow-hidden rounded-b-2xl">
        <a
          href="#"
          onClick={handleViewVehicle}
          className="px-5 py-2 flex gap-2 border-e justify-center hover:bg-gray-50"
        >
          <img src={toAbsoluteUrl('/media/icons/view-light.svg')} />
          <span>View</span>
        </a>
        <a href="#" className="px-5 py-2 border-e justify-center flex gap-2 hover:bg-gray-50">
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>Edit</span>
        </a>
        <a href="#" className="px-5 py-2 border-e justify-center flex gap-2 hover:bg-gray-50">
          <img src={toAbsoluteUrl('/media/icons/rent-light.svg')} />
          <span>Rent</span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 justify-center hover:bg-gray-50">
          <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
          <span>Delete</span>
        </a>
      </div>
    </div>
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

export { VehicleList };
