import { VehicleDetails } from '@/api/cars';
import { StatusDropdown } from '../StatusDropdown';
import { CarPlate } from '../CarPlate';
import { toAbsoluteUrl } from '@/utils';

export default function VehicleCard({ vehicle }: { vehicle?: VehicleDetails }) {
  if (!vehicle) {
    return (
      <div className="flex hover:shadow-md h-full w-full flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] dark:border-gray-200 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: '#212121' }} />
      </div>
    );
  }
  return (
    <div className=" hover:shadow-md card h-full w-full flex flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] dark:border-gray-200">
      <div className="flex flex-col grow gap-5 px-8 py-6">
        <div className="flex justify-between items-center">
          <CarPlate plate={vehicle.vehicle.plate} />
          <StatusDropdown
            selected={vehicle.status}
            setSelected={() => {}}
            options={{
              Unavailable: {
                color: '#F1416C',
                backgroundColor: '#FFF5F8'
              },
              Maintenance: {
                color: '#FFA800',
                backgroundColor: '#FFF8EA'
              },
              Available: {
                color: '#50CD89',
                backgroundColor: '#EEFAF4'
              }
            }}
          />
        </div>
        <div className="flex gap-[38px] justify-between">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <img
                src={
                  vehicle.customer.avatar || toAbsoluteUrl('/media/avatars/avatar-placeholder.png')
                }
                className="size-12 rounded-[4px]"
              />
              <div className="w-48 text-nowrap">
                <div className="text-[#3F4254] dark:text-gray-50 font-bold text-[15px] text-ellipsis overflow-hidden">
                  {vehicle.customer.name}
                </div>
              </div>
            </div>
          </div>
          <img
            src={vehicle.vehicle.brandImage}
            className="size-9 aspect-square object-cover mr-0.5"
          />
        </div>
        <div className="flex justify-between items-end gap-4">
          <div className="flex gap-[18px] text-[#72767C] font-dm-sans">
            <div className="flex gap-1">
              <img src={toAbsoluteUrl('/media/icons/gauge.svg')} />
              <span>{vehicle.mileage} KM</span>
            </div>
            <div className="flex gap-1">
              <img src={toAbsoluteUrl('/media/icons/manual.svg')} />
              <span>{vehicle.type}</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-[#3F4254] max-w-[92px] text-ellipsis overflow-hidden text-nowrap">
            {vehicle.brandName}
          </div>
        </div>
      </div>
      <div className="text-xs border-t flex justify-center">
        <a href="#" className="px-5 py-2 flex gap-2">
          <img src={toAbsoluteUrl('/media/icons/view-light.svg')} />
          <span>View</span>
        </a>
        <a href="#" className="px-5 py-2 border-x flex gap-2">
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>Edit</span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2">
          <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
          <span>Delete</span>
        </a>
      </div>
    </div>
  );
}
