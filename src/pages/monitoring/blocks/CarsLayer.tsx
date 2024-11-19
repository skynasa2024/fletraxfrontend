import { getVehicleLocations, VehicleLocation } from '@/api/cars';
import { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet-rotatedmarker';
import { toAbsoluteUrl } from '@/utils';
import L from 'leaflet';

export const CarsLayer = () => {
  const [locations, setLocations] = useState<VehicleLocation[]>();
  const icon = L.icon({
    iconUrl: toAbsoluteUrl('/media/icons/car-marker.png'),
    iconSize: [30, 60]
  });

  useEffect(() => {
    getVehicleLocations().then(setLocations);

    const interval = setInterval(async () => {
      setLocations(await getVehicleLocations());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    // @ts-ignore
    <MarkerClusterGroup>
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
