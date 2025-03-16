import { toAbsoluteUrl } from '@/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { FormattedMessage } from 'react-intl';
import { useLanguage } from '@/i18n';
import { useAuthContext } from '@/auth';
import clsx from 'clsx';
import { ParkingRecord } from '@/api/replay';
import { Popup } from 'react-leaflet';

interface ParkingPopupProps {
  parking: ParkingRecord;
}

export const ParkingPopup = ({ parking }: ParkingPopupProps) => {
  const { currentUser } = useAuthContext();
  const { isRTL } = useLanguage();

  return (
    <Popup>
      <div className="min-w-36 flex flex-col gap-2">
        <div className={clsx('flex gap-1 items-center', { 'flex-row-reverse': isRTL() })}>
          <img src={toAbsoluteUrl(`/media/icons/flag.svg`)} className="size-[21px]" />
          <div
            className={clsx('font-semibold flex flex-col', {
              'items-start': !isRTL(),
              'items-end': isRTL()
            })}
          >
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="REPLAY.PARKING.START_TIME" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {formatInTimeZone(
                new Date(parking.startTime),
                currentUser!.timezone,
                'yyyy/MM/dd HH:mm:ss'
              )}
            </div>
          </div>
        </div>
        <div className={clsx('flex gap-1 items-center', { 'flex-row-reverse': isRTL() })}>
          <img src={toAbsoluteUrl(`/media/icons/destination.svg`)} className="size-[21px]" />
          <div
            className={clsx('font-semibold flex flex-col', {
              'items-start': !isRTL(),
              'items-end': isRTL()
            })}
          >
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="REPLAY.PARKING.END_TIME" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">
              {formatInTimeZone(
                new Date(parking.endTime),
                currentUser!.timezone,
                'yyyy/MM/dd HH:mm:ss'
              )}
            </div>
          </div>
        </div>
        <div className={clsx('flex gap-1 items-center', { 'flex-row-reverse': isRTL() })}>
          <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} className="size-[21px]" />
          <div
            className={clsx('font-semibold flex flex-col', {
              'items-start': !isRTL(),
              'items-end': isRTL()
            })}
          >
            <div className="text-[#A1A5B7] text-[10px]">
              <FormattedMessage id="REPLAY.PARKING.DURATION" />
            </div>
            <div className="text-[#2D3748] dark:text-gray-50 text-xs">{parking.totalDuration}</div>
          </div>
        </div>
      </div>
    </Popup>
  );
};
