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

import VehicleMetrics from '../blocks/details-components/VehicleMetrics.tsx';
import FileList from '../blocks/details-components/FileList.tsx';
import GeofenceList from '../blocks/details-components/GeofenceList.tsx';
import TripList from '../blocks/details-components/TripList.tsx';
import { useParams } from 'react-router-dom';
import BrandLogo from '../blocks/Brand logo.tsx';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate.tsx';
import React, { useEffect, useState } from 'react';
import VehicleInfoCard from './components/VehicleInfoCard.tsx';
import { getVehicleDetails, VehicleDTO } from '@/api/cars.ts';
import { MaintenanceViolationTable } from '@/pages/dashboards/dashboard/blocks/maintenance/MaintenanceViolation.tsx';
import VehicleCurrentLocation from './components/VehicleCurrentLocation.tsx';
import VehicleScratchesDisplay from '../add-vehicle/blocks/VehicleScratchesDisplay.tsx';
import VehicleInsuranceIcon from '../blocks/svg/VehicleInsuranceIcon.tsx';
import Map from '@/pages/device/Map.tsx';
import { Device, getDevice } from '@/api/devices.ts';

interface TripData {
  distance: string;
  date: string;
  startTime: string;
  endTime: string;
  speed: number;
}

const trips: TripData[] = Array(10)
  .fill(null)
  .map(() => ({
    distance: `${(Math.random() * 10 + 1).toFixed(2)} KM`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split('T')[0],
    startTime: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    endTime: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    speed: Math.floor(Math.random() * 101) + 50,
    maxSpeed: Math.floor(Math.random() * 81) + 100
  }));
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
const getScoreColor = (score: number) => {
  if (score <= 50) return 'text-orange-500';
  if (score <= 100) return 'text-yellow-500';
  return 'text-green-500';
};
const files = [
  {
    name: 'file-name1.pdf',
    size: '32mb',
    version: 'v1.2.2',
    type: 'pdf'
  },
  {
    name: 'file-name2.JPG',
    size: '32mb',
    version: 'v1.2.2',
    type: 'jpg'
  }
];
const VehicleInfo = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDTO | null>();
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);

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

  useEffect(() => {
    (async () => {
      if (vehicle?.deviceId) {
        const res = await getDevice(vehicle.deviceId);
        setCurrentDevice(res);
      }
    })();
  }, [vehicle]);

  return (
    <>
      <Toolbar />
      <div className="px-10">
        <div className="flex flex-col lg:flex-row">
          <div className="card hover:shadow-md w-full lg:w-2/3 grid grid-cols-1 mb-2">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3">
              {/* Car Plate */}
              <div className="flex items-center justify-center mb-4">
                <CarPlate plate={vehicle?.plate || 'NA'} />
              </div>

              {/* Brand logo */}
              <div className="flex items-center justify-center">
                <BrandLogo brand="toyota" size="lg" />
              </div>

              {/* Device Section */}
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-4 rounded-full"></div>
                <div>
                  <span className="text-lg font-medium">{currentDevice?.ident || 'NA'}</span>
                  <p className="text-sm text-gray-500">Device</p>
                </div>
              </div>

              {/* Image Section */}
              <VehicleScratchesDisplay vehicleId={vehicle?.vehicleId} />
            </div>
          </div>
          <div className="container px-2 mx-auto pl-5 grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {/* Vehicle Info Section */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* Vehicle Info Cards */}
              <div className="flex-grow mr-0 lg:mr-4 h-full">
                <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 h-full">
                  {vehicleInfo.map(({ label, value, icon }, index) => (
                    <VehicleInfoCard key={index} label={label} value={value} icon={icon} />
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="flex-grow lg:w-1/3 mb-4 card hover:shadow-md overflow-hidden p-4 flex flex-col gap-4 h-full">
                <VehicleCurrentLocation deviceIdent={currentDevice?.ident} />
                <div className="flex-grow">
                  {details.map(({ label, value }, index) => (
                    <div key={index} className="flex items-start mb-2">
                      <span className="text-gray-600 mr-1">{label}:</span>
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
                        <div className="ml-4">
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
        <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full w-600 mt-0">
          <TripList deviceIdent={currentDevice?.ident} />
          <div className="p-4 card hover:shadow-md  w-full">
            <Map />
          </div>
        </div>
        <div className="flex flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4 ps-4">Performance Metrics</h2>
            <FileList files={files} onView={(file) => console.log('Viewing file:', file.name)} />
          </div>
          <VehicleMetrics
            metrics={{
              engineHours: '300 Hr',
              mileage: vehicle?.currentMileage?.toString() || '0',
              fuelConsumption: vehicle?.fuelConsumption?.toString() || '0',
              rentedTimes: '10'
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-1/3">
            <GeofenceList
              items={geofences}
              title="Geofences"
              className="mx-2"
              onItemClick={(item) => console.log(`Selected: ${item}`)}
              searchPlaceholder="Search..."
            />
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
