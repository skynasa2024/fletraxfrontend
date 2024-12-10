import { Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useTripsContext } from '../providers/TripsContext';
import { useEffect, useMemo, useState } from 'react';
import { useMotionValueEvent, useTime, useTransform } from 'motion/react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';

export const TripsLayer = () => {
  const map = useMap();
  const { path, animationStarted, stopAnimation } = useTripsContext();
  const time = useTime();
  const bounds = useMemo(() => {
    if (!path || path.length === 0) {
      return undefined;
    }
    const latLng = L.latLng([path[0].latitude, path[0].longitude]);
    return path.reduce(
      (acc, point) => acc.extend([point.latitude, point.longitude]),
      L.latLngBounds(latLng, latLng)
    );
  }, [path]);
  const icon = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-green.png'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
    []
  );
  const [animationPosition, setAnimationPosition] = useState([0, 0, 0]);
  const [lastTime, setLastTime] = useState(0);
  const [animationStartTime, setAnimationStartTime] = useState(-1);
  const timeTransform = useTransform(() => {
    if (animationStartTime === -1) {
      return 0;
    }
    return time.get() - animationStartTime;
  });
  const transform = useTransform(
    timeTransform,
    path?.map((_, i) => (i / path.length) * 10000) ?? [0, 1],
    path?.map((point) => [point.latitude, point.longitude, point.direction]) ?? [
      [0, 0, 0],
      [0, 0, 0]
    ],
    { clamp: true }
  );

  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.flyToBounds(bounds, { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] });
  }, [bounds, map]);

  useEffect(() => {
    setAnimationPosition(transform.get());
  }, [path, transform]);

  useEffect(() => {
    if (!path) {
      return;
    }

    if (animationStarted) {
      setAnimationStartTime(time.get());
      setLastTime(0);
    } else {
      setAnimationStartTime(-1);
    }
  }, [animationStarted, path, stopAnimation, time]);

  useMotionValueEvent(timeTransform, 'change', (latest) => {
    if (latest >= 10000) {
      stopAnimation();
      return;
    }
    if (latest - lastTime < 10) {
      return;
    }

    setLastTime(latest);
    setAnimationPosition(transform.get());
  });

  if (!path) {
    return null;
  }

  return (
    <>
      <Polyline
        pathOptions={{ color: '#5271FF' }}
        positions={path?.map((point) => [point.latitude, point.longitude])}
      />
      <RotatableMarker
        position={[animationPosition[0], animationPosition[1]]}
        icon={icon}
        rotationAngle={animationPosition[2]}
      />
    </>
  );
};
