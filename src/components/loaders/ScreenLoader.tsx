import { toAbsoluteUrl } from '@/utils';
import { FormattedMessage } from 'react-intl';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out">
      <img
        className="h-[30px] max-w-none"
        src={toAbsoluteUrl('/media/app/mini-logo.svg')}
        alt="logo"
      />
      <div className="text-gray-500 font-medium text-sm">
        <FormattedMessage id="COMMON.LOADING" />
      </div>
    </div>
  );
};

export { ScreenLoader };
