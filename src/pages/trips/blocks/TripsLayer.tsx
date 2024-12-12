import { Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L, { LatLngExpression } from 'leaflet';
import { useTripsContext } from '../providers/TripsContext';
import { useEffect, useMemo } from 'react';
import { useMotionValueEvent, useTransform } from 'motion/react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { useAnimationContext } from '../providers/AnimationContext';

export const TripsLayer = () => {
  const map = useMap();
  const { path } = useTripsContext();
  const { current: time } = useAnimationContext();
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
  const latLng = useTransform(
    time,
    path?.map((_, i) => (i / path.length) * 10000) ?? [0, 1],
    path?.map((point) => [point.latitude, point.longitude]) ?? [
      [0, 0],
      [0, 0]
    ],
    { clamp: true }
  );

  const rotation = useTransform(
    time,
    path?.map((_, i) => (i / path.length) * 10000) ?? [0, 1],
    path?.map((point) => point.direction) ?? [0, 0],
    { clamp: true }
  );

  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.flyToBounds(bounds, { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] });
  }, [bounds, map]);

  useMotionValueEvent(time, 'change', (latest) => {
    console.log(latest);
  });

  useMotionValueEvent(latLng, 'change', (latest) => {
    console.log(latest);
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
      {latLng.get() && rotation.get() && (
        <RotatableMarker
          position={latLng.get() as LatLngExpression}
          icon={icon}
          rotationAngle={rotation.get()}
        />
      )}
    </>
  );
};
