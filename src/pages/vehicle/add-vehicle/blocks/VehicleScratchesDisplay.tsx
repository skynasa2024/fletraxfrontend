import { toAbsoluteUrl } from '@/utils';
import ScratchesPopover from '../../vehicle-details/components/ScratchesPopover';

export default function VehicleScratchesDisplay({ vehicleId }: { vehicleId?: string }) {

  
  return (
    <div className="relative flex p-4 justify-center items-center col-span-full mb-4">
      <img src={toAbsoluteUrl('/media/images/car.png')} alt="Car" />
      {/* Corners */}
      <div className="absolute top-10 left-[225px] w-20 h-32 border-t-2 border-l-2 border-info rounded-tl-full " />
      <div className="absolute top-10 right-[225px] w-20 h-32 border-t-2 border-r-2 border-info rounded-tr-full" />
      <div className="absolute bottom-10 left-[225px] w-20 h-32 border-b-2 border-l-2 border-info rounded-bl-full" />
      <div className="absolute bottom-10 right-[225px] w-20 h-32 border-b-2 border-r-2 border-info rounded-br-full" />
      {/* Top row */}
      <ScratchesPopover className="absolute top-3 left-1/3 -translate-x-1/2 border hover:shadow-md bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute top-0 left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute top-3 right-1/3 translate-x-1/2 border hover:shadow-md bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center" />
      {/* Middle top row */}
      <ScratchesPopover className="absolute top-1/4 left-1/4 border hover:shadow-md text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute top-1/4 left-1/2 -translate-x-1/2 border hover:shadow-md text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute top-1/4 right-1/4 border hover:shadow-md text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
      {/* Middle bottom row */}
      <ScratchesPopover className="absolute bottom-1/4 left-1/4 border hover:shadow-md text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute bottom-1/4 left-1/2 -translate-x-1/2 border hover:shadow-md text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute bottom-1/4 right-1/4 border hover:shadow-md text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
      {/* Bottom row */}
      <ScratchesPopover className="absolute bottom-7 left-1/3 -translate-x-1/2 border bg-gray-100 hover:shadow-md text-gray-600 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute bottom-4 left-1/2 -translate-x-1/2 border bg-gray-100 hover:shadow-md text-gray-600 rounded-full w-8 h-8 flex items-center justify-center" />
      <ScratchesPopover className="absolute bottom-7 right-1/3 translate-x-1/2 border bg-gray-100 hover:shadow-md text-gray-600 rounded-full w-8 h-8 flex items-center justify-center" />
    </div>
  );
}
