import AppMap from '@/components/AppMap';
import { AddGeofencePageProps } from '../AddGeofencePage';
import { useState } from 'react';
import { Circle, Marker, useMapEvent } from 'react-leaflet';

interface GeofenceMarkerProps {
  position: { lat: number; lng: number };
  // eslint-disable-next-line no-unused-vars
  setPosition: (position: { lat: number; lng: number }) => void;
}

const GeofenceMarker = ({ position, setPosition }: GeofenceMarkerProps) => {
  useMapEvent('click', (e) => {
    setPosition(e.latlng);
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        drag: (e) => {
          setPosition(e.target.getLatLng());
        }
      }}
    />
  );
};

const General = ({ geofence }: AddGeofencePageProps) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: geofence?.latitude || 38.9637,
    lng: geofence?.longitude || 35.2433
  });
  const [radius, setRadius] = useState<number>(geofence?.radius || 100);

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">General</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Name</label>
            <input
              required
              type="text"
              className="input"
              name="name"
              placeholder="Name"
              defaultValue={geofence?.name}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Type</label>
            <input
              required
              type="text"
              className="input"
              name="type"
              placeholder="Type"
              defaultValue={geofence?.type}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Latitude</label>
            <input
              required
              className="input"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="latitude"
              placeholder="Latitude"
              value={position.lat}
              onChange={(e) => setPosition({ lat: parseFloat(e.target.value), lng: position.lng })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Longitude</label>
            <input
              required
              className="input"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="longitude"
              placeholder="Longitude"
              value={position.lng}
              onChange={(e) => setPosition({ lat: position.lat, lng: parseFloat(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Radius</label>
            <input
              required
              type="text"
              className="input"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="radius"
              placeholder="Radius"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div className="rounded-md w-full h-[512px]">
          <AppMap mapControlSize="small">
            <GeofenceMarker position={position} setPosition={setPosition} />
            <Circle center={position} radius={radius} />
          </AppMap>
        </div>
      </div>
    </div>
  );
};

export { General };
