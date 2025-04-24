import { Divider, Slider } from '@mui/material';
import { FaPause, FaPlay } from 'react-icons/fa';
import { PiFastForward } from 'react-icons/pi';
import { useAuthContext } from '@/auth';
import SpeedGauge from '@/pages/device/SpeedGuage';
import { toAbsoluteUrl } from '@/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { FormattedMessage } from 'react-intl';
import { useLanguage } from '@/i18n';
import { useReplayContext } from '../providers/ReplayContext';
import { useReplayAnimationContext } from '../providers/ReplayAnimationContext';
import { useMemo } from 'react';
import clsx from 'clsx';

const MultiplierOptions = [0.5, 1, 2, 3, 5];

export const ReplayPlaybackCard = () => {
  const { isRTL } = useLanguage();
  const {
    playing,
    play,
    pause,
    next,
    prev,
    current,
    setCurrent,
    metaData,
    multiplier,
    setMultiplier,
    duration,
    currentPointIndex,
    messagePoints
  } = useReplayAnimationContext();
  const { currentUser } = useAuthContext();
  const { replayData, selectedIntervals: selectedTrip } = useReplayContext();

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

  const marks = useMemo(() => {
    if (messagePoints.length <= 1) return [];

    return messagePoints.map((_, index) => ({
      value: (index / (messagePoints.length - 1)) * duration
    }));
  }, [messagePoints, duration]);

  const getMessageInfo = () => {
    if (messagePoints.length > 0 && currentPointIndex < messagePoints.length) {
      return `Message ${currentPointIndex + 1} of ${messagePoints.length}`;
    }
    return '';
  };

  if (!replayData) {
    return null;
  }

  // Calculate metrics for display based on selected trip or all trips
  const mileage = selectedTrip
    ? selectedTrip.totalDistance
    : replayData.trips.reduce((acc, trip) => acc + trip.totalDistance, 0);

  const maxSpeed = selectedTrip
    ? selectedTrip.maxSpeed
    : Math.max(...replayData.trips.map((trip) => trip.maxSpeed), 0);

  // Format timestamps for the current trip selection
  const startTimestamp = selectedTrip
    ? new Date(selectedTrip.startTime * 1000)
    : replayData.trips.length > 0
      ? new Date(Math.min(...replayData.trips.map((t) => t.startTime)) * 1000)
      : new Date();

  const endTimestamp = selectedTrip
    ? new Date(selectedTrip.endTime * 1000)
    : replayData.trips.length > 0
      ? new Date(Math.max(...replayData.trips.map((t) => t.endTime)) * 1000)
      : new Date();

  return (
    <div className="card w-[50vw] flex flex-row p-5 h-60">
      <div className="flex flex-col justify-between items-center grow w-1/2">
        <div className="flex gap-12 items-center justify-center p-4">
          <div className="flex gap-6 items-center">
            <button
              className="btn btn-icon rounded-lg btn-info -scale-x-100 size-10"
              style={{
                transform: isRTL() ? 'none' : 'scaleX(-1)'
              }}
              onClick={prev}
              disabled={current === 0}
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
              style={{
                transform: isRTL() ? 'scaleX(-1)' : 'none'
              }}
              onClick={next}
              disabled={current === duration}
            >
              <PiFastForward size={22} />
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="text-lg p-0 font-semibold text-gray-700 disabled:text-gray-400 hover:text-gray-900"
              onClick={handleDecreasePlayBackSpeed}
              disabled={MultiplierOptions.indexOf(multiplier) === 0}
            >
              -
            </button>
            <button className="btn btn-warning text-xs rounded-full p-4 size-9 flex justify-center items-center">
              x{multiplier}
            </button>
            <button
              className="text-lg p-0 font-semibold text-gray-700 disabled:text-gray-400 hover:text-gray-900"
              onClick={handleIncreasePlayBackSpeed}
              disabled={MultiplierOptions.indexOf(multiplier) === MultiplierOptions.length - 1}
            >
              +
            </button>
          </div>
        </div>

        <Divider className="w-full !border-dashed" />

        <div className="grid grid-cols-3 gap-7">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/flag.svg')} />
              <span className="text-xs font-medium text-[#5E6278] dark:text-gray-700">
                <FormattedMessage id="TRIPS.FIELD.START_DATE" />
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {formatInTimeZone(startTimestamp, currentUser!.timezone, 'yyyy/MM/dd')}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/meter.svg')} />
              <span className="text-xs font-medium text-[#5E6278] dark:text-gray-700">
                <FormattedMessage id="TRIPS.FIELD.MILEAGE" />
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {mileage.toFixed(2)} KM
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <img src={toAbsoluteUrl('/media/icons/speed-blue.svg')} />
              <span className="text-xs font-medium text-[#5E6278] dark:text-gray-700">
                <FormattedMessage id="TRIPS.FIELD.MAX_SPEED" />
              </span>
            </div>
            <div className="font-semibold text-sm text-[#2D3748] dark:text-gray-900">
              {maxSpeed.toFixed(0)} Km/h
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
            <SpeedGauge value={metaData?.speed?.toFixed()} maxValue={160} unit="km" />
          </div>
          <div className="flex flex-col items-center gap-1">
            {metaData?.timestamp && (
              <div className="flex justify-between bg-gray-200 text-gray-600 font-semibold text-sm text-center py-1 px-2 rounded-md">
                <div>
                  {new Date(metaData.timestamp).toLocaleString('en-UK', {
                    timeZone: currentUser?.timezone
                  })}
                </div>
              </div>
            )}
            <div className="text-sm font-semibold text-gray-700">{getMessageInfo()}</div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="font-semibold text-xs text-[#2D3748] dark:text-gray-900">
            {formatInTimeZone(startTimestamp, currentUser!.timezone, 'yyyy/MM/dd HH:mm:ss')}
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
            marks={marks}
            step={null}
            size="medium"
            className={clsx(
              '[&>.MuiSlider-rail]:bg-neutral-200 [&>.MuiSlider-rail]:opacity-100 [&>.MuiSlider-rail]:h-3',
              '[&>.MuiSlider-track]:bg-gray-700 [&>.MuiSlider-track]:h-3 [&>.MuiSlider-track]:border-gray-600',
              '[&>.MuiSlider-thumb]:bg-gray-800 [&>.MuiSlider-thumb]:size-7',
              '[&>.MuiSlider-mark]:hidden'
            )}
          />
          <div className="font-semibold text-xs text-[#2D3748] dark:text-gray-900">
            {formatInTimeZone(endTimestamp, currentUser!.timezone, 'yyyy/MM/dd HH:mm:ss')}
          </div>
        </div>
      </div>
    </div>
  );
};
