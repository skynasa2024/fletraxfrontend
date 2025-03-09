import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useReplayContext } from './ReplayContext';

interface AnimationContextProps {
  playing: boolean;
  current: number;
  // eslint-disable-next-line no-unused-vars
  setCurrent: (current: number) => void;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  metaData?: any;
  // eslint-disable-next-line no-unused-vars
  setMetaData: (metaData?: any) => void;
  multiplier: number;
  // eslint-disable-next-line no-unused-vars
  setMultiplier: (multiplier: number) => void;
}

const ReplayAnimationContext = createContext<AnimationContextProps>({
  playing: false,
  current: 0,
  setCurrent: () => {},
  duration: 0,
  play: () => {},
  pause: () => {},
  stop: () => {},
  setMetaData: () => {},
  multiplier: 1,
  setMultiplier: () => {}
});

export const ReplayAnimationProvider = ({ children }: PropsWithChildren) => {
  const { path } = useReplayContext();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [max, setMax] = useState(10000);
  const [multiplier, setMultiplier] = useState(1);
  const [metaData, setMetaData] = useState<any>();
  const frameRate = 60;
  const latency = 1000 / frameRate;

  const play = () => {
    if (current === max) {
      setCurrent(0);
      // Wait for 200 ms then play
      setTimeout(() => {
        setPlaying(true);
      }, 200);
      return;
    }
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  const stop = () => {
    setPlaying(false);
    setCurrent(0);
  };

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setCurrent((prev) => {
          const next = prev + latency * multiplier;
          if (next >= max) {
            pause();
            return max;
          }
          return next;
        });
      }, latency);

      return () => {
        clearInterval(interval);
      };
    }
  }, [latency, max, multiplier, playing]);

  useEffect(() => {
    if (path && path.length > 0) {
      setCurrent(0);
      setPlaying(false);
      const last = path[path.length - 1];
      setMax(last.timestamp.getTime() - path[0].timestamp.getTime());
    }
  }, [path]);

  const changeCurrent = (newValue: number) => {
    pause();
    setCurrent(newValue);
  };

  return (
    <ReplayAnimationContext.Provider
      value={{
        playing,
        current,
        setCurrent: changeCurrent,
        duration: max,
        play,
        pause,
        stop,
        multiplier,
        setMultiplier,
        metaData,
        setMetaData
      }}
    >
      {children}
    </ReplayAnimationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReplayAnimationContext = () => {
  return useContext(ReplayAnimationContext);
};
