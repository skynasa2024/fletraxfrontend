import { MotionValue, useMotionValue, useMotionValueEvent } from 'motion/react';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface AnimationContextProps {
  playing: boolean;
  current: MotionValue<number>;
  currentValue: number;
  // eslint-disable-next-line no-unused-vars
  setCurrent: (current: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

const AnimationContext = createContext<AnimationContextProps>({
  playing: false,
  current: new MotionValue(),
  currentValue: 0,
  setCurrent: () => {},
  play: () => {},
  pause: () => {},
  stop: () => {}
});

export const AnimationProvider = ({ children }: PropsWithChildren) => {
  const [playing, setPlaying] = useState(false);
  const current = useMotionValue(0);
  const [currentValue, setCurrentValue] = useState(0);
  const frameRate = 60;
  const latency = 1000 / frameRate;

  const play = () => {
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  const stop = () => {
    setPlaying(false);
    current.jump(0);
  };

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        current.set(current.get() + latency);
      }, latency);

      return () => {
        clearInterval(interval);
      };
    }
  }, [current, latency, playing]);

  const setCurrent = (newValue: number) => {
    pause();
    current.jump(newValue);
  };

  useMotionValueEvent(current, 'change', (latest) => {
    setCurrentValue(latest);
    // console.log(latest);
  });

  return (
    <AnimationContext.Provider
      value={{
        playing,
        current,
        currentValue,
        setCurrent,
        play,
        pause,
        stop
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAnimationContext = () => {
  return useContext(AnimationContext);
};
