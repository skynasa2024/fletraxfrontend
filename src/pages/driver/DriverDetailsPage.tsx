import Toolbar from './Toolbar';
import FileList, { FileInfo } from './details-components/FileList';
import Card from './details-components/Card';
import ProfileCard from './ProfileCard';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { DriverDetails, getDriver } from '@/api/drivers';
import { MaintenanceViolationTable } from '../dashboards/blocks/maintenance/MaintenanceViolation';
import TripList from '../vehicle/blocks/details-components/TripList';
import VehicleCurrentLocation from '../vehicle/vehicle-details/components/VehicleCurrentLocation';

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

        <div className="flex px-5 mt-4 gap-4">
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
          <div className="card hover:shadow-md flex-1 w-full">
            <VehicleCurrentLocation deviceIdent="" />
          </div>

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

        <TripList deviceIdent="" />
        <div className="m-5">
          <MaintenanceViolationTable id={driver.vehicle.id} />
        </div>
        <div className="flex h-full flex-grow mb-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 m-5">
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <FileList files={files} columns={2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDetailsPage;
