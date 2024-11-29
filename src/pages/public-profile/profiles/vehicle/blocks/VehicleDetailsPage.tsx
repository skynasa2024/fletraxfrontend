import { MaintenanceViolationTable } from '@/pages/dashboards/dashboard/blocks/maintenance';
import { CarPlate } from './CarPlate';
import Toolbar from './Toolbar';
import {
  Model,
  ModelSeries,
  ModelYear,
  FuelType,
  Gear,
  Volume,
  Power,
  Color,
  Tayp,

} from './svg';

import VehicleMetrics from './details-components/VehicleMetrics';
import FileList from './details-components/FileList';
import GeofenceList from './details-components/GeofenceList';
import TripList from './details-components/TripList';
import { CarView } from '@/pages/dashboards/dashboard/blocks/CarView';

interface TripData {
  distance: string;
  date: string;
  startTime: string;
  endTime: string;
  speed: number;
}

const trips: TripData[] = Array(10).fill({
  distance: '4.92 KM',
  date: '2024-04-29',
  startTime: '12:35:35',
  endTime: '12:35:35',
  speed: 75
});
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
        {' '}
        <div className="flex flex-col lg:flex-row">
          <div className="card-body w-full lg:w-1/2 bg-white shadow-md rounded-lg ms-2 mt-4 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Car Plate */}
              <div className="flex items-center justify-center">
                <CarPlate plate="5484555" />
              </div>
              {/* SVG Section */}
              <div className="flex items-center justify-center">
                <svg width={45} height={44} viewBox="0 0 45 44" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    width={45}
                    height={44}
                    rx={8}
                    transform="matrix(-1 0 0 1 45 0)"
                    fill="url(#pattern0)"
                  />
                </svg>
              </div>

              {/* Device Section */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  
                </div>
                <div>
                  <span className="text-lg font-medium">41643739</span>
                  <p className="text-sm text-gray-500">Device</p>
                </div>
              </div>
              {/* Image Section */}
              <div className="col-span-full sm:col-span-2 lg:col-span-1">
                <img
                  className="w-full rounded-lg object-cover h-48"
                  src="./svg/car.png"
                  alt="Car"
                />
              </div>
            </div>
          </div>

          <div className="container mx-auto p-5">
            <div className="container mx-auto">
              <div className="flex flex-row h-full mb-4">
                {/* Vehicle Info */}
                <div className="flex-grow bg-white mr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicleInfo.map(({ label, value, Icon }, index) => (
                      <div
                        key={index}
                        className=" p-4 rounded-lg shadow-sm border hover:shadow-md flex flex-col h-40"
                      >
                        <Icon className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium my-2">{label}</span>
                        <span className="text-lg font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-grow h-full w-1/6 bg-white shadow-md rounded-lg overflow-hidden ">
                  <div className="p-6 h-full flex flex-col">
                    <img
                      className="w-full rounded-lg object-cover h-48 w-1/3 mb-4"
                      src="https://via.placeholder.com/150"
                      alt="Map"
                    />
                    <div className="flex-grow">
                      {details.map(({ label, value }, index) => (
                        <div key={index} className="flex items-start mb-1">
                          <span className="text-gray-400 ml-1">{label}:</span>
                          <span className="text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="p-6 w-auto bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Vehicle inspection and insurance</h2>
              <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.55566 7.40137V13.9414C3.55469 20.876 7.90332 27.209 14.3779 29.6992C14.9004 29.9004 15.4502 30 16 30C16.5498 30 17.0996 29.8994 17.623 29.6992L18.5938 29.3252C24.5781 27.0234 28.4453 21.2344 28.4443 14.5781V7.40137C28.4443 6.86426 28.0195 6.42285 27.4834 6.40234C23.8887 6.2627 20.2236 4.8457 16.5898 2.19238C16.2383 1.93652 15.7617 1.93652 15.4102 2.19238C11.7754 4.8457 8.11035 6.2627 4.5166 6.40234C3.98047 6.42285 3.55566 6.86426 3.55566 7.40137ZM5.55566 8.33691C9.04004 8.00781 12.5459 6.62891 16 4.22754C19.4531 6.62891 22.96 8.00781 26.4443 8.33691V14.5781C26.4453 20.4004 23.082 25.4561 17.875 27.458L16.9053 27.832C16.3213 28.0566 15.6777 28.0566 15.0957 27.832C9.38867 25.6367 5.55469 20.0547 5.55566 13.9414V8.33691Z"
                        fill="#FF3C3C"
                      />
                      <path
                        d="M13.9521 20.1309C14.1396 20.3184 14.3936 20.4238 14.6592 20.4238C14.9248 20.4238 15.1787 20.3184 15.3662 20.1309L21.5859 13.9111C21.9766 13.5205 21.9766 12.8877 21.5859 12.4971C21.1953 12.1064 20.5625 12.1064 20.1719 12.4971L14.6592 18.0098L11.8281 15.1777C11.4375 14.7871 10.8047 14.7871 10.4141 15.1777C10.0234 15.5684 10.0234 16.2012 10.4141 16.5918L13.9521 20.1309Z"
                        fill="#DA0806"
                      />
                    </svg>

                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <div>Start: {item.startDate}</div>
                        <div>End: {item.endDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
            
          </div>
        </div>
        <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 w-full h-full m-2 mb-6 ">
          <TripList trips={trips} totalTrips={450} className="sm:w-full mt-4" title="Recent Trips" />
          <div className="p-4 card w-full">map</div>
        </div>
        <div className="flex w-full mb-4">
          <div className="w-1/3">
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
