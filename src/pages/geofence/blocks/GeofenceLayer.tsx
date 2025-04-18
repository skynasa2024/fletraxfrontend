import { useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import L from 'leaflet';
import { useGeofenceContext } from '../providers/GeofenceContext';
import { useEffect } from 'react';
import { useLanguage } from '@/i18n';

export const GeofenceLayer = () => {
  const map = useMap();
  const { isRTL } = useLanguage();
  const { selectedGeofence } = useGeofenceContext();

  useEffect(() => {
    let circle: L.Circle;
    if (selectedGeofence) {
      circle = L.circle([selectedGeofence.latitude, selectedGeofence.longitude], {
        radius: selectedGeofence.radius
      });
      circle.addTo(map);
      map.flyToBounds(circle.getBounds(), {
        ...(isRTL()
          ? { paddingTopLeft: [100, 20], paddingBottomRight: [300, 20] }
          : { paddingTopLeft: [300, 20], paddingBottomRight: [100, 20] }),
        duration: 3
      });
    }
    return () => {
      if (circle) {
        map.removeLayer(circle);
      }
    };
  }, [selectedGeofence, map, isRTL]);

  return null;
};
