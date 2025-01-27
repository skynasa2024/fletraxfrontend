import { DefaultTooltip } from '@/components';
import clsx from 'clsx';

export interface CarPlateProps {
  plate: string;
  className?: string;
  showTooltip?: boolean;
}

export const CarPlate = ({ plate, className, showTooltip = true }: CarPlateProps) => {
  return (
    <div className={clsx('flex font-medium w-full', className)}>
      <div className="flex items-center justify-center rounded-s-lg py-2 px-2 bg-[#5271FF] text-white">
        TR
      </div>
      <DefaultTooltip title={plate} placement="right" open={!showTooltip ? false : undefined}>
        <div className="max-w-28 truncate rounded-e-lg py-2 px-4 text-gray-700 font-semibold border-e border-t border-b border-[#F1F1F4] bg-white dark:bg-black dark:border-gray-200 dark:text-gray-50 text-nowrap">
          {plate}
        </div>
      </DefaultTooltip>
    </div>
  );
};
