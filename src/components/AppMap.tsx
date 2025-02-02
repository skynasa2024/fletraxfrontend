import { RefAttributes } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { AttributionControl, MapContainer, MapContainerProps, TileLayer } from 'react-leaflet';
import clsx from 'clsx';

const AppMap = ({
  className,
  children,
  ...props
}: MapContainerProps & RefAttributes<LeafletMap>) => {
  return (
    <MapContainer
      center={[38.9637, 35.2433]}
      zoom={7}
      className={clsx('size-full', className)}
      zoomControl={false}
      attributionControl={false}
      minZoom={3}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AttributionControl prefix="Leaflet" />
      {children}
    </MapContainer>
  );
};

export default AppMap;
