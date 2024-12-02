import { MaintenanceViolationTable } from './blocks/maintenance/MaintenanceViolation';


import Toolbar from './Toolbar';
import FileList from './details-components/FileList';
import TripList from './details-components/TripList';
import ProfileCard from './ProfileCard';
import Card from './details-components/Card';
import { BillingTable } from './details-components/BillingTable';

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
  },
  {
    name: 'file-name3.JPG',
    size: '32mb',
    version: 'v1.2.2',
    type: 'jpg'
  }
];

const VehicleInfoCards = () => {


  return (
    <>
      <Toolbar />
      <div className="w-full mx-auto px-4">
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
          <ProfileCard
            profileImage="/path/to/image.jpg"
            name="Brad Dennis"
            nationality="Turkish"
            code="GL96ABR"
            company="Toyota"
            dob="01 / 06 / 1983"
            email="mail@gmail.com"
            phone="+90954948849"
            country="Turkey"
            city="Istanbul"
            address="Some address"
          />

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <Card
              type="maintenance"
              title="Maintenance"
              description="Maintenance"
              count={25}
              date="For today"
            />
            <Card
              type="violations"
              title="Violations"
              description="Violations"
              count={1}
              date="For today"
            />
          </div>
        </div>
        <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full w-600 m-2 mb-6 ">
          <TripList trips={trips} totalTrips={450} className="sm:w-full mt-4" title="Trips" />
          <div className="p-4 card w-full">map</div>
        </div>
        <div className="mb-5">
          <MaintenanceViolationTable />
        </div>
        <div className="flex flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4 ps-4">Performance Metrics</h2>
            <FileList files={files} onView={(file) => console.log('Viewing file:', file.name)} />
          </div>
          <BillingTable searchQuery={''} />
        </div>

       
      </div>
    </>
  );
};

export default VehicleInfoCards;
