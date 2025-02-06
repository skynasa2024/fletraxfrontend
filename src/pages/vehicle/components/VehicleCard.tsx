import { deleteVehicle, updateVehicleStatus, VehicleDetails } from '@/api/cars';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { STATUS_OPTIONS } from '../constants';
import Image from '@/components/image/Image';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { StatusDropdown } from '@/pages/dashboards/dashboard/blocks/StatusDropdown';
import { Link } from 'react-router';

type VehicleCardProps = {
  vehicle?: VehicleDetails;
  refetchVehicles: () => void;
  refetchStats?: () => void;
};

export default function VehicleCard({ vehicle, refetchStats, refetchVehicles }: VehicleCardProps) {
  if (!vehicle) {
    return (
      <div className="m-2 flex hover:shadow-md h-full w-full flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] dark:border-gray-200 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: '#212121' }} />
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] w-full h-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 grow">
        <div className="flex justify-between items-center">
          <CarPlate plate={vehicle.vehicle.plate} />
          <StatusDropdown
            selected={vehicle.status}
            setSelected={async (value) => {
              await updateVehicleStatus(vehicle.carId, value);
              await refetchVehicles();
              refetchStats?.();
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
                  <div className="bg-neutral-200 size-10 aspect-square rounded-full overflow-hidden flex items-center justify-center">
                    <img src={toAbsoluteUrl('/media/avatars/avatar-placeholder.png')} />
                  </div>
                }
              />
              <div className="w-full sm:w-48 text-nowrap">
                <div className="text-[#3F4254] font-bold text-[15px] text-ellipsis overflow-hidden">
                  {vehicle.customer.name}
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
      <div className="text-xs border-t grid grid-cols-3 w-full overflow-hidden rounded-b-2xl">
        <Link
          to={'/vehicles/vehicle/' + vehicle.vehicle.id}
          className="px-5 py-2 flex gap-2 border-e justify-center hover:bg-gray-50"
        >
          <img src={toAbsoluteUrl('/media/icons/view-light.svg')} />
          <span>View</span>
        </Link>
        <Link
          to={'/vehicles/edit/' + vehicle.vehicle.id}
          className="px-5 py-2 border-e justify-center flex gap-2 hover:bg-gray-50"
        >
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>Edit</span>
        </Link>
        <a
          href="#"
          onClick={async (e) => {
            e.preventDefault();
            await deleteVehicle(vehicle.vehicle.id);
            refetchVehicles();
          }}
          className="px-5 py-2 flex gap-2 justify-center hover:bg-gray-50"
        >
          <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
          <span>Delete</span>
        </a>
      </div>
    </div>
  );
}
