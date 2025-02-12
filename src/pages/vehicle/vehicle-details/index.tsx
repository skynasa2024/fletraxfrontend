import Toolbar from './components/Toolbar.tsx';
import {
  ModelIcon,
  ModelSeriesIcon,
  ModelYearIcon,
  FuelTypeIcon,
  GearIcon,
  VolumeIcon,
  PowerIcon,
  ColorIcon,
  TypeIcon
} from '../blocks/svg/index.ts';
import FileList, { FileInfo } from '@/pages/driver/details-components/FileList.tsx';
import VehicleMetrics from '../blocks/details-components/VehicleMetrics.tsx';
import GeofenceList from '../blocks/details-components/GeofenceList.tsx';
import TripList from '../blocks/details-components/TripList.tsx';
import { useParams } from 'react-router-dom';
import { CarPlate } from '@/pages/dashboards/blocks/CarPlate.tsx';
import React, { useEffect, useMemo, useState } from 'react';
import VehicleInfoCard from './components/VehicleInfoCard.tsx';
import { getVehicleDetails, VehicleDTO } from '@/api/cars.ts';
import { MaintenanceViolationTable } from '@/pages/dashboards/blocks/maintenance/MaintenanceViolation.tsx';
import VehicleCurrentLocation from './components/VehicleCurrentLocation.tsx';
import VehicleScratchesDisplay from '../add-vehicle/blocks/VehicleScratchesDisplay.tsx';
import VehicleInsuranceIcon from '../blocks/svg/VehicleInsuranceIcon.tsx';

const geofences = [
  'ISTANBUL',
  'ANKARA',
  'IZMIR',
  'ANTALYA',
  'ANKARA',
  'IZMIR',
  'ANTALYA',
  'ANKARA',
  'IZMIR',
  'ANTALYA'
];
const VehicleInfo = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDTO | null>();

  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const res = await getVehicleDetails(id);
          setVehicle(res);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const vehicleInfo: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[] = [
    { label: 'Model', value: vehicle?.model || 'NA', icon: <ModelIcon /> },
    { label: 'Model Series', value: vehicle?.modelSeries || 'NA', icon: <ModelSeriesIcon /> },
    { label: 'Model Year', value: vehicle?.modelYear?.toString() || 'NA', icon: <ModelYearIcon /> },
    { label: 'Fuel Type', value: vehicle?.fuelType || 'NA', icon: <FuelTypeIcon /> },
    { label: 'Gear', value: vehicle?.gear || 'NA', icon: <GearIcon /> },
    { label: 'Volume', value: vehicle?.volume || 'NA', icon: <VolumeIcon /> },
    { label: 'Power', value: vehicle?.power || 'NA', icon: <PowerIcon /> },
    { label: 'Color', value: vehicle?.color || 'NA', icon: <ColorIcon /> },
    { label: 'Type', value: vehicle?.carType || 'NA', icon: <TypeIcon /> }
  ];
  const details = [
    { label: 'Type', value: vehicle?.type || 'NA' },
    { label: 'Identify Number', value: vehicle?.identifyNumber || 'NA' },
    { label: 'Chassis Number', value: vehicle?.chassisNumber || 'NA' },
    { label: 'Engine Number', value: vehicle?.engineNumber || 'NA' },
    { label: 'Registration Number', value: vehicle?.registrationNumber || 'NA' },
    { label: 'Registration Date', value: vehicle?.registrationDate || 'NA' },
    { label: 'First Registration Date', value: vehicle?.firstRegistrationDate || 'NA' },
    { label: 'License Serial Number', value: vehicle?.licenseSerialNumber || 'NA' },
    { label: 'Price', value: vehicle?.price || 'NA' }
  ];
  const items = [
    {
      title: 'Inspection',
      startDate: vehicle?.inspectionStartDate || 'NA',
      endDate: vehicle?.inspectionEndDate || 'NA'
    },
    {
      title: 'Insurance',
      startDate: vehicle?.insuranceStartDate || 'NA',
      endDate: vehicle?.insuranceEndDate || 'NA'
    },
    {
      title: 'Kasko',
      startDate: vehicle?.kaskoInsuranceStartDate || 'NA',
      endDate: vehicle?.kaskoInsuranceEndDate || 'NA'
    },
    {
      title: 'Exhaust',
      startDate: vehicle?.exhaustStartDate || 'NA',
      endDate: vehicle?.exhaustEndDate || 'NA'
    }
  ];

  const files = useMemo(() => {
    if (!vehicle) return [];

    const files: FileInfo[] = [];

    files.push({ name: 'Image', url: (vehicle?.image as string) ?? undefined });
    files.push({ name: 'License', url: (vehicle?.licenseImage as string) ?? undefined });

    return files;
  }, [vehicle]);

  return (
    <>
      <Toolbar carId={vehicle?.id} plate={vehicle?.plate} />
      <div className="px-10">
        <div className="flex flex-col lg:flex-row">
          <div className="card hover:shadow-md w-full lg:w-2/3 grid grid-cols-1 mb-2 p-4">
            <div className="flex justify-between">
              {/* Car Plate */}
              <div className="flex items-center justify-center mb-4">
                <CarPlate plate={vehicle?.plate || 'NA'} />
              </div>

              {/* Device Section */}
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-4 rounded-full"></div>
                <div>
                  <span className="text-lg font-medium">{vehicle?.deviceIdent || 'NA'}</span>
                  <p className="text-sm text-gray-500">Device</p>
                </div>
              </div>
            </div>
            {/* Image Section */}
            <VehicleScratchesDisplay vehicleId={vehicle?.vehicleId} />
          </div>
          <div className="container px-2 mx-auto pl-5 grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {/* Vehicle Info Section */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* Vehicle Info Cards */}
              <div className="flex-grow me-0 lg:me-4 h-full">
                <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 h-full">
                  {vehicleInfo.map(({ label, value, icon }, index) => (
                    <VehicleInfoCard key={index} label={label} value={value} icon={icon} />
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="flex-grow lg:w-1/3 mb-4 card hover:shadow-md overflow-hidden p-4 flex flex-col gap-4 h-full">
                <VehicleCurrentLocation deviceIdent={vehicle?.deviceIdent} />
                <div className="flex-grow">
                  {details.map(({ label, value }, index) => (
                    <div key={index} className="flex items-start mb-2">
                      <span className="text-gray-600 me-1">{label}:</span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspection and Insurance Section */}
            <div className="card hover:shadow-md mb-2 p-4 mt-4">
              <h2 className="text-xl font-semibold mb-2 border-b-2 pb-2">
                Vehicle Inspection and Insurance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {items.map((item) => (
                  <div key={item.title} className="flex items-start space-x-3 rounded-lg mb-4">
                    <div className="rounded-lg p-3 bg-gray-200">
                      <VehicleInsuranceIcon />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <div className="mt-1 flex">
                        <div>
                          <span className="font-semibold">Start</span> :
                          <span>{item.startDate}</span>
                        </div>
                        <div className="ms-4">
                          <span className="font-semibold">End</span> : <span>{item.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <TripList deviceIdent={vehicle?.deviceIdent} />
        <div className="flex flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4 ps-4">Documents</h2>
            <FileList files={files} />
          </div>
          <VehicleMetrics
            metrics={{
              engineHours: '300 Hr',
              mileage: vehicle?.currentMileage?.toString() || '0',
              fuelConsumption: vehicle?.fuelConsumption?.toString() || '0'
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-1/3">
            {/* <GeofenceList
              items={geofences}
              title="Geofences"
              className="mx-2"
              onItemClick={(item) => console.log(`Selected: ${item}`)}
              searchPlaceholder="Search..."
            /> */}
          </div>
          <div className="w-2/3">
            <MaintenanceViolationTable id={vehicle?.vehicleId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleInfo;
