import { DefaultTooltip } from '@/components';

export interface CarPlateProps {
  plate: string;
}

export const CarPlate = ({ plate }: CarPlateProps) => {
  return (
    <div className="flex font-medium w-full">
      <div className="flex items-center justify-center rounded-s-lg py-2 px-2 bg-[#5271FF] text-white">
        TR
      </div>
      <DefaultTooltip title={plate} placement="right">
        <div className="max-w-28 truncate rounded-e-lg py-2 px-4 text-gray-700 font-semibold border-e border-t border-b border-[#F1F1F4] bg-white dark:bg-black dark:border-gray-200 dark:text-gray-50 text-nowrap">
          {plate}
        </div>
      </DefaultTooltip>
    </div>
  );
};
