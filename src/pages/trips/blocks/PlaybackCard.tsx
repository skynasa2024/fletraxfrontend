import 'react-resizable/css/styles.css';
import { Divider, Slider } from '@mui/material';
import { useAnimationContext } from '../providers/AnimationContext';
import { FaPause, FaPlay } from 'react-icons/fa';
import { PiFastForward } from 'react-icons/pi';
import { useAuthContext } from '@/auth';
import SpeedGauge from '@/pages/device/SpeedGuage';
import { useTripsContext } from '../providers/TripsContext';
import { toAbsoluteUrl } from '@/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { TripGroup } from '@/api/trips';

const MultiplierOptions = [0.25, 0.5, 1, 2, 3, 5, 10, 20];

export const PlaybackCard = () => {
  const {
    playing,
    play,
    pause,
    current,
    setCurrent,
    metaData,
    multiplier,
    setMultiplier,
    duration
  } = useAnimationContext();
  const { currentUser } = useAuthContext();
  const { selectedTrip } = useTripsContext();

  const handleIncreasePlayBackSpeed = () => {
    const currentIdx = MultiplierOptions.indexOf(multiplier);
    if (currentIdx < MultiplierOptions.length - 1) {
      const nextIdx = currentIdx + 1;
      setMultiplier(MultiplierOptions[nextIdx]);
    }
  };

  const handleDecreasePlayBackSpeed = () => {
    const currentIdx = MultiplierOptions.indexOf(multiplier);
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setMultiplier(MultiplierOptions[prevIdx]);
    }
  };

  console.log(selectedTrip);

  return (
    <div className="card w-[50vw] flex flex-row p-5 h-56">
      <div className="flex flex-col justify-between items-center grow w-1/2">
        <div className="flex gap-6 items-center p-4">
          <button
            className="btn btn-icon rounded-lg btn-info -scale-x-100 size-10"
            onClick={handleDecreasePlayBackSpeed}
            disabled={MultiplierOptions.indexOf(multiplier) === 0}
          >
            <PiFastForward size={22} />
          </button>

          <button
            className="btn btn-icon text-info bg-transparent size-10"
            onClick={() => {
              if (playing) {
                pause();
              } else {
                play();
              }
            }}
          >
            {playing ? <FaPause size={28} /> : <FaPlay size={28} />}
          </button>

          <button
            className="btn btn-icon rounded-lg btn-info size-10"
            onClick={handleIncreasePlayBackSpeed}
            disabled={MultiplierOptions.indexOf(multiplier) === MultiplierOptions.length - 1}
          >
            <PiFastForward size={22} />
          </button>

          <button className="btn btn-warning text-xs rounded-full p-4 size-9 flex justify-center items-center">
            x{multiplier}
          </button>
        </div>

        <Divider className="w-full !border-dashed" />

        <div className="grid grid-cols-3 gap-7">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
              <span className="text-[10px] font-medium text-[#5E6278] dark:text-gray-700">
                Start Date
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {selectedTrip &&
                formatInTimeZone(
                  new Date(
                    'trips' in selectedTrip
                      ? +(selectedTrip as TripGroup).trips[0].startDate * 1000
                      : +selectedTrip.startDate * 1000
                  ),
                  currentUser!.timezone,
                  'yyyy/MM/dd'
                )}
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
              {selectedTrip && 'trips' in selectedTrip
                ? selectedTrip.trips.reduce((acc, trip) => acc + trip.mileage, 0).toFixed(2)
                : selectedTrip?.mileage.toFixed(2)}{' '}
              KM
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
              {selectedTrip && 'trips' in selectedTrip
                ? selectedTrip.trips
                    .reduce((acc, trip) => Math.max(acc, trip.maxSpeed), 0)
                    .toFixed(0)
                : selectedTrip?.maxSpeed.toFixed(0)}{' '}
              Km/h
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <Divider orientation="vertical" className="!border-dashed" />
      </div>

      <div className="w-1/2 flex flex-col gap-4">
        <div className="flex flex-col gap-14 items-center justify-center">
          <div className="w-40">
            <SpeedGauge value={metaData.speed?.toFixed()} maxValue={160} unit="km" />
          </div>
          {metaData && (
            <div className="flex justify-between bg-gray-200 text-gray-600 font-semibold text-sm text-center py-1 px-2 rounded-md">
              <div>
                {new Date(metaData.timestamp).toLocaleString('en-UK', {
                  timeZone: currentUser?.timezone
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <div className="font-semibold text-xs text-[#2D3748] dark:text-gray-900">
            {selectedTrip &&
              formatInTimeZone(
                new Date(
                  'trips' in selectedTrip
                    ? +(selectedTrip as TripGroup).trips[0].startDate * 1000
                    : +selectedTrip.startDate * 1000
                ),
                currentUser!.timezone,
                'yyyy/MM/dd HH:mm:ss'
              )}
          </div>
          <Slider
            value={current}
            onChange={(_, v) => {
              if (typeof v === 'number') {
                pause();
                setCurrent(v);
              }
            }}
            min={0}
            max={duration}
            className="[&>.MuiSlider-rail]:bg-neutral-200 [&>.MuiSlider-rail]:opacity-100 [&>.MuiSlider-track]:bg-gray-800 [&>.MuiSlider-track]:h-3 [&>.MuiSlider-track]:border-gray-800 [&>.MuiSlider-rail]:h-3 [&>.MuiSlider-thumb]:bg-gray-800 [&>.MuiSlider-thumb]:size-7"
          />
          <div className="font-semibold text-xs text-[#2D3748] dark:text-gray-900">
            {selectedTrip &&
              formatInTimeZone(
                new Date(
                  'trips' in selectedTrip
                    ? +(selectedTrip as TripGroup).trips[selectedTrip.trips.length - 1].endDate *
                      1000
                    : +selectedTrip.endDate * 1000
                ),
                currentUser!.timezone,
                'yyyy/MM/dd HH:mm:ss'
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
