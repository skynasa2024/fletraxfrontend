import { useEffect, useState } from 'react';
import { KeenIcon } from '@/components';
import { getVehicles, VehicleDetails } from '@/api/cars.ts';
import { Paginated } from '@/api/common.ts';
import { Download, Filter } from 'lucide-react';
import clsx from 'clsx';
import VehiclesGridView from '../components/VehiclesGridView.tsx';
import VehiclesCardsView from '../components/VehiclesCardsView.tsx';

type ViewMode = 'grid' | 'card';

type VehicleListProps = {
  fetchVehicleStats: () => void;
};

function VehicleList({ fetchVehicleStats }: VehicleListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();

  useEffect(() => {
    (async () => {
      const vehicles = await getVehicles({ pageIndex: 0, pageSize: 1 });
      setVehicles(vehicles);
    })();
  }, []);

  return (
    <div className="card">
      <div className="px-4 sm:px-7 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="card-title">
          <h3>Vehicle</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            You have {vehicles?.totalCount}{' '}
            {(vehicles?.totalCount ?? 0 > 1) ? 'vehicles' : 'vehicle'}
          </h4>
        </div>
        <div className="flex items-center gap-4">
          {/* View Mode Buttons */}
          <button
            className={clsx(
              'p-3 transition-colors border rounded-lg flex items-center justify-center',
              viewMode === 'card' ? 'text-info' : 'hover:bg-gray-50'
            )}
            onClick={() => setViewMode('card')}
            title="Card View"
          >
            <KeenIcon
              style="duotone"
              icon="category"
              className={clsx(viewMode === 'card' ? 'text-info' : 'text-gray-400')}
            />
          </button>
          <button
            className={clsx(
              'p-3 transition-colors border rounded-lg flex items-center justify-center',
              viewMode === 'grid' ? 'text-info' : 'hover:bg-gray-50'
            )}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <KeenIcon
              style="duotone"
              icon="row-horizontal"
              className={clsx(viewMode === 'grid' ? 'text-info' : 'text-gray-400')}
            />
          </button>
          {/* Filters Button */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg border hover:bg-gray-50">
              <Filter size={16} />
              <span>Filters</span>
              <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-100 rounded-full">
                2
              </span>
            </button>
          </div>
          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border">
            <Download size={16} />
            <span>Export</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <KeenIcon style="duotone" icon="magnifier" />
            </div>
            <input
              type="search"
              className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
      <div className="gap-cols responsive-card">
        <div className="card-body pt-2 px-2 sm:px-6 pb-7">
          {viewMode === 'grid' ? (
            <VehiclesGridView searchQuery="" refetchStats={fetchVehicleStats} />
          ) : (
            <VehiclesCardsView searchQuery="" refetchStats={fetchVehicleStats} />
          )}
        </div>
      </div>
    </div>
  );
}

export { VehicleList };
