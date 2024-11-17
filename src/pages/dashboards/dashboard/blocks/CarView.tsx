import { Vehicle } from '@/api/cars';

export interface CarViewProps {
  vehicle: Vehicle;
}

export const CarView = ({ vehicle }: CarViewProps) => {
  return (
    <div className="flex flex-col gap-1 px-2">
      <div className="flex gap-2 items-center">
        <img src={vehicle.brandImage} className="size-9 object-cover" />
        <div className="flex font-medium">
          <div className="rounded-s-lg py-3 px-2 bg-[#5271FF] text-white">TR</div>
          <div className="rounded-e-lg py-3 px-6 text-gray-700 border-e border-t border-b border-[#F1F1F4]">
            {vehicle.plate}
          </div>
        </div>
      </div>
      <div className="text-gray-600 text-2sm">{vehicle.imei}</div>
    </div>
  );
};
