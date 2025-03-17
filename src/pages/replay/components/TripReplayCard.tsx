import { ReplayDTO } from '@/api/replay';
import { useReplayContext } from '../providers/ReplayContext';
import { formatInTimeZone } from 'date-fns-tz';
import { useAuthContext } from '@/auth';
import clsx from 'clsx';
import { HalfCircleProgressBar } from '@/components';

type TripReplayCardProps = {
  trip: ReplayDTO;
};

export default function TripReplayCard({ trip }: TripReplayCardProps) {
  const { selectedTrip, setSelectedTrip } = useReplayContext();
  const { currentUser } = useAuthContext();

  // Safely get timezone with fallback
  const timezone = currentUser?.timezone || 'UTC';

  const handleSelectTrip = () => {
    setSelectedTrip(selectedTrip?.id === trip.id ? undefined : trip);
  };

  return (
    <div
      key={trip.id}
      data-selected={selectedTrip?.id === trip.id}
      className={clsx(
        'rounded-lg border py-2 px-3 h-full flex justify-center items-center cursor-pointer',
        selectedTrip?.id === trip.id
          ? 'border-green-500 bg-green-100'
          : 'border-green-100 bg-green-50'
      )}
      onClick={handleSelectTrip}
      onKeyDown={(e) => e.key === 'Enter' && handleSelectTrip()}
      tabIndex={0}
      role="button"
      aria-pressed={selectedTrip?.id === trip.id}
    >
      <div className="grid items-center grid-cols-4 gap-2">
        <div className="flex gap-1 items-center text-sm">{trip.totalDistance.toFixed(2)} KM</div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            {formatInTimeZone(new Date(trip.startTime * 1000), timezone, 'yyyy/MM/dd')}
          </div>
          <div className="text-xs text-gray-600">
            {formatInTimeZone(new Date(trip.startTime * 1000), timezone, 'HH:mm:ss')}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            {formatInTimeZone(new Date(trip.endTime * 1000), timezone, 'yyyy/MM/dd')}
          </div>
          <div className="text-xs text-gray-600">
            {formatInTimeZone(new Date(trip.endTime * 1000), timezone, 'HH:mm:ss')}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <HalfCircleProgressBar
            value={trip.maxSpeed}
            maxValue={160}
            unit="Km/h"
            animated={false}
          />
        </div>
      </div>
    </div>
  );
}
