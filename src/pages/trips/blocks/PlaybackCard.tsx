import 'react-resizable/css/styles.css';
import { Slider } from '@mui/material';
import { useAnimationContext } from '../providers/AnimationContext';
import clsx from 'clsx';
import { FaPause, FaPlay } from 'react-icons/fa';
import { addMinutes } from 'date-fns';

const MultiplierOptions = [1, 2, 3, 5, 10, 0.25, 0.5];

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

  const toUTCDate = (date: Date) => {
    return addMinutes(date, date.getTimezoneOffset());
  };

  return (
    <div className="card">
      <div className="card-header border-dashed border-b-2 px-10 py-[14px]">
        <div className="card-title text-[20px] font-bold">Playback</div>
      </div>

      <div className="card-body px-[34px] py-[10px]">
        <div className="w-[400px]">
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
          />
          {metaData && (
            <div className="flex justify-between">
              <div>{toUTCDate(new Date(metaData.timestamp)).toLocaleString()}</div>
              <div>{metaData.speed?.toFixed()} km/h</div>
            </div>
          )}
          <div className="flex justify-between mt-[10px]">
            <button
              className={clsx('btn btn-icon', playing ? 'btn-danger' : 'btn-success')}
              onClick={() => {
                if (playing) {
                  pause();
                } else {
                  play();
                }
              }}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>
            <button
              className="btn btn-light btn-clear text-xl"
              onClick={() => {
                const currentIdx = MultiplierOptions.indexOf(multiplier);
                const nextIdx = (currentIdx + 1) % MultiplierOptions.length;
                setMultiplier(MultiplierOptions[nextIdx]);
              }}
            >
              x{multiplier}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
