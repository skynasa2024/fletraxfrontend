import { Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { interpolateKeyframes } from '@/pages/trips/utils/KeyframeInterpolate';
import { useLanguage } from '@/i18n';
import { useReplayContext } from '../providers/ReplayContext';
import { useReplayAnimationContext } from '../providers/ReplayAnimationContext';
import { ParkingPopup } from '../components/ParkingPopup';

export const ReplayLayer = () => {
  const { isRTL } = useLanguage();
  const map = useMap();
  const { replayData } = useReplayContext();
  const { current: time, setMetaData } = useReplayAnimationContext();

  const { parkings, trips } = replayData || {};

  // Combine all points from all trips for bounds and animation
  const allPoints = useMemo(() => {
    if (!trips || trips.length === 0) {
      return [];
    }

    return trips
      .flatMap((trip) =>
        trip.pointsList.map((point) => ({
          ...point,
          timestamp: new Date(point.timestamp * 1000).getTime()
        }))
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [trips]);

  const bounds = useMemo(() => {
    if (!allPoints || allPoints.length === 0) {
      return undefined;
    }
    const latLng = L.latLng([allPoints[0].latitude, allPoints[0].longitude]);
    return allPoints.reduce(
      (acc, point) => acc.extend([point.latitude, point.longitude]),
      L.latLngBounds(latLng, latLng)
    );
  }, [allPoints]);

  const icon = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/car-marker-green.png'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
    []
  );

  const iconStartTrip = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/trip-start.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
    []
  );

  const iconEndTrip = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/trip-end.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      }),
    []
  );

  const iconParkingPoint = useMemo(
    () =>
      L.icon({
        iconUrl: toAbsoluteUrl('/media/icons/parking-point.svg'),
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      }),
    []
  );

  const denormailizedTime = useMemo(() => {
    if (!allPoints || allPoints.length === 0) {
      return 0;
    }

    const startTime = allPoints[0]?.timestamp ?? 0;
    return startTime + time;
  }, [time, allPoints]);

  const interpolatedState = useMemo(() => {
    if (!allPoints || allPoints.length === 0) {
      return null;
    }

    return interpolateKeyframes(
      allPoints.map((point) => ({
        tripId: point.id,
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: new Date(point.timestamp),
        speed: point.speed,
        direction: point.direction
      })),
      denormailizedTime
    );
  }, [allPoints, denormailizedTime]);

  useEffect(() => {
    setMetaData({
      speed: interpolatedState?.speed ?? 0,
      timestamp: denormailizedTime
    });
  }, [denormailizedTime, interpolatedState, setMetaData]);

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
    map.flyToBounds(
      bounds,
      isRTL()
        ? { paddingTopLeft: [100, 20], paddingBottomRight: [300, 20] }
        : { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] }
    );
  }, [bounds, isRTL, map]);

  if (!trips || !replayData) {
    return null;
  }

  return (
    <>
      {trips &&
        trips.length > 0 &&
        trips.map((trip) => (
          <Polyline
            key={trip.id}
            pathOptions={{ color: '#2563eb' }}
            positions={trip.pointsList
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((point) => [point.latitude, point.longitude])}
          />
        ))}

      {allPoints && allPoints.length > 1 && (
        <>
          <Marker position={[allPoints[0].latitude, allPoints[0].longitude]} icon={iconStartTrip} />
          <Marker
            position={[
              allPoints[allPoints.length - 1].latitude,
              allPoints[allPoints.length - 1].longitude
            ]}
            icon={iconEndTrip}
          />
        </>
      )}

      {parkings &&
        parkings.length > 0 &&
        parkings.map((parking) => (
          <Marker
            key={parking.id}
            position={[parking.startLatitude, parking.startLongitude]}
            icon={iconParkingPoint}
          >
            <ParkingPopup parking={parking} />
          </Marker>
        ))}

      {latLng && rotation !== null && (
        <RotatableMarker position={latLng} icon={icon} rotationAngle={rotation} />
      )}
    </>
  );
};
