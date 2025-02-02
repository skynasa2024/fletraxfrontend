import { MaintenanceTable } from './blocks';
import { UserMiniCards } from './mini-cards/UserMiniCards';

const MaintenancePage = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">Maintenance List</h3>

        <a href="/maintenance/add-maintenance">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            New Maintenance
          </button>
        </a>
      </div>

      <UserMiniCards />
      <MaintenanceTable searchQuery={''} />
    </div>
  );
};

export { MaintenancePage };
