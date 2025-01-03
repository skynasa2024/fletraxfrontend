import { updateVehicleStatus, VehicleDetails } from '@/api/cars';
// import { useDataGrid } from '@/components';
import { VehicleStatusValues } from '@/api/cars.ts';
import { DropdownOptions, StatusDropdown } from '../StatusDropdown';

const STATUS_OPTIONS: DropdownOptions<VehicleStatusValues> = {
  unavailable: {
    color: '#F1416C',
    backgroundColor: '#FFF5F8',
    name: 'Unavailable'
  },
  in_maintenance: {
    color: '#FFA800',
    backgroundColor: '#FFF8EA',
    name: 'Maintenance'
  },
  available: {
    color: '#50CD89',
    backgroundColor: '#EEFAF4',
    name: 'Available'
  },
  rented: {
    color: '#00A3FF',
    backgroundColor: '#E5F7FF',
    name: 'Rented'
  }
};

type VehicleStatusDropdownProps = {
  vehicleDetails: VehicleDetails;
};

export default function VehicleStatusDropdown({ vehicleDetails }: VehicleStatusDropdownProps) {
  // const reload = useDataGrid().fetchServerSideData;

  return (
    <StatusDropdown<VehicleStatusValues>
      selected={vehicleDetails.status}
      setSelected={async (value) => {
        await updateVehicleStatus(vehicleDetails.vehicle.id, value);
        // reload();
      }}
      options={STATUS_OPTIONS}
    />
  );
}
