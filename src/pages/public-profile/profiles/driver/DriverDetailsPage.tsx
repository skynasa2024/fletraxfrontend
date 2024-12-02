import { MaintenanceViolationTable } from './blocks/maintenance/MaintenanceViolation';

import { CarPlate } from './CarPlate';
import Toolbar from './Toolbar';
import { Model, ModelSeries, ModelYear, FuelType, Gear, Volume, Power, Color, Tayp } from './svg';

import VehicleMetrics from './details-components/VehicleMetrics';
import FileList from './details-components/FileList';
import GeofenceList from './details-components/GeofenceList';
import TripList from './details-components/TripList';
import { toAbsoluteUrl } from '@/utils';
import { Mail, Phone, MapPin, Building, Flag, Calendar } from 'lucide-react';

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

const VehicleInfoCards = () => {
  const vehicleInfo = [
    { label: 'Model', value: 'Corolla', Icon: Model },
    { label: 'Model Series', value: 'SEDAN', Icon: ModelSeries },
    { label: 'Model Year', value: '2021', Icon: ModelYear },
    { label: 'Fuel Type', value: 'Benzin', Icon: FuelType },
    { label: 'Gear', value: 'Automatic', Icon: Gear },
    { label: 'Volume', value: '200', Icon: Volume },
    { label: 'Power', value: '200', Icon: Power },
    { label: 'Color', value: 'White', Icon: Color },
    { label: 'Tayp', value: 'Easy', Icon: Tayp }
  ];
  const details = [
    { label: 'Type', value: 'Institutional' },
    { label: 'Identify Number', value: '05511593891' },
    { label: 'Chassis Number', value: 'NMTBA3BE20R010542' },
    { label: 'Engine Number', value: 'M15ABC77721' },
    { label: 'Registration Number', value: '2024042916093744083' },
    { label: 'Registration Date', value: '2024-04-29' },
    { label: 'First Registration Date', value: '2021-03-26' },
    { label: 'License Serial Number', value: '206234' },
    { label: 'Price', value: '1.0000' }
  ];
  const items = [
    { title: 'Inspection', startDate: '2024-04-29', endDate: '2024-05-27' },
    { title: 'Insurance', startDate: '2024-04-29', endDate: '2024-05-27' },
    { title: 'Kasko', startDate: '2024-04-29', endDate: '2024-05-27' },
    { title: 'Exhaust', startDate: '2024-04-29', endDate: '2024-05-27' }
  ];

  return (
    <>
      <Toolbar />
      <div className="w-full mx-auto px-4">
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Profile Image and Basic Info */}
            <div className="flex-shrink-0">
              <img
                src="/api/placeholder/120/120"
                alt="Profile"
                className="w-28 h-28 rounded-lg object-cover"
              />
            </div>

            <div className="flex-grow">
              {/* Name and Badges Section */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Brad Dennis</h2>
                  <p className="text-gray-500">Turkish</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-md">TR</span>
                  <span className="text-gray-700 font-medium">GL96ABR</span>
                  <img src="/api/placeholder/24/24" alt="Toyota" className="h-6" />
                  <button className="px-4 py-1 border border-gray-300 rounded-md text-gray-600">
                    Company
                  </button>
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>01 / 06 / 1983</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>mail@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+90954948849</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Flag className="w-4 h-4" />
                  <span>Turkey</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>Istanbul</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>adress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* Maintenance Card */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-400 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">For today</p>
                  <h3 className="font-semibold">Maintenance</h3>
                  <p className="text-gray-400 text-sm">Maintenance</p>
                </div>
              </div>
              <div className="text-2xl font-bold">25</div>
            </div>

            {/* Violations Card */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">For today</p>
                  <h3 className="font-semibold">Violations</h3>
                  <p className="text-gray-400 text-sm">Violations</p>
                </div>
              </div>
              <div className="text-2xl font-bold">1</div>
            </div>
          </div>

          {/* Payment Status Section */}
          <div className="grid grid-cols-2 gap-8 mt-4">
            {/* Unpaid Section */}
            <div>
              <p className="text-red-500 mb-1">Unpaid</p>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-500 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <span className="text-lg font-semibold">+$2000</span>
              </div>
            </div>
            {/* Paid Section */}
            <div>
              <p className="text-green-500 mb-1">Paid</p>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span className="text-lg font-semibold">+$2000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full w-600 m-2 mb-6 ">
          <TripList trips={trips} totalTrips={450} className="sm:w-full mt-4" title="Trips" />
          <div className="p-4 card w-full">map</div>
        </div>
        <div className="flex flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4 ps-4">Performance Metrics</h2>
            <FileList files={files} onView={(file) => console.log('Viewing file:', file.name)} />
          </div>
          <VehicleMetrics
            metrics={{
              engineHours: '300 Hr',
              mileage: '200 km',
              fuelConsumption: '12%',
              rentedTimes: '10'
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <GeofenceList
            items={geofences}
            title="Geofences"
            className="mx-2"
            onItemClick={(item) => console.log(`Selected: ${item}`)}
            searchPlaceholder="Search..."
          />
          <MaintenanceViolationTable />
        </div>
      </div>
    </>
  );
};

export default VehicleInfoCards;
