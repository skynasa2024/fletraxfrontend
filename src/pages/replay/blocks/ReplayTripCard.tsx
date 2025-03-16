import React, { useMemo, useState } from 'react';
import { formatRelative } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { toAbsoluteUrl } from '@/utils';
import { TripRecord } from '@/api/replay';
import { enGB, ar, tr } from 'date-fns/locale';
import { Collapse } from '@mui/material';
import { KeenIcon } from '@/components';
import { useReplayContext } from '../providers/ReplayContext';
import { useReplayAnimationContext } from '../providers/ReplayAnimationContext';
import { useAuthContext } from '@/auth';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLanguage } from '@/i18n';

const getLocaleConfig = (intl: ReturnType<typeof useIntl>) => {
  const formatRelativeLocale: Record<string, string> = {
    lastWeek: 'eeee',
    yesterday: intl.formatMessage({ id: 'DATE.YESTERDAY' }),
    today: intl.formatMessage({ id: 'DATE.TODAY' }),
    tomorrow: intl.formatMessage({ id: 'DATE.TOMORROW' }),
    nextWeek: `'${intl.formatMessage({ id: 'DATE.NEXT' })}' eeee`,
    other: 'dd/MM/yyyy'
  };

  const locale = intl.locale === 'en' ? enGB : intl.locale === 'tr' ? tr : ar;

  return {
    ...locale,
    formatRelative: (token: string) => formatRelativeLocale[token]
  };
};

interface ReplayTripCardProps {
  trips: TripRecord[];
}

const ReplayTripCard: React.FC<ReplayTripCardProps> = ({ trips }) => {
  const intl = useIntl();
  const locale = useMemo(() => getLocaleConfig(intl), [intl]);
  const { isRTL } = useLanguage();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const { selectedTrip, setSelectedTrip } = useReplayContext();
  const { play, playing, stop } = useReplayAnimationContext();
  const { currentUser } = useAuthContext();

  // Group trips by date
  const tripsByDate = useMemo(() => {
    const grouped: Record<string, TripRecord[]> = {};

    trips.forEach((trip) => {
      const date = new Date(trip.startTime * 1000);
      const dateStr = date.toISOString().split('T')[0];

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }

      grouped[dateStr].push(trip);
    });

    return Object.entries(grouped).map(([dateStr, dayTrips]) => ({
      date: new Date(dateStr),
      trips: dayTrips
    }));
  }, [trips]);

  if (tripsByDate.length === 0) {
    return null;
  }

  const toggleOpen = (dateStr: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[60vh] md:w-[411px]">
      {tripsByDate.map((tripGroup) => {
        const dateStr = tripGroup.date.toISOString();
        const isOpen = openStates[dateStr] || false;

        return (
          <div
            key={dateStr}
            className="flex flex-col gap-2 mb-2.5 rounded-[10px] border-2 border-[#E7E8ED] dark:border-gray-200 overflow-hidden shrink-0"
          >
            <div className="flex flex-col gap-2" style={{ direction: isRTL() ? 'rtl' : 'ltr' }}>
              <div className="grid grid-cols-3 px-[6px] items-center border-b-2 border-dashed py-2">
                <div className="text-xs font-semibold text-[#3F4254] dark:text-gray-50">
                  {formatRelative(tripGroup.date, new Date(), { locale })}
                </div>
                <div className="text-xs font-semibold text-[#3F4254] dark:text-gray-50 mx-auto">
                  <FormattedMessage id="TRIPS.COUNT" values={{ count: tripGroup.trips.length }} />
                </div>
              </div>
              <div className="grid grid-cols-3 px-[6px] gap-2 relative">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
                    <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                      <FormattedMessage id="TRIPS.FIELD.START_DATE" />
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
                    {formatInTimeZone(
                      new Date(tripGroup.trips[0].startTime * 1000),
                      currentUser!.timezone,
                      'yyyy/MM/dd'
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
                    <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                      <FormattedMessage id="TRIPS.FIELD.MILEAGE" />
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
                    {tripGroup.trips.reduce((acc, trip) => acc + trip.totalDistance, 0).toFixed(2)}{' '}
                    KM
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} />
                    <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                      <FormattedMessage id="TRIPS.FIELD.MAX_SPEED" />
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
                    {tripGroup.trips
                      .reduce((acc, trip) => Math.max(acc, trip.maxSpeed), 0)
                      .toFixed(0)}{' '}
                    Km/h
                  </div>
                </div>
                <div
                  className="flex items-center justify-center absolute top-0 right-0 bottom-0 cursor-pointer w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOpen(dateStr);
                  }}
                >
                  <KeenIcon icon={isOpen ? 'up' : 'down'} className="dark:text-[#F5F5FC]" />
                </div>
              </div>
            </div>
            <div className="bg-[#F5F5FC] dark:bg-gray-200 px-[6px]">
              <Collapse in={isOpen}>
                <div className="flex flex-col gap-1 py-[10px] font-medium text-[10px] text-[#0F0F0F] dark:text-gray-50">
                  {tripGroup.trips.map((trip, idx) => (
                    <div
                      key={trip.id}
                      data-selected={selectedTrip?.id === trip.id}
                      className="rounded-[10px] bg-white border border-[#E7E8ED] dark:bg-black dark:border-gray-200 py-2 px-1 data-[selected=true]:border-[#5271FF]"
                      onClick={() => {
                        stop();
                        setSelectedTrip(selectedTrip?.id === trip.id ? undefined : trip);
                      }}
                    >
                      <div className="flex justify-between border-b-2 border-dashed py-1">
                        <div className="text-xs text-[#3F4254] dark:text-gray-50 font-semibold">
                          {idx + 1}
                        </div>
                        <div
                          className="cursor-pointer"
                          style={{
                            transform: isRTL() ? 'scaleX(-1)' : 'none'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            stop();
                            if (playing && selectedTrip?.id === trip.id) {
                              return;
                            }
                            setSelectedTrip(trip);
                            play();
                          }}
                        >
                          <img
                            src={toAbsoluteUrl(
                              `/media/icons/${playing && selectedTrip?.id === trip.id ? 'start-green' : 'start'}.svg`
                            )}
                            className="dark:hidden"
                          />
                          <img
                            src={toAbsoluteUrl(
                              `/media/icons/${playing && selectedTrip?.id === trip.id ? 'start-green' : 'start-dark'}.svg`
                            )}
                            className="light:hidden"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
                          {formatInTimeZone(
                            new Date(trip.startTime * 1000),
                            currentUser!.timezone,
                            'yyyy/MM/dd HH:mm:ss'
                          )}
                        </div>
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/destination.svg')} />
                          {formatInTimeZone(
                            new Date(trip.endTime * 1000),
                            currentUser!.timezone,
                            'yyyy/MM/dd HH:mm:ss'
                          )}
                        </div>
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
                          {trip.totalDistance.toFixed(2)} KM
                        </div>
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} />
                          {trip.maxSpeed.toFixed(0)} Km/h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Collapse>
              <div
                className="flex justify-center py-2 cursor-pointer"
                onClick={() => {
                  toggleOpen(dateStr);
                }}
              >
                <KeenIcon icon={isOpen ? 'up' : 'down'} className="dark:text-[#F5F5FC]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReplayTripCard;
