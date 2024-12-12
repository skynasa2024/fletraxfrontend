import 'react-resizable/css/styles.css';
import { Slider } from '@mui/material';
import { useAnimationContext } from '../providers/AnimationContext';

export const PlaybackCard = () => {
  const { playing, play, pause, stop, currentValue, setCurrent } = useAnimationContext();

  return (
    <div className="card">
      <div className="card-header border-dashed border-b-2 px-10 py-[14px]">
        <div className="card-title text-[20px] font-bold">Playback</div>
      </div>

      <div className="card-body px-[34px] py-[10px]">
        <div className="w-[700px]">
          <Slider
            value={currentValue}
            onChange={(_, v) => {
              if (typeof v === 'number') {
                pause();
                setCurrent(v);
              }
            }}
            min={0}
            max={10000}
          />
        </div>
      </div>
    </div>
  );
};
