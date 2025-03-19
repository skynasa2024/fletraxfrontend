import { Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { RotatableMarker } from '@/pages/monitoring/blocks/RotatableMarker';
import { interpolateKeyframes } from '@/pages/trips/utils/KeyframeInterpolate';
import { useLanguage } from '@/i18n';
import { useReplayContext } from '../providers/ReplayContext';
import { useReplayAnimationContext } from '../providers/ReplayAnimationContext';
import { ParkingPopup } from '../components/ParkingPopup';
import { IntervalType } from '@/api/trips';
import ParkingMarker from '../components/ParkingMarker';
import { renderToString } from 'react-dom/server';

export const ReplayLayer = () => {
  const { isRTL } = useLanguage();
  const map = useMap();
  const { replayData, selectedTrip } = useReplayContext();
  const { current: time, setMetaData } = useReplayAnimationContext();
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

  const { parkings, trips } = replayData || {};

  const allPoints = useMemo(() => {
    if (!trips || trips.length === 0) {
      return [];
    }

    return trips
      .filter((trip) => trip && trip.pointsList) // Add this filter to ensure trip and pointsList exist
      .flatMap((trip) =>
        trip.pointsList.map((point) => ({
          ...point,
          timestamp: new Date(point.timestamp * 1000).getTime(),
          tripId: trip.id
        }))
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [trips]);

  // Get points for selected trip only for animation
  const selectedTripPoints = useMemo(() => {
    if (!selectedTrip || !trips) {
      return allPoints;
    }

    return trips
      .filter((trip) => trip && trip.pointsList && trip.id === selectedTrip.id)
      .flatMap((trip) =>
        trip.pointsList.map((point) => ({
          ...point,
          timestamp: new Date(point.timestamp * 1000).getTime(),
          tripId: trip.id
        }))
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [trips, selectedTrip, allPoints]);

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

  const createParkingIcon = useCallback((isSelected: boolean) => {
    const svgString = renderToString(<ParkingMarker color={isSelected ? '#FF0000' : '#FF6F1E'} />);

    return L.divIcon({
      html: svgString,
      className: '',
      iconSize: [30, 31],
      iconAnchor: [15, 31]
    });
  }, []);

  const denormailizedTime = useMemo(() => {
    if (!selectedTripPoints || selectedTripPoints.length === 0) {
      return 0;
    }

    const startTime = selectedTripPoints[0]?.timestamp ?? 0;
    return startTime + time;
  }, [time, selectedTripPoints]);

  const interpolatedState = useMemo(() => {
    if (!selectedTripPoints || selectedTripPoints.length === 0) {
      return null;
    }

    return interpolateKeyframes(
      selectedTripPoints.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: new Date(point.timestamp),
        speed: point.speed,
        direction: point.direction,
        tripId: point.tripId
      })),
      denormailizedTime
    );
  }, [selectedTripPoints, denormailizedTime]);

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

  // Add a useEffect to pan to the selected trip when it changes
  useEffect(() => {
    if (selectedTrip && trips) {
      if (selectedTrip.intervalType === IntervalType.Trip && trips) {
        const selectedTripData = trips.find((trip) => trip.id === selectedTrip.id);
        if (selectedTripData && selectedTripData.pointsList.length > 0) {
          // Create bounds for the selected trip points
          const points = selectedTripData.pointsList;
          const firstPoint = L.latLng([points[0].latitude, points[0].longitude]);
          const tripBounds = points.reduce(
            (acc, point) => acc.extend([point.latitude, point.longitude]),
            L.latLngBounds(firstPoint, firstPoint)
          );

          // Fly to the bounds of the selected trip
          map.flyToBounds(
            tripBounds,
            isRTL()
              ? { paddingTopLeft: [100, 20], paddingBottomRight: [300, 20] }
              : { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] }
          );
        }
      } else if (selectedTrip.intervalType === IntervalType.Parking) {
        // Fly to the parking location
        map.flyTo(
          [selectedTrip.startLatitude, selectedTrip.startLongitude],
          16 // zoom level
        );

        // Set the popup to open
        setOpenPopupId(selectedTrip.id);

        // Use a small delay to ensure the marker reference is available
        setTimeout(() => {
          const marker = markerRefs.current[selectedTrip.id];
          if (marker) {
            marker.openPopup();
          }
        }, 100);
      }
    }
  }, [selectedTrip, trips, map, isRTL]);

  // Close popup when selection changes
  useEffect(() => {
    // Close previous popup if exists
    const previousMarker = markerRefs.current[openPopupId as string];
    if (previousMarker && openPopupId !== selectedTrip?.id) {
      previousMarker.closePopup();
    }
  }, [openPopupId, selectedTrip]);

  if (!trips || !replayData) {
    return null;
  }

  // Determine start and end markers positions
  const startPoint = selectedTrip
    ? { latitude: selectedTrip.startLatitude, longitude: selectedTrip.startLongitude }
    : allPoints.length > 0
      ? { latitude: allPoints[0].latitude, longitude: allPoints[0].longitude }
      : null;

  const endPoint = selectedTrip
    ? { latitude: selectedTrip.endLatitude, longitude: selectedTrip.endLongitude }
    : allPoints.length > 0
      ? {
          latitude: allPoints[allPoints.length - 1].latitude,
          longitude: allPoints[allPoints.length - 1].longitude
        }
      : null;

  return (
    <>
      {/* Render non-selected trips first */}
      {trips &&
        trips.length > 0 &&
        trips
          .filter((trip) => !selectedTrip || trip.id !== selectedTrip.id)
          .filter((trip) => trip && trip.pointsList)
          .map((trip) => (
            <Polyline
              key={trip.id}
              pathOptions={{
                color:
                  selectedTrip && selectedTrip.intervalType === IntervalType.Trip
                    ? '#4f92dd'
                    : '#006AE6'
              }}
              positions={trip.pointsList
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((point) => [point.latitude, point.longitude])}
            />
          ))}

      {/* Render selected trip last to appear on top */}
      {selectedTrip &&
        trips &&
        trips.length > 0 &&
        trips
          .filter((trip) => trip && trip.pointsList && trip.id === selectedTrip.id) // Add null check here too
          .map((trip) => (
            <Polyline
              key={trip.id}
              pathOptions={{
                color: '#0fb673'
              }}
              positions={trip.pointsList
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((point) => [point.latitude, point.longitude])}
            />
          ))}

      {startPoint && (
        <Marker position={[startPoint.latitude, startPoint.longitude]} icon={iconStartTrip} />
      )}

      {endPoint && <Marker position={[endPoint.latitude, endPoint.longitude]} icon={iconEndTrip} />}

      {parkings &&
        parkings.length > 0 &&
        parkings.map((parking) => {
          const isSelected = selectedTrip?.id === parking.id;

          return (
            <Marker
              key={parking.id}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[parking.id] = ref;
                }
              }}
              position={[parking.startLatitude, parking.startLongitude]}
              icon={createParkingIcon(isSelected)}
            >
              <ParkingPopup parking={parking} />
            </Marker>
          );
        })}

      {latLng && rotation !== null && selectedTrip && (
        <RotatableMarker position={latLng} icon={icon} rotationAngle={rotation} />
      )}
    </>
  );
};
