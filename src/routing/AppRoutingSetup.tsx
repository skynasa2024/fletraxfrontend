import React, { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DashboardPage } from '@/pages/dashboards';
import { User } from '@/pages/user';
import { Vehicles } from '@/pages/vehicle';

import { Driver } from '@/pages/driver';
import { MaintenancePage } from '@/pages/maintenance';

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
import MaintenanceDetailsPage from '@/pages/maintenance/view-maintenance/MaintenanceDetailsPage';
import { GeofencePage } from '@/pages/geofence/GeofencePage';
import { Device } from '@/pages/device';
import DeviceDetailsPage from '@/pages/device/DeviceDetailsPage';
import { AddDevice } from '@/pages/device/add-device';
import { RequireRole } from '@/auth/RequireRole';
import PrivacyPolicyPage from '@/pages/privacy-policy';
import { AddVehicleScratches } from '@/pages/vehicle/add-vehicle/AddVehicleScratches';

import { MaintenanceTypeDetailsPage, MaintenanceTypePage } from '@/pages/maintenance-types';
import { AddMaintenance } from '@/pages/maintenance/add-maintenance/AddMaintenance';
import { AddMaintenanceType } from '@/pages/maintenance-types/add-maintenance-type/AddMaintenanceType';
import { AddGeofence } from '@/pages/geofence/add-geofence';
import ReportsPage from '@/pages/reports/ReportsPage';
import ManageDevices from '@/pages/management/manage-devices';
import { ReplayPage } from '@/pages/replay/ReplayPage';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/new-trips" element={<TripsPage />} />
          <Route path="/replay" element={<ReplayPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          <Route element={<RequireRole role="admin" />}>
            <Route path="/management/devices" element={<ManageDevices />} />
          </Route>

          <Route path="/geofences" element={<GeofencePage />} />
          <Route path="/geofences/add" element={<AddGeofence />} />
          <Route path="/geofences/edit/:id" element={<AddGeofence />} />

          <Route path="/vehicles/vehicle" element={<Vehicles />} />
          <Route path="/vehicles/vehicle/:id" element={<VehicleDetailsPage />} />
          <Route path="/vehicles/add-vehicle" element={<AddVehicle />} />
          <Route path="/vehicles/edit/:id" element={<AddVehicle />} />
          <Route path="/vehicles/edit-scratches/:id" element={<AddVehicleScratches />} />

          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/maintenance/add" element={<AddMaintenance />} />
          <Route path="/maintenance/edit/:id" element={<AddMaintenance />} />
          <Route path="/maintenance/view/:id" element={<MaintenanceDetailsPage />} />

          <Route element={<RequireRole role="admin" />}>
            <Route path="/maintenance/maintenance-type" element={<MaintenanceTypePage />} />
            <Route path="/maintenance/maintenance-type/add" element={<AddMaintenanceType />} />
            <Route path="/maintenance/maintenance-type/edit/:id" element={<AddMaintenanceType />} />
            <Route
              path="/maintenance/maintenance-type/view/:id"
              element={<MaintenanceTypeDetailsPage />}
            />
          </Route>

          <Route path="/devices/device/" element={<Device />} />
          <Route path="/devices/device/:id" element={<DeviceDetailsPage />} />
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
      <Route path="/hedef-privacy-policy" element={<PrivacyPolicyPage productName="Hedef" />} />
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
