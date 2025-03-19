import { ReplayDTO } from '@/api/replay';
import { useReplayContext } from '../providers/ReplayContext';
import { formatInTimeZone } from 'date-fns-tz';
import { useAuthContext } from '@/auth';
import clsx from 'clsx';
import { HalfCircleProgressBar } from '@/components';

type ParkingReplayCardProps = {
  parking: ReplayDTO;
};

export default function ParkingReplayCard({ parking }: ParkingReplayCardProps) {
  const { selectedTrip, setSelectedTrip } = useReplayContext();
  const { currentUser } = useAuthContext();

  const timezone = currentUser?.timezone || 'UTC';

  const handleSelectParking = () => {
    setSelectedTrip(selectedTrip?.id === parking.id ? undefined : parking);
  };

  return (
    <div
      key={parking.id}
      data-selected={selectedTrip?.id === parking.id}
      className={clsx(
        'rounded-lg border py-2 px-3 h-full flex justify-center items-center cursor-pointer',
        selectedTrip?.id === parking.id
          ? 'border-orange-500 bg-orange-100'
          : 'border-orange-100 bg-orange-50'
      )}
      onClick={handleSelectParking}
      onKeyDown={(e) => e.key === 'Enter' && handleSelectParking()}
      tabIndex={0}
      role="button"
      aria-pressed={selectedTrip?.id === parking.id}
    >
      <div className="grid items-center grid-cols-4 gap-1">
        <div className="flex gap-2 items-center">
          <div className="flex-col gap-2 items-center justify-center">
            <div className="flex gap-1 items-center text-sm">Parking</div>
            <div className="text-xs text-gray-600">{parking.formatedTotalDuration}</div>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <div className="size-4 rounded-full border-orange-500 bg-white border-4" />
            <div className="w-1 rounded-full h-14 bg-neutral-300/50 grow" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            {formatInTimeZone(new Date(parking.startTime * 1000), timezone, 'yyyy/MM/dd')}
          </div>
          <div className="text-xs text-gray-600">
            {formatInTimeZone(new Date(parking.startTime * 1000), timezone, 'HH:mm:ss')}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            {formatInTimeZone(new Date(parking.endTime * 1000), timezone, 'yyyy/MM/dd')}
          </div>
          <div className="text-xs text-gray-600">
            {formatInTimeZone(new Date(parking.endTime * 1000), timezone, 'HH:mm:ss')}
          </div>
        </div>
        {/* <div className="flex flex-col items-center justify-center hidden">
          <HalfCircleProgressBar value={0} maxValue={160} unit="Km/h" animated={false} />
        </div> */}
      </div>
    </div>
  );
}
