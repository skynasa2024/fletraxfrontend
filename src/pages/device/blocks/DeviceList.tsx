import ViewIcon from './icons/viewIcon';
import ConnectIcon from './icons/ConnectIcon';
import OnOffIcon from './icons/OnOffIcon';
import DeviceCard from './DeviceCard';
import { useEffect, useMemo, useState } from 'react';
import { Paginated } from '@/api/common';
import { DeviceDTO, getDevices } from '@/api/devices';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { CircularProgress, Skeleton } from '@mui/material';
import DeviceIcon from '../svg/device.svg?react';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { KeenIcon } from '@/components';
import RoleComponent from '@/components/RoleComponent';

type DeviceListProps = {
  refetchStats: () => void;
};

const DeviceList = ({ refetchStats }: DeviceListProps) => {
  const [devices, setDevices] = useState<Paginated<DeviceDTO>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [maxLoadedIndex, setMaxLoadedIndex] = useState(0);

  const remoteRowCount = useMemo(() => {
    return devices?.totalCount ?? 0;
  }, [devices]);

  const isRowLoaded = ({ index }: { index: number }) => !!devices?.data[index];
  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const fetched = await getDevices({
      start: startIndex,
      end: stopIndex + 1,
      search: searchQuery
    });

    setDevices((prev) => {
      const oldData = prev?.data ?? [];
      const newData = [...oldData];
      fetched.data.forEach((item, idx) => {
        newData[startIndex + idx] = item;
      });
      return {
        data: newData,
        totalCount: fetched.totalCount
      };
    });

    setMaxLoadedIndex((prevMax) => Math.max(prevMax, stopIndex));
  };

  async function refetchAllLoadedRows() {
    if (maxLoadedIndex < 0) return;
    const fetched = await getDevices({
      start: 0,
      end: maxLoadedIndex + 1,
      search: searchQuery
    });
    setDevices(fetched);
  }

  useEffect(() => {
    (async () => {
      const fetched = await getDevices({
        start: 0,
        end: 10,
        search: searchQuery
      });
      setDevices(fetched);
      setMaxLoadedIndex(10);
    })();
  }, [searchQuery]);

  return (
    <div className="space-y-4 flex-1 h-full min-h-80">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Device List</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeenIcon style="duotone" icon="magnifier" />
          </div>
          <DebouncedSearchInput
            type="search"
            className="w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
            placeholder="Search"
            onDebounce={setSearchQuery}
          />
        </div>
      </div>
      <div className="space-y-4 w-full h-full">
        {devices ? (
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={remoteRowCount}
              >
                {({ onRowsRendered, registerChild }) => (
                  <List
                    ref={registerChild}
                    className="scrollable-y !overflow-x-hidden"
                    height={height}
                    width={width}
                    rowCount={remoteRowCount}
                    rowHeight={170}
                    rowRenderer={({ key, index, style }) => {
                      const device = devices.data[index];

                      if (!device) {
                        return <Skeleton key={key} style={style} />;
                      }

                      return (
                        <div key={key} style={style} className="pb-2">
                          <div className="card hover:shadow-lg p-2 px-8">
                            <div className="flex justify-between gap-4">
                              {/* Device Info */}
                              <div className="flex items-center gap-4">
                                <DeviceIcon color="#5151F9" className="size-12 min-w-12" />
                                <div>
                                  <p className="text-lg text-gray-700">{device.ident}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-center">
                                <CarPlate className="w-auto" plate={device.vehiclePlate} />
                              </div>

                              {/* Device Card */}
                              <div className="md:col-span-1">
                                <DeviceCard
                                  deviceName="Protocol"
                                  lastActive="Type"
                                  icon1Count={2}
                                  icon2Count={5}
                                  icon3Count={8}
                                  icon4Count={4}
                                />
                              </div>

                              {/* Device Card */}
                              <div className="md:col-span-1">
                                <DeviceCard
                                  deviceName="Subscription start date"
                                  lastActive="Subscription end date"
                                  icon1Count={2}
                                  icon2Count={5}
                                  icon3Count={8}
                                  icon4Count={4}
                                />
                              </div>
                              <div>
                                Time zone
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end items-center gap-2">
                                <a href={`/devices/device/${device.id}`}>
                                  <button className="w-12 h-12 rounded-lg hover:bg-gray-100">
                                    <ViewIcon />
                                  </button>
                                </a>
                                <RoleComponent role="admin">
                                <button className="w-12 h-12 rounded-lg hover:bg-gray-100">
                                  <ConnectIcon />
                                  delete
                                </button>
                                <button className="w-12 h-12 rounded-lg hover:bg-gray-100">
                                  <OnOffIcon />
                                  edit
                                </button>
                                </RoleComponent>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    onRowsRendered={onRowsRendered}
                  />
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export { DeviceList as DeviceList };
