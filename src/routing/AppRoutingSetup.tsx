import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { User } from '@/pages/user';
import { Vehicles } from '@/pages/vehicle';

import { Driver } from '@/pages/driver';
import { Maintenance } from '@/pages/public-profile/profiles/maintenance';

import { AddUser } from '@/pages/user/add-user';
import { AddDriver } from '@/pages/driver/add-driver';
import { AddVehicle } from '@/pages/vehicle/add-vehicle';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { MonitoringPage } from '@/pages/monitoring/MonitoringPage';
import UserDetailsPage from '@/pages/user/blocks/UserDetailsPage';
import VehicleDetailsPage from '@/pages/vehicle/vehicle-details';
import DriverDetailsPage from '@/pages/driver/DriverDetailsPage';
import { TripsPage } from '@/pages/trips/TripsPage';
import MaintenanceDetailsPage from '@/pages/public-profile/profiles/maintenance/blocks/MaintenanceDetailsPage';
import { AddMaintenance } from '@/pages/account/home/add-maintenance/AddMaintenance';
import { GeofencePage } from '@/pages/geofence/GeofencePage';
import { Device } from '@/pages/device';
import DeviceDetailsPage from '@/pages/device/DeviceDetailsPage';
import { AddDevice } from '@/pages/device/add-device';
import { RequireRole } from '@/auth/RequireRole';
import Telemetry from '@/pages/device/blocks/Telemetry';
import PrivacyPolicyPage from '@/pages/privacy-policy';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/geofences" element={<GeofencePage />} />

          <Route path="/vehicles/vehicle" element={<Vehicles />} />
          <Route path="/vehicles/vehicle/:id" element={<VehicleDetailsPage />} />
          <Route path="/vehicles/add-vehicle" element={<AddVehicle />} />
          <Route path="/vehicles/edit/:id" element={<AddVehicle />} />

          <Route path="/maintenance/maintenance" element={<Maintenance />} />
          <Route
            path="/maintenance/maintenance/view-maintenance"
            element={<MaintenanceDetailsPage />}
          />
          <Route path="/maintenance/add-maintenance" element={<AddMaintenance />} />

          <Route path="/devices/device/" element={<Device />} />
          <Route path="/devices/device/:id" element={<DeviceDetailsPage />}>
            <Route index element={<Navigate to="telemetry" />} />
            <Route path="telemetry" element={<Telemetry />} />
          </Route>
          <Route element={<RequireRole role="admin" />}>
            <Route path="/devices/add-device" element={<AddDevice />} />
            <Route path="/devices/edit/:id" element={<AddDevice />} />
          </Route>

          <Route path="/users/user/" element={<User />} />
          <Route path="/users/user/:id" element={<UserDetailsPage />} />
          <Route path="/users/add-user" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<AddUser />} />

          <Route path="/drivers/driver" element={<Driver />} />
          <Route path="/drivers/driver/:id" element={<DriverDetailsPage />} />
          <Route path="/drivers/add-driver" element={<AddDriver />} />
          <Route path="/drivers/edit/:id" element={<AddDriver />} />
        </Route>
      </Route>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/hedef-privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
