import { Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useTripsContext } from '../providers/TripsContext';
import { useEffect, useMemo } from 'react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { useAnimationContext } from '../providers/AnimationContext';
import { interpolateKeyframes } from '../utils/KeyframeInterpolate';

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

  const denormailizedTime = useMemo(() => {
    if (!path) {
      return 0;
    }

    const startTime = path[0].timestamp.getTime();
    const endTime = path[path.length - 1].timestamp.getTime();
    const duration = endTime - startTime;

    // time is from 0 to 10,000
    return startTime + (time / 10000) * duration;
  }, [time, path]);

  const interpolatedState = useMemo(() => {
    if (!path) {
      return null;
    }

    return interpolateKeyframes(path, denormailizedTime);
  }, [path, denormailizedTime]);

  const latLng = useMemo(() => {
    if (!interpolatedState) {
      return null;
    }

    return L.latLng(interpolatedState.latitute, interpolatedState.longitude);
  }, [interpolatedState]);

  const rotation = useMemo(() => {
    if (!interpolatedState) {
      return null;
    }

    return interpolatedState.direction;
  }, [interpolatedState]);

  useEffect(() => {
    if (!bounds) {
      return;
    }
    map.flyToBounds(bounds, { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] });
  }, [bounds, map]);

  if (!path) {
    return null;
  }

  return (
    <>
      <Polyline
        pathOptions={{ color: '#5271FF' }}
        positions={path?.map((point) => [point.latitude, point.longitude])}
      />
      {latLng && rotation && (
        <RotatableMarker position={latLng} icon={icon} rotationAngle={rotation} />
      )}
    </>
  );
};
