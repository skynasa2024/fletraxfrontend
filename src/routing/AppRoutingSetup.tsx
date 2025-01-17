import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { Device } from '@/pages/public-profile';
import { User } from '@/pages/public-profile/profiles/user';
import { Vehicles } from '@/pages/vehicle';

import { Driver } from '@/pages/driver';
import { Maintenance } from '@/pages/public-profile/profiles/maintenance';

import { AccountSettingsPlainPage } from '@/pages/account';
import { AddUser } from '@/pages/account/home/add-user';
import { AddDriver } from '@/pages/account/home/add-driver';
import { AddVehicle } from '@/pages/account/home/add-vehicle';
import DeviceDetailsPage from '@/pages/public-profile/profiles/default/DeviceDetailsPage';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { MonitoringPage } from '@/pages/monitoring/MonitoringPage';
import UserDetailsPage from '@/pages/public-profile/profiles/user/blocks/UserDetailsPage';
import VehicleDetailsPage from '@/pages/vehicle/blocks/VehicleDetailsPage';
import DriverDetailsPage from '@/pages/driver/DriverDetailsPage';
import { TripsPage } from '@/pages/trips/TripsPage';
import MaintenanceDetailsPage from '@/pages/public-profile/profiles/maintenance/blocks/MaintenanceDetailsPage';
import { AddMaintenance } from '@/pages/account/home/add-maintenance/AddMaintenance';
import { GeofencePage } from '@/pages/geofence/GeofencePage';

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

          <Route path="/maintenance/maintenance" element={<Maintenance />} />
          <Route
            path="/maintenance/maintenance/view-maintenance"
            element={<MaintenanceDetailsPage />}
          />
          <Route path="/maintenance/add-maintenance" element={<AddMaintenance />} />

          <Route path="/devices/device" element={<Device />} />
          <Route path="/devices/device/view-device" element={<DeviceDetailsPage />} />
          <Route path="/devices/add-device" element={<AccountSettingsPlainPage />} />

          <Route path="/users/user/*" element={<User />} />
          <Route path="/users/add-users" element={<AddUser />} />
          <Route path="/users/user/view-user" element={<UserDetailsPage />} />
          <Route path="/users/add-user" element={<AddUser />} />

          <Route path="/drivers/driver" element={<Driver />} />
          <Route path="/drivers/driver/view-driver" element={<DriverDetailsPage />} />
          <Route path="/drivers/add-driver" element={<AddDriver />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
