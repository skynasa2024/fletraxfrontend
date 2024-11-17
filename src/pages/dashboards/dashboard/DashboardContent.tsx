import { MaintenanceViolationTable } from './blocks/maintenance';
import { MileageEngineGraph } from './blocks/MileageEngineGraph';
import { MovingDeviceChart } from './blocks/MovingDeviceChart';
import { Notifications } from './blocks/Notifications';

const DashboardContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <MovingDeviceChart />
        </div>

        <div className="lg:col-span-2 max-h-[450px]">
          <MileageEngineGraph />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <Notifications />
        </div>

        <div className="lg:col-span-2">
          <MaintenanceViolationTable />
        </div>
      </div>
    </div>
  );
};

export { DashboardContent };
