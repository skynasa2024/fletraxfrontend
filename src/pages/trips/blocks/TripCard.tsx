import React from 'react';
import { format, formatRelative } from 'date-fns';
import { toAbsoluteUrl } from '@/utils';
import { TripGroup } from '@/api/trips';
import { enGB } from 'date-fns/locale/en-GB';
import { Collapse } from '@mui/material';
import { KeenIcon } from '@/components';
import { useTripsContext } from '../providers/TripsContext';
import { useAnimationContext } from '../providers/AnimationContext';

interface TripCardProps {
  tripGroup: TripGroup;
}

const formatRelativeLocale: Record<string, string> = {
  lastWeek: 'eeee',
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'Next' eeee",
  other: 'dd/MM/yyyy'
};

const locale = {
  ...enGB,
  formatRelative: (token: string) => formatRelativeLocale[token]
};

const TripCard: React.FC<TripCardProps> = ({ tripGroup }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setSelectedTrip, selectedTrip } = useTripsContext();
  const { play, playing, stop } = useAnimationContext();

  return (
    <div
      className="flex flex-col gap-2 rounded-[10px] border-2 border-[#E7E8ED] dark:border-gray-200 overflow-hidden data-[selected=true]:border-[#5271FF] shrink-0"
      data-selected={selectedTrip === tripGroup}
    >
      <div
        onClick={() => {
          setSelectedTrip(selectedTrip === tripGroup ? undefined : tripGroup);
          stop();
        }}
        className="flex flex-col gap-2"
      >
        <div className="grid grid-cols-3 px-[6px] items-center border-b-2 border-dashed py-2">
          <div className="text-xs font-semibold text-[#3F4254] dark:text-gray-50">
            {formatRelative(tripGroup.date, new Date(), { locale })}
          </div>
          <div className="text-xs font-semibold text-[#3F4254] dark:text-gray-50 mx-auto">
            <span>{tripGroup.trips.length} </span>
            <span className="font-normal">Trips</span>
          </div>
          <div
            className="cursor-pointer ms-auto"
            onClick={(e) => {
              e.stopPropagation();
              console.log(playing, selectedTrip, tripGroup);
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
        </div>
        <div className="grid grid-cols-3 px-[6px] gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
              <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                Start Date
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {format(tripGroup.trips[0].startDate, 'yyyy/MM/dd')}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
              <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                Mileage
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
                Max Speed
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {tripGroup.trips.reduce((acc, trip) => Math.max(acc, trip.maxSpeed), 0).toFixed(0)}{' '}
              Km/h
            </div>
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
                <div className="flex justify-between border-b-2 border-dashed py-1">
                  <div className="text-xs text-[#3F4254] dark:text-gray-50 font-semibold">
                    {idx + 1}
                  </div>
                  <div
                    className="cursor-pointer"
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
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex gap-1 items-center">
                    <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
                    {format(trip.startDate, 'yyyy/MM/dd HH:mm:ss')}
                  </div>
                  <div className="flex gap-1 items-center">
                    <img src={toAbsoluteUrl('/media/icons/destination.svg')} />
                    {format(trip.endDate, 'yyyy/MM/dd HH:mm:ss')}
                  </div>
                  <div className="flex gap-1 items-center">
                    <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
                    {trip.mileage.toFixed(2)} KM
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
