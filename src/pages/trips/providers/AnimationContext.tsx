import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface AnimationContextProps {
  playing: boolean;
  current: number;
  // eslint-disable-next-line no-unused-vars
  setCurrent: (current: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

const AnimationContext = createContext<AnimationContextProps>({
  playing: false,
  current: 0,
  setCurrent: () => {},
  play: () => {},
  pause: () => {},
  stop: () => {}
});

export const AnimationProvider = ({ children }: PropsWithChildren) => {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
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
    setCurrent(0);
  };

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setCurrent((prev) => {
          const next = prev + latency;
          if (next >= 10000) {
            pause();
            return 10000;
          }
          return next;
        });
      }, latency);

      return () => {
        clearInterval(interval);
      };
    }
  }, [latency, playing]);

  const changeCurrent = (newValue: number) => {
    pause();
    setCurrent(newValue);
  };

  return (
    <AnimationContext.Provider
      value={{
        playing,
        current,
        setCurrent: changeCurrent,
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
