import { getVehicles, updateVehicleStatus, VehicleDetails } from '@/api/cars';
import { KeenIcon } from '@/components';
import Image from '@/components/image/Image';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { toAbsoluteUrl } from '@/utils';
import { useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { STATUS_OPTIONS } from '../constants';
import { AutoSizer, Grid, InfiniteLoader } from 'react-virtualized';
import { Paginated } from '@/api/common.ts';
import { StatusDropdown } from '@/pages/dashboards/dashboard/blocks/StatusDropdown';

const COLUMN_COUNT = 3;
const SCROLLBAR_WIDTH = 20;

type VehiclesCardsViewProps = {
  searchQuery: string;
  refetchStats: () => void;
};

export default function VehiclesCardsView({ searchQuery, refetchStats }: VehiclesCardsViewProps) {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Paginated<VehicleDetails>>();

  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);

  const remoteRowCount = useMemo(() => {
    const totalCount = vehicles?.totalCount ?? 0;
    return Math.ceil(totalCount / COLUMN_COUNT);
  }, [vehicles]);

  const isRowLoaded = ({ index: rowIndex }: { index: number }) => {
    if (!vehicles?.data) return false;
    const baseIndex = rowIndex * COLUMN_COUNT;
    for (let i = 0; i < COLUMN_COUNT; i++) {
      if (!vehicles.data[baseIndex + i]) {
        return false;
      }
    }
    return true;
  };

  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const itemStart = startIndex * COLUMN_COUNT;
    const itemStop = stopIndex * COLUMN_COUNT + (COLUMN_COUNT - 1);

    const fetched = await getVehicles({
      start: itemStart,
      end: itemStop + 1,
      filters: [
        {
          id: '__any',
          value: searchQuery
        }
      ]
    });

    setVehicles((prev) => {
      const oldData = prev?.data ?? [];
      const newData = [...oldData];
      fetched.data.forEach((item, idx) => {
        newData[itemStart + idx] = item;
      });
      return {
        data: newData,
        totalCount: fetched.totalCount
      };
    });

    setMaxLoadedIndex((prevMax) => Math.max(prevMax, itemStop));
  };

  async function refetchAllLoadedRows() {
    if (maxLoadedIndex < 0) return;
    const fetched = await getVehicles({
      start: 0,
      end: maxLoadedIndex + 1,
      filters: [{ id: '__any', value: searchQuery }]
    });
    setVehicles(fetched);
  }

  useEffect(() => {
    (async () => {
      const fetched = await getVehicles({
        start: 0,
        end: 10,
        filters: [{ id: '__any', value: searchQuery }]
      });
      setVehicles(fetched);
      setMaxLoadedIndex(10);
    })();
  }, [searchQuery]);

  const handleViewVehicle = () => {
    navigate('view-vehicle');
  };

  return (
    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={remoteRowCount}>
      {({ onRowsRendered, registerChild }) => (
        <div style={{ width: '100%', height: '450px' }}>
          <AutoSizer>
            {({ width, height }) => {
              const widthWithoutScrollBar = width - SCROLLBAR_WIDTH;

              return (
                <Grid
                  ref={registerChild}
                  width={width}
                  height={height}
                  columnCount={COLUMN_COUNT}
                  columnWidth={widthWithoutScrollBar / COLUMN_COUNT}
                  rowCount={remoteRowCount}
                  rowHeight={275}
                  overscanRowCount={2}
                  onSectionRendered={({ rowOverscanStartIndex, rowOverscanStopIndex }) =>
                    onRowsRendered({
                      startIndex: rowOverscanStartIndex,
                      stopIndex: rowOverscanStopIndex
                    })
                  }
                  cellRenderer={({ key, rowIndex, columnIndex, style }) => {
                    const itemIndex = rowIndex * COLUMN_COUNT + columnIndex;
                    const vehicle = vehicles?.data[itemIndex];

                    return (
                      <div key={key} style={style} className="p-2">
                        <VehicleCard
                          vehicle={vehicle}
                          handleViewVehicle={handleViewVehicle}
                          refetchVehicles={refetchAllLoadedRows}
                          refetchStats={refetchStats}
                        />
                      </div>
                    );
                  }}
                />
              );
            }}
          </AutoSizer>
        </div>
      )}
    </InfiniteLoader>
  );
}

type VehicleCardProps = {
  vehicle?: VehicleDetails;
  handleViewVehicle: () => void;
  refetchVehicles: () => void;
  refetchStats: () => void;
};

function VehicleCard({
  vehicle,
  handleViewVehicle,
  refetchStats,
  refetchVehicles
}: VehicleCardProps) {
  if (!vehicle) {
    return (
      <div className="m-2 flex hover:shadow-md h-full w-full flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] dark:border-gray-200 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: '#212121' }} />
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] w-full h-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col gap-5 px-4 sm:px-6 lg:px-8 py-6 grow">
        <div className="flex justify-between items-center">
          <CarPlate plate={vehicle.vehicle.plate} />
          <StatusDropdown
            selected={vehicle.status}
            setSelected={async (value) => {
              await updateVehicleStatus(vehicle.vehicle.id, value);
              await refetchVehicles();
              refetchStats();
            }}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[38px] sm:justify-between">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <Image
                src={vehicle.customer.avatar}
                alt={vehicle.customer.name}
                title={vehicle.customer.name}
                className="size-10 object-cover aspect-square"
                fallback={
                  <div className="bg-neutral-200 size-10 aspect-square rounded-full flex items-center justify-center">
                    <KeenIcon style="duotone" icon="user" className="text-black" />
                  </div>
                }
              />
              <div className="w-full sm:w-48 text-nowrap">
                <div className="text-[#3F4254] font-bold text-[15px] text-ellipsis overflow-hidden">
                  {vehicle.customer.name}
                </div>
                <div className="text-[#B5B5C3] font-medium text-2sm text-ellipsis overflow-hidden">
                  {vehicle.customer.email}
                </div>
              </div>
            </div>
          </div>
          <Image
            src={vehicle.brandName}
            alt={vehicle.brandName}
            title={vehicle.brandName}
            className="size-10 object-cover aspect-square"
            fallback={
              <div className="bg-neutral-200 size-10 aspect-square rounded-full flex items-center justify-center">
                <KeenIcon style="duotone" icon="car" className="text-black" />
              </div>
            }
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div className="flex flex-wrap gap-4 sm:gap-[18px] text-[#72767C] font-dm-sans">
            <div className="flex gap-1">
              <img src={toAbsoluteUrl('/media/icons/gauge.svg')} />
              <span className="uppercase">{vehicle.mileage}</span>
            </div>
            <div className="flex gap-1">
              <img src={toAbsoluteUrl('/media/icons/manual.svg')} />
              <span>{vehicle.type}</span>
            </div>
          </div>
          <div className="text-md capitalize font-semibold text-[#3F4254] max-w-full sm:max-w-[92px] text-ellipsis overflow-hidden text-nowrap">
            {vehicle.brandName}
          </div>
        </div>
      </div>
      <div className="text-xs border-t grid grid-cols-4 w-full overflow-hidden rounded-b-2xl">
        <a
          href="#"
          onClick={handleViewVehicle}
          className="px-5 py-2 flex gap-2 border-e justify-center hover:bg-gray-50"
        >
          <img src={toAbsoluteUrl('/media/icons/view-light.svg')} />
          <span>View</span>
        </a>
        <a href="#" className="px-5 py-2 border-e justify-center flex gap-2 hover:bg-gray-50">
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>Edit</span>
        </a>
        <a href="#" className="px-5 py-2 border-e justify-center flex gap-2 hover:bg-gray-50">
          <img src={toAbsoluteUrl('/media/icons/rent-light.svg')} />
          <span>Rent</span>
        </a>
        <a href="#" className="px-5 py-2 flex gap-2 justify-center hover:bg-gray-50">
          <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
          <span>Delete</span>
        </a>
      </div>
    </div>
  );
}
