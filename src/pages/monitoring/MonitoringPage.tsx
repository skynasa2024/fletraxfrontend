import { MapContainer, TileLayer } from 'react-leaflet';
import { CarsLayer } from './blocks/CarsLayer';

const MonitoringPage = () => {
  return (
    <div className="size-full">
      <MapContainer center={[38.9637, 35.2433]} zoom={7} className="size-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CarsLayer />
      </MapContainer>
    </div>
  );
};

export { MonitoringPage };
