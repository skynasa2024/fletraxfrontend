import AppMap from '@/components/AppMap';
import { AddGeofencePageProps } from '../AddGeofencePage';
import { useState } from 'react';
import { Circle, Marker, useMapEvent } from 'react-leaflet';
import { FormattedMessage, useIntl } from 'react-intl';

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
  const intl = useIntl();
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: geofence?.latitude || 38.9637,
    lng: geofence?.longitude || 35.2433
  });
  const [radius, setRadius] = useState<number>(geofence?.radius || 100);

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">
          <FormattedMessage id="GEOFENCE.FORM.GENERAL" />
        </h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="GEOFENCE.FORM.NAME" />
            </label>
            <input
              required
              type="text"
              className="input"
              name="name"
              placeholder={intl.formatMessage({ id: 'GEOFENCE.FORM.NAME.PLACEHOLDER' })}
              defaultValue={geofence?.name}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="GEOFENCE.FORM.TYPE" />
            </label>
            <input
              required
              type="text"
              className="input"
              name="type"
              placeholder={intl.formatMessage({ id: 'GEOFENCE.FORM.TYPE.PLACEHOLDER' })}
              defaultValue={geofence?.type}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="GEOFENCE.FORM.LATITUDE" />
            </label>
            <input
              required
              className="input"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="latitude"
              placeholder={intl.formatMessage({ id: 'GEOFENCE.FORM.LATITUDE.PLACEHOLDER' })}
              value={position.lat}
              onChange={(e) => setPosition({ lat: parseFloat(e.target.value), lng: position.lng })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="GEOFENCE.FORM.LONGITUDE" />
            </label>
            <input
              required
              className="input"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="longitude"
              placeholder={intl.formatMessage({ id: 'GEOFENCE.FORM.LONGITUDE.PLACEHOLDER' })}
              value={position.lng}
              onChange={(e) => setPosition({ lat: position.lat, lng: parseFloat(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">
              <FormattedMessage id="GEOFENCE.FORM.RADIUS" />
            </label>
            <input
              required
              type="text"
              className="input"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="radius"
              placeholder={intl.formatMessage({ id: 'GEOFENCE.FORM.RADIUS.PLACEHOLDER' })}
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
