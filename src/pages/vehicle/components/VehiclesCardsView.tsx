import { getVehicles, updateVehicleStatus, VehicleDetails, VehicleStatusValues } from '@/api/cars';
import { KeenIcon } from '@/components';
import Image from '@/components/image/Image';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { toAbsoluteUrl } from '@/utils';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { StatusDropdown } from '../StatusDropdown';
import { STATUS_OPTIONS } from '../constants';

type VehiclesCardsViewProps = {
  searchQuery: string;
  refetchStats: () => void;
};

const PAGE_SIZE = 10;

export default function VehiclesCardsView({ searchQuery, refetchStats }: VehiclesCardsViewProps) {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleDetails[]>();
  const handleViewVehicle = () => {
    navigate('view-vehicle');
  };

  const handleGetVehicles = async (searchQuery?: string) => {
    const vehicles = await getVehicles({
      pageIndex: 0,
      pageSize: PAGE_SIZE,
      filters: searchQuery?.trim().length ? [{ id: '__any', value: searchQuery }] : []
    });

    setVehicles(vehicles.data);
  };

  useEffect(() => {
    handleGetVehicles(searchQuery);
  }, [searchQuery]);

  return (
    <div className="w-full">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {vehicles?.map(
          (vehicle) =>
            vehicle && (
              <VehicleCard
                key={vehicle.vehicle.plate}
                vehicle={vehicle}
                handleViewVehicle={handleViewVehicle}
                refetchStats={refetchStats}
                refetchVehicles={handleGetVehicles}
              />
            )
        )}
      </div>
    </div>
  );
}

type VehicleCardProps = {
  vehicle: VehicleDetails;
  handleViewVehicle: () => void;
  refetchVehicles: () => void;
  refetchStats: () => void;
};

function VehicleCard({
  vehicle,
  handleViewVehicle,
  refetchStats,
  refetchVehicles
}: VehicleCardProps) {
  return (
    <div className="flex flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] w-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col gap-5 px-4 sm:px-6 lg:px-8 py-6 grow">
        <div className="flex justify-between items-center">
          <CarPlate plate={vehicle.vehicle.plate} />
          <StatusDropdown<VehicleStatusValues>
            selected={vehicle.status}
            setSelected={async (value) => {
              await updateVehicleStatus(vehicle.vehicle.id, value);
              refetchVehicles();
              refetchStats();
            }}
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
