import React from 'react';
import { useParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import {
  AddGeofenceIcon,
  DeleteIcon,
  EditIcon,
  MaintenanceIcon,
  RentIcon,
  ViolationsIcon
} from './svg';

const Toolbar = () => {
  const { vehicleId } = useParams();

  return (
    <div>
      <div className="flex justify-end items-center gap-2 flex-wrap">
        {/* Edit Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
          Edit
          <EditIcon className="w-4 h-4" />
        </button>

        {/* Geofence Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-green-500 rounded-md">
          Add Geofences
          <AddGeofenceIcon className="w-4 h-4" />
        </button>

        {/* Add Scratch Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-purple-500 rounded-md">
          <EditIcon className="w-4 h-4" color="#6B46C1" />
          Add scratch
        </button>

        {/* Maintenance Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-[#1BC5BD] rounded-md">
          <MaintenanceIcon className="w-4 h-4" />
          Maintenance
        </button>

        {/* Violations Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md">
          <ViolationsIcon className="w-4 h-4" />
          Violations
        </button>

        {/* Rent Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-yellow-500 rounded-md">
          <RentIcon className="w-4 h-4" />
          Rent
        </button>

        {/* Delete Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-red-500 rounded-md">
          <DeleteIcon className="w-4 h-4" />
          Delete
        </button>

        {/* Settings Button */}
        <button className="inline-flex items-center justify-center w-10 h-10 border-2 border-blue-500 bg-blue-500 rounded-md">
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
