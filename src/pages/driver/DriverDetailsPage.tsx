import Toolbar from './Toolbar';
import FileList, { FileInfo } from './details-components/FileList';
import TripList from './details-components/TripList';
import Card from './details-components/Card';
import ProfileCard from './ProfileCard';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { DriverDetails, getDriver } from '@/api/drivers';
import { MaintenanceViolationTable } from '../dashboards/dashboard/blocks/maintenance/MaintenanceViolation';

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

const DriverDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState<DriverDetails | null>(null);
  useEffect(() => {
    if (!id) return;
    getDriver(id)
      .then((data) => {
        setDriver(data);
      })
      .catch(() => {
        navigate('/error/404');
      });
  }, [id, navigate]);

  const files = useMemo(() => {
    if (!driver) return [];

    const files: FileInfo[] = [];

    if (driver.identityType === 'National ID') {
      files.push({ name: 'Front National ID', url: driver.frontNationalIdPhoto });
      files.push({ name: 'Back National ID', url: driver.backNationalIdPhoto });
    }
    if (driver.identityType === 'Passport') {
      files.push({ name: 'Passport Photo', url: driver.passportPhoto });
      files.push({ name: 'Last Entry Photo', url: driver.lastEntryPhoto });
    }
    files.push({ name: 'Front Driving License', url: driver.frontDrivingLicensePhoto });
    files.push({ name: 'Back Driving License', url: driver.backDriverLicensePhoto });

    return files;
  }, [driver]);

  if (!id) {
    navigate('/error/404');
    return null;
  }

  if (!driver) {
    return null;
  }

  return (
    <>
      <Toolbar />
      <div className="w-full mx-auto px-4 mb-0">
        <div className="hover:shadow-md m-5 px-5 card mb-0">
          <ProfileCard
            profileImage={driver.driver.avatar}
            name={driver.driver.name}
            nationality={driver.nationality}
            plate={driver.vehicle.plate}
            dob={driver.dateOfBirth}
            email={driver.driver.email}
            phone={driver.phone}
            phone2={driver.phone2}
            country={driver.country}
            city={driver.city}
            address={driver.address}
          />
        </div>

        <div className="flex justify-between items-start px-5 mt-4">
          {/* Maintenance Card */}
          <Card
            type="maintenance"
            date="2024-12-01"
            count={5}
            unpaidAmount={2000}
            paidAmount={1500}
            title={''}
            description={''}
          />

          {/* Violations Card */}
          <Card
            type="violations"
            date="2024-12-02"
            count={3}
            unpaidAmount={1000}
            paidAmount={800}
            title={''}
            description={''}
          />
        </div>

        <div className="flex flex-col mb-4 md:flex-row space-y-4 md:space-x-4 h-full w-600 m-5 mt-0 ">
          <TripList
            trips={trips}
            totalTrips={450}
            className="sm:w-full mt-4 hover:shadow-md"
            title="Trips"
          />
          <div className="p-4 card hover:shadow-md w-full">map</div>
        </div>
        <div className="m-5">
          <MaintenanceViolationTable id={id} />
        </div>
        <div className="flex h-full flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 m-5">
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <FileList files={files} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDetailsPage;
