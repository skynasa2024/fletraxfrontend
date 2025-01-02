import React, { ReactNode, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { MaintenanceViolationTable } from '../blocks/maintenance/MaintenanceViolation';
import Toolbar from './Toolbar';
import { Model, ModelSeries, ModelYear, FuelType, Gear, Volume, Power, Color, Tayp } from './svg';
import VehicleMetrics from './details-components/VehicleMetrics';
import FileList from './details-components/FileList';
import GeofenceList from './details-components/GeofenceList';
import TripList from './details-components/TripList';
import { toAbsoluteUrl } from '@/utils';
import { useParams } from 'react-router-dom';
import BrandLogo from './Brand logo';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';

const VehicleInfoCards = () => {
  const [selectedPoint, setSelectedPoint] = useState<InspectionPoint | null>(null);
  const { id } = useParams();

  const inspectionPoints = [
    {
      id: 1,
      position: 'top-0 left-1/3 -translate-x-1/2',
      title: 'Front Hood',
      image: '/api/placeholder/200/150',
      description: 'Minor wear on hood surface'
    },
    {
      id: 2,
      position: 'top-0 left-1/2 -translate-x-1/2',
      title: 'Front Windshield',
      image: '/api/placeholder/200/150',
      description: 'No cracks or chips detected'
    },
    {
      id: 3,
      position: 'top-0 right-1/3 translate-x-1/2',
      title: 'Roof',
      image: '/api/placeholder/200/150',
      description: 'Paint in good condition'
    },
    {
      id: 4,
      position: 'top-1/4 left-1/4',
      title: 'Left Mirror',
      image: '/api/placeholder/200/150',
      description: 'Functioning properly'
    },
    {
      id: 5,
      position: 'top-1/4 left-1/2 -translate-x-1/2',
      title: 'Front Seats',
      image: '/api/placeholder/200/150',
      description: 'Clean interior'
    },
    {
      id: 6,
      position: 'top-1/4 right-1/4',
      title: 'Right Mirror',
      image: '/api/placeholder/200/150',
      description: 'Minor scratches'
    },
    {
      id: 7,
      position: 'bottom-1/4 left-1/4',
      title: 'Left Wheel',
      image: '/api/placeholder/200/150',
      description: 'Tread depth normal'
    },
    {
      id: 8,
      position: 'bottom-1/4 left-1/2 -translate-x-1/2',
      title: 'Undercarriage',
      image: '/api/placeholder/200/150',
      description: 'No visible damage'
    },
    {
      id: 9,
      position: 'bottom-1/4 right-1/4',
      title: 'Right Wheel',
      image: '/api/placeholder/200/150',
      description: 'Alignment checked'
    },
    {
      id: 10,
      position: 'bottom-4 left-1/3 -translate-x-1/2',
      title: 'Rear Left',
      image: '/api/placeholder/200/150',
      description: 'Tail light functional'
    },
    {
      id: 11,
      position: 'bottom-4 left-1/2 -translate-x-1/2',
      title: 'Trunk',
      image: '/api/placeholder/200/150',
      description: 'Latch working properly'
    },
    {
      id: 12,
      position: 'bottom-4 right-1/3 translate-x-1/2',
      title: 'Rear Right',
      image: '/api/placeholder/200/150',
      description: 'Brake light working'
    }
  ];

  const trips = Array(10)
    .fill(null)
    .map(() => ({
      distance: `${(Math.random() * 10 + 1).toFixed(2)} KM`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split('T')[0],
      startTime: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      endTime: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
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
  const files = [
    { name: 'file-name1.pdf', size: '32mb', version: 'v1.2.2', type: 'pdf' },
    { name: 'file-name2.JPG', size: '32mb', version: 'v1.2.2', type: 'jpg' }
  ];

  interface InspectionPoint {
    time: ReactNode;
    date: ReactNode;
    id: number;
    position: string;
    title: string;
    image: string;
    description: string;
  }

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
      <div className="px-10">
        <div className="flex flex-col lg:flex-row">
          <div className="card hover:shadow-md w-full lg:w-2/3 grid grid-cols-1 mb-2">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3">
              <div className="flex items-center justify-center mb-4">
                <CarPlate plate="5484555" />
              </div>
              <div className="flex items-center justify-center">
                <BrandLogo brand="toyota" size="lg" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-4 rounded-full"></div>
                <div>
                  <span className="text-lg font-medium">41643739</span>
                  <p className="text-sm text-gray-500">Device</p>
                </div>
              </div>

              <div className="relative flex p-4 justify-center items-center col-span-full mb-4">
                <img src={toAbsoluteUrl('/media/images/car.png')} alt="Car" />
                <div className="absolute top-10 left-[200px] w-16 h-20 border-t-2 border-l-2 border-blue-500 rounded-tl-full" />
                <div className="absolute top-10 right-[200px] w-16 h-20 border-t-2 border-r-2 border-blue-500 rounded-tr-full shadow-md" />
                <div className="absolute bottom-10 left-[200px] w-16 h-20 border-b-2 border-l-2 border-blue-500 rounded-bl-full shadow-md" />
                <div className="absolute bottom-10 right-[200px] w-16 h-20 border-b-2 border-r-2 border-blue-500 rounded-br-full shadow-md" />
                {selectedPoint && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative flex">
                      {/* Close button */}
                      <button
                        onClick={() => setSelectedPoint(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                      >
                        &times;
                      </button>

                      {/* Image on the left */}
                      <div className="flex justify-self-stretch">
                        <div className="w-1/2 pr-4">
                          <img
                            src={selectedPoint.image}
                            alt={selectedPoint.title}
                            className="w-full h-25 object-cover rounded-md"
                          />
                        </div>

                        {/* Content on the right */}
                        <div className="w-1/2 space-y-4">
                          {/* <h3 className="text-lg font-semibold">{selectedPoint.title}</h3>*/}

                          {/* Date and Time */}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg
                              width="30"
                              height="30"
                              viewBox="0 0 30 30"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width="30" height="30" rx="6" fill="#F4F4F8" />
                              <path
                                d="M7.32431 10.4288C7.42306 8.78656 8.79431 7.5 10.4459 7.5H11.2499V6.875C11.2499 6.53 11.5299 6.25 11.8749 6.25C12.2199 6.25 12.4999 6.53 12.4999 6.875V7.5H17.4999V6.875C17.4999 6.53 17.7799 6.25 18.1249 6.25C18.4699 6.25 18.7499 6.53 18.7499 6.875V7.5H19.554C21.2059 7.5 22.5771 8.78656 22.6756 10.4288C22.8609 13.5175 22.8574 16.6506 22.6652 19.7409C22.5677 21.3103 21.3106 22.5675 19.7412 22.665C18.1684 22.7628 16.5843 22.8116 15.0002 22.8116C13.4165 22.8116 11.8321 22.7628 10.2593 22.665C8.68993 22.5675 7.43275 21.3103 7.33525 19.7409C7.14275 16.6522 7.13931 13.5194 7.32431 10.4288ZM8.58243 19.6634C8.64118 20.605 9.39525 21.3591 10.3365 21.4175C13.4309 21.6097 16.569 21.6097 19.6634 21.4175C20.6049 21.3587 21.359 20.6047 21.4174 19.6634C21.5652 17.2875 21.5956 14.8866 21.5165 12.5H8.48306C8.40431 14.8875 8.43462 17.2884 8.58243 19.6634ZM18.1249 10C17.7799 10 17.4999 9.72 17.4999 9.375V8.75H12.4999V9.375C12.4999 9.72 12.2199 10 11.8749 10C11.5299 10 11.2499 9.72 11.2499 9.375V8.75H10.4459C9.45431 8.75 8.63118 9.52031 8.57212 10.5034C8.55743 10.7516 8.55118 11.0012 8.539 11.25H21.4609C21.4484 11.0012 21.4424 10.7516 21.4277 10.5034C21.3687 9.52031 20.5459 8.75 19.554 8.75H18.7499V9.375C18.7499 9.72 18.4699 10 18.1249 10Z"
                                fill="#5271FF"
                              />
                              <path
                                d="M18.125 16.25C17.6072 16.25 17.1875 15.8303 17.1875 15.3125C17.1875 14.7947 17.6072 14.375 18.125 14.375C18.6428 14.375 19.0625 14.7947 19.0625 15.3125C19.0625 15.8303 18.6428 16.25 18.125 16.25Z"
                                fill="#5271FF"
                              />
                              <path
                                d="M15 16.25C14.4822 16.25 14.0625 15.8303 14.0625 15.3125C14.0625 14.7947 14.4822 14.375 15 14.375C15.5178 14.375 15.9375 14.7947 15.9375 15.3125C15.9375 15.8303 15.5178 16.25 15 16.25Z"
                                fill="#5271FF"
                              />
                              <path
                                d="M18.125 19.375C17.6072 19.375 17.1875 18.9553 17.1875 18.4375C17.1875 17.9197 17.6072 17.5 18.125 17.5C18.6428 17.5 19.0625 17.9197 19.0625 18.4375C19.0625 18.9553 18.6428 19.375 18.125 19.375Z"
                                fill="#5271FF"
                              />
                              <path
                                d="M11.875 16.25C11.3572 16.25 10.9375 15.8303 10.9375 15.3125C10.9375 14.7947 11.3572 14.375 11.875 14.375C12.3928 14.375 12.8125 14.7947 12.8125 15.3125C12.8125 15.8303 12.3928 16.25 11.875 16.25Z"
                                fill="#5271FF"
                              />
                              <path
                                d="M11.875 19.375C11.3572 19.375 10.9375 18.9553 10.9375 18.4375C10.9375 17.9197 11.3572 17.5 11.875 17.5C12.3928 17.5 12.8125 17.9197 12.8125 18.4375C12.8125 18.9553 12.3928 19.375 11.875 19.375Z"
                                fill="#5271FF"
                              />
                              <path
                                d="M15 19.375C14.4822 19.375 14.0625 18.9553 14.0625 18.4375C14.0625 17.9197 14.4822 17.5 15 17.5C15.5178 17.5 15.9375 17.9197 15.9375 18.4375C15.9375 18.9553 15.5178 19.375 15 19.375Z"
                                fill="#5271FF"
                              />
                            </svg>
                            <div>
                              <span  className="font-bold text-gray-600">Date: {selectedPoint.date}</span>
                              <br />
                              <span  className="font-bold text-gray-600">Time: {selectedPoint.time}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600">{selectedPoint.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {inspectionPoints.map((point) => (
                  <button
                    key={point.id}
                    className={`absolute ${point.position} border hover:shadow-md bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-all`}
                    onClick={() => setSelectedPoint(point)}
                  >
                    +
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="container px-2 mx-auto pl-5 grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            <div className="flex flex-col lg:flex-row h-full">
              <div className="flex-grow mr-0 lg:mr-4 h-full">
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4 h-full">
                  {vehicleInfo.map(({ label, value, Icon }, index) => (
                    <div
                      key={index}
                      className="card p-4 rounded-lg hover:shadow-md flex flex-col h-full"
                      style={{ width: '100%' }}
                    >
                      <Icon className="w-6 h-6 text-gray-600" />
                      <span className="text-sm text-gray-500 font-medium my-2">{label}</span>
                      <span className="text-lg font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-grow lg:w-1/3 mb-4 card hover:shadow-md overflow-hidden p-4 flex flex-col h-full">
                <img
                  className="w-full rounded-lg object-cover h-40 mb-4"
                  src="/api/placeholder/400/320"
                  alt="Map"
                />
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

            <div className="card hover:shadow-md mb-2 p-4 mt-4">
              <h2 className="text-xl font-semibold mb-2 border-b-2 pb-2">
                Vehicle Inspection and Insurance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {items.map((item) => (
                  <div key={item.title} className="flex items-start space-x-3 rounded-lg mb-4">
                    <div className="rounded-lg p-3 bg-gray-200">
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
          <TripList trips={trips} totalTrips={450} className="sm:w-full mt-4" title="Trips" />
          <div className="p-4 card hover:shadow-md  w-full">map</div>
        </div>
        <div className="flex flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
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
            <MaintenanceViolationTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleInfoCards;
