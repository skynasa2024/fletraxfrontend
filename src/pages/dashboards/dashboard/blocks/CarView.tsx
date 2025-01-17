import { Vehicle } from '@/api/cars';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import Image from '@/components/image/Image';
import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';

export interface CarViewProps {
  vehicle: Vehicle;
}

export const CarView = ({ vehicle }: CarViewProps) => {
  return (
    <div className="flex flex-col gap-1 px-2">
      <div className="flex gap-2 items-center">
        <Image
          src={vehicle.brandImage}
          alt={vehicle.name}
          title={vehicle.name}
          className="size-9 object-cover aspect-square"
          fallback={
            <div className="bg-neutral-200 size-9 aspect-square rounded-full flex items-center justify-center">
              <KeenIcon style="duotone" icon="car" className="text-black" />
            </div>
          }
        />
        <CarPlate plate={vehicle.plate} />
      </div>
      <div className="text-gray-600 text-2sm">{vehicle.imei}</div>
    </div>
  );
};
