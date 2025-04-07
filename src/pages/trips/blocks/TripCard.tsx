import React, { useMemo } from 'react';
import { formatRelative } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { toAbsoluteUrl } from '@/utils';
import { IntervalType, TripGroup } from '@/api/trips';
import { enGB, ar, tr } from 'date-fns/locale';
import { Collapse } from '@mui/material';
import { KeenIcon } from '@/components';
import { useTripsContext } from '../providers/TripsContext';
import { useAnimationContext } from '../providers/AnimationContext';
import { useAuthContext } from '@/auth';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLanguage } from '@/i18n';
import clsx from 'clsx';

function formatTotalDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours} h , ${minutes} min , ${secs} sec`;
}

interface TripCardProps {
  tripGroup: TripGroup;
  animation?: boolean;
}

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

const TripCard: React.FC<TripCardProps> = ({ tripGroup, animation = true }) => {
  const { intervalType } = useTripsContext();
  const intl = useIntl();
  const locale = useMemo(() => getLocaleConfig(intl), [intl]);
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const { setSelectedTrip, selectedTrip } = useTripsContext();
  const { play, playing, stop } = useAnimationContext();
  const { currentUser } = useAuthContext();

  return (
    <div
      className="flex flex-col gap-2 mb-2.5 rounded-[10px] border-2 border-[#E7E8ED] dark:border-gray-200 overflow-hidden data-[selected=true]:border-[#5271FF] shrink-0"
      data-selected={selectedTrip === tripGroup}
    >
      <div
        onClick={() => {
          setSelectedTrip(selectedTrip === tripGroup ? undefined : tripGroup);
          stop();
        }}
        className="flex flex-col gap-2"
        style={{ direction: isRTL() ? 'rtl' : 'ltr' }}
      >
        <div className="grid grid-cols-3 px-[6px] items-center border-b-2 border-dashed py-2">
          <div className="text-xs font-semibold text-[#3F4254] dark:text-gray-50">
            {formatRelative(tripGroup.date, new Date(), { locale })}
          </div>
          <div className="text-xs font-semibold text-[#3F4254] dark:text-gray-50 mx-auto">
            <FormattedMessage
              id={intervalType === IntervalType.Parking ? 'PARKINGS.COUNT' : 'TRIPS.COUNT'}
              values={{ count: tripGroup.trips.length }}
            />
          </div>
          {animation && (
            <div
              className="cursor-pointer ms-auto"
              style={{
                transform: isRTL() ? 'scaleX(-1)' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                stop();
                if (playing && selectedTrip === tripGroup) {
                  return;
                }
                setSelectedTrip(tripGroup);
                play();
              }}
            >
              <img
                src={toAbsoluteUrl(
                  `/media/icons/${playing && selectedTrip === tripGroup ? 'start-green' : 'start'}.svg`
                )}
                className="dark:hidden"
              />
              <img
                src={toAbsoluteUrl(
                  `/media/icons/${playing && selectedTrip === tripGroup ? 'start-green' : 'start-dark'}.svg`
                )}
                className="light:hidden"
              />
            </div>
          )}
        </div>
        <div
          className={clsx('grid px-[6px] gap-2 relative', {
            'grid-cols-3': intervalType === IntervalType.Trip,
            'grid-cols-2': intervalType === IntervalType.Parking
          })}
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
              <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                <FormattedMessage id="TRIPS.FIELD.START_DATE" />
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {formatInTimeZone(
                new Date(+tripGroup.trips[0].startDate * 1000),
                currentUser!.timezone,
                'yyyy/MM/dd'
              )}
            </div>
          </div>
          {intervalType === IntervalType.Parking && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} />
                <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                  <FormattedMessage id="TRIPS.FIELD.TOTAL_DURATION" />
                </span>
              </div>
              <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
                {formatTotalDuration(
                  tripGroup.trips.reduce((acc, trip) => acc + trip.totalDuration, 0)
                )}
              </div>
            </div>
          )}
          {intervalType === IntervalType.Trip && (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                  <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
                  <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                    <FormattedMessage id="TRIPS.FIELD.MILEAGE" />
                  </span>
                </div>
                <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
                  {tripGroup.trips.reduce((acc, trip) => acc + trip.mileage, 0).toFixed(2)} KM
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
            </>
          )}
          <div
            className="flex items-center justify-center absolute top-0 right-0 bottom-0 cursor-pointer w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
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
                data-selected={selectedTrip === trip}
                className="rounded-[10px] bg-white border border-[#E7E8ED] dark:bg-black dark:border-gray-200 py-2 px-1 data-[selected=true]:border-[#5271FF]"
                onClick={() => {
                  stop();
                  setSelectedTrip(selectedTrip === trip ? undefined : trip);
                }}
              >
                <div className="flex gap-2 justify-between items-center border-b-2 border-dashed py-2 px-1">
                  <div className="text-xs text-[#3F4254] dark:text-gray-50 font-semibold">
                    {idx + 1}
                  </div>
                  {intervalType === IntervalType.Trip && (
                    <>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.START_DATE" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {formatInTimeZone(
                            new Date(+trip.startDate * 1000),
                            currentUser!.timezone,
                            'yyyy/MM/dd | HH:mm:ss'
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/destination.svg')} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.END_DATE" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {formatInTimeZone(
                            new Date(+trip.endDate * 1000),
                            currentUser!.timezone,
                            'yyyy/MM/dd | HH:mm:ss'
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {animation && (
                    <div
                      className="cursor-pointer"
                      style={{
                        transform: isRTL() ? 'scaleX(-1)' : 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        stop();
                        if (playing && selectedTrip === trip) {
                          return;
                        }
                        setSelectedTrip(trip);
                        play();
                      }}
                    >
                      <img
                        src={toAbsoluteUrl(
                          `/media/icons/${playing && selectedTrip === trip ? 'start-green' : 'start'}.svg`
                        )}
                        className="dark:hidden"
                      />
                      <img
                        src={toAbsoluteUrl(
                          `/media/icons/${playing && selectedTrip === trip ? 'start-green' : 'start-dark'}.svg`
                        )}
                        className="light:hidden"
                      />
                    </div>
                  )}
                </div>
                <div
                  className={clsx('grid gap-2.5 p-2', {
                    'grid-cols-3': intervalType === IntervalType.Trip,
                    'grid-cols-4': intervalType === IntervalType.Parking
                  })}
                >
                  {intervalType === IntervalType.Parking && (
                    <>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.START_DATE" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {formatInTimeZone(
                            new Date(+trip.startDate * 1000),
                            currentUser!.timezone,
                            'yyyy/MM/dd HH:mm:ss'
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/destination.svg')} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.END_DATE" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {formatInTimeZone(
                            new Date(+trip.endDate * 1000),
                            currentUser!.timezone,
                            'yyyy/MM/dd HH:mm:ss'
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl(`/media/icons/clock.svg`)} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.TOTAL_DURATION" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {trip.formattedTotalDuration}
                        </div>
                      </div>
                    </>
                  )}
                  {intervalType === IntervalType.Trip && (
                    <>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.MILEAGE" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {trip.mileage.toFixed(2)} KM
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                          <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} />
                          <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                            <FormattedMessage id="TRIPS.FIELD.MAX_SPEED" />
                          </span>
                        </div>
                        <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                          {trip.maxSpeed.toFixed(0)} Km/h
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1 items-center">
                      <img src={toAbsoluteUrl('/media/icons/clock.svg')} />
                      <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                        <FormattedMessage id="TRIPS.TOTAL_IDLING" />
                      </span>
                    </div>
                    <div className="font-semibold text-[#2D3748] dark:text-gray-900">
                      {trip.totalIdling ? formatTotalDuration(trip.totalIdling) : 'NA'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
        <div
          className="flex justify-center py-2 cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <KeenIcon icon={isOpen ? 'up' : 'down'} className="dark:text-[#F5F5FC]" />
        </div>
      </div>
    </div>
  );
};

export default TripCard;
