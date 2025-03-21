import { createContext, PropsWithChildren, useContext, useEffect, useState, useMemo } from 'react';
import { useReplayContext } from './ReplayContext';
import { ReplayPoint } from '@/api/replay';

interface AnimationContextProps {
  playing: boolean;
  current: number;
  setCurrent: (current: number) => void;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  metaData?: any;
  setMetaData: (metaData?: any) => void;
  multiplier: number;
  setMultiplier: (multiplier: number) => void;
  currentPointIndex: number;
  messagePoints: ReplayPoint[];
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
  setMultiplier: () => {},
  currentPointIndex: 0,
  messagePoints: []
});

const BASE_INTERVAL = 10000; // 10 seconds

export const ReplayAnimationProvider = ({ children }: PropsWithChildren) => {
  const { replayData, selectedTrip } = useReplayContext();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [max, setMax] = useState(10000);
  const [multiplier, setMultiplier] = useState(1);
  const [metaData, setMetaData] = useState<any>();
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  const messagePoints = useMemo(() => {
    if (selectedTrip && selectedTrip.pointsList) {
      return [...selectedTrip.pointsList].sort((a, b) => a.timestamp - b.timestamp);
    }
    return [];
  }, [selectedTrip]);

  const snapPositions = useMemo(() => {
    return messagePoints.map(
      (_, index) => (index / (messagePoints.length > 1 ? messagePoints.length - 1 : 1)) * max
    );
  }, [messagePoints, max]);

  const play = () => {
    if (current >= max && messagePoints.length > 0) {
      setCurrent(0);
      setCurrentPointIndex(0);
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
    setCurrentPointIndex(0);
  };

  useEffect(() => {
    if (playing && messagePoints.length > 0) {
      const interval = setTimeout(() => {
        const nextIndex = currentPointIndex + 1;

        if (nextIndex >= messagePoints.length) {
          pause();
          setCurrent(max);
          return;
        }

        setCurrentPointIndex(nextIndex);

        const newPosition = snapPositions[nextIndex];
        setCurrent(newPosition);
      }, BASE_INTERVAL / multiplier);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [playing, currentPointIndex, messagePoints, multiplier, max, snapPositions]);

  useEffect(() => {
    if (messagePoints.length > 0 && currentPointIndex < messagePoints.length) {
      const point = messagePoints[currentPointIndex];
      setMetaData({
        speed: point.speed ?? 0,
        timestamp: point.timestamp * 1000
      });
    }
  }, [currentPointIndex, messagePoints]);

  useEffect(() => {
    if (selectedTrip) {
      setCurrent(0);
      setCurrentPointIndex(0);
      setPlaying(false);
      setMax(selectedTrip.endTime * 1000 - selectedTrip.startTime * 1000);
    }
  }, [replayData, selectedTrip]);

  const changeCurrent = (newValue: number) => {
    pause();
    setCurrent(newValue);

    // Find the closest snap position
    if (snapPositions.length > 0) {
      const closestIndex = snapPositions.reduce((prev, curr, index) => {
        return Math.abs(curr - newValue) < Math.abs(snapPositions[prev] - newValue) ? index : prev;
      }, 0);

      setCurrentPointIndex(closestIndex);
      setCurrent(snapPositions[closestIndex]);
    }
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
        setMetaData,
        currentPointIndex,
        messagePoints
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
