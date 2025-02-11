import { General, Device } from './blocks';
import { GeofenceDTO } from '@/api/geofence';

export interface AddGeofencePageProps {
  geofence?: GeofenceDTO;
}

const AddGeofencePage = ({ geofence }: AddGeofencePageProps) => {
  return (
    <div className="grid grid-cols-3 gap-[30px] mx-auto">
      <div className="col-span-2">
        <General geofence={geofence} />
      </div>
      <div>
        <Device geofence={geofence} />
      </div>
    </div>
  );
};

export { AddGeofencePage };
