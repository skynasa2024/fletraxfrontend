import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';
import { useMonitoringProvider } from '../providers/MonitoringProvider';

export const CarsLayer = () => {
  const { locations } = useMonitoringProvider();
  const icon = L.icon({
    iconUrl: toAbsoluteUrl('/media/icons/car-marker.png'),
    iconSize: [30, 60]
  });

  return (
    // @ts-ignore
    <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds>
      {locations?.map((location) => (
        <Marker
          key={location.vehicle.imei}
          position={[location.lat, location.long]}
          rotationAngle={location.angle}
          icon={icon}
        />
      ))}
    </MarkerClusterGroup>
  );
};
