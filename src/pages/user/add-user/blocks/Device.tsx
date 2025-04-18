import { AddUserPageProps } from '../AddUserPage';
import { Paginated } from '@/api/common';
import { DeviceDTO, getLinkedDevices, getUnlinkedDevices, unlinkLinkDevice } from '@/api/devices';
import { useCallback, useEffect, useState } from 'react';
import { CircularProgress, Skeleton } from '@mui/material';
import { KeenIcon } from '@/components';
import DebouncedSearchInput from '@/pages/vehicle/components/DebouncedInputField';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import DeviceIcon from '@/pages/device/svg/device.svg?react';
import { FormattedMessage, useIntl } from 'react-intl';

const Device = ({ user }: AddUserPageProps) => {
  const intl = useIntl();
  const [linkedDevicesSearch, setLinkedDevicesSearch] = useState<string>('');
  const [unlinkedDevicesSearch, setUnlinkedDevicesSearch] = useState<string>('');
  const [linkedDevices, setLinkedDevices] = useState<Paginated<DeviceDTO>>();
  const [unlinkedDevices, setUnlinkedDevices] = useState<Paginated<DeviceDTO>>();
  const [lastLinkedDevices, setLastLinkedDevices] = useState(10);
  const [lastUnlinkedDevices, setLastUnlinkedDevices] = useState(10);

  useEffect(() => {
    getUnlinkedDevices({ start: 0, end: 10, search: unlinkedDevicesSearch }).then(
      setUnlinkedDevices
    );
  }, [unlinkedDevicesSearch]);

  useEffect(() => {
    if (!user) {
      setLinkedDevices({ data: [], totalCount: 0 });
      return;
    }
    getLinkedDevices(user.id, { start: 0, end: 10, search: linkedDevicesSearch }).then(
      setLinkedDevices
    );
  }, [linkedDevicesSearch, user]);

  const update = useCallback(() => {
    if (!user) {
      return;
    }
    getUnlinkedDevices({ start: 0, end: lastUnlinkedDevices, search: unlinkedDevicesSearch }).then(
      setUnlinkedDevices
    );
    getLinkedDevices(user.id, {
      start: 0,
      end: lastLinkedDevices,
      search: linkedDevicesSearch
    }).then(setLinkedDevices);
  }, [linkedDevicesSearch, unlinkedDevicesSearch, user, lastLinkedDevices, lastUnlinkedDevices]);

  return (
    <>
      <div className="card pb-2.5">
        <div className="p-4 gap-4 flex flex-col w-full items-center justify-between">
          <div className="flex items-center justify-between gap-2 w-full">
            <h3 className="card-title text-nowrap">
              <FormattedMessage id="DEVICE.GRID.UNLINKED_DEVICES" />
            </h3>
            {unlinkedDevices?.totalCount !== undefined && (
              <h5 className="text-sm text-gray-400">
                <FormattedMessage
                  id="DEVICE.GRID.DEVICES_COUNT"
                  values={{ count: unlinkedDevices.totalCount }}
                />
              </h5>
            )}
          </div>
          {/* Search Input */}
          {unlinkedDevices && (
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeenIcon style="duotone" icon="magnifier" />
              </div>
              <DebouncedSearchInput
                type="search"
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
                placeholder={intl.formatMessage({ id: 'COMMON.SEARCH' })}
                onDebounce={setUnlinkedDevicesSearch}
              />
            </div>
          )}
        </div>
        <div className="card-body p-0">
          {unlinkedDevices ? (
            <AutoSizer>
              {({ height, width }) => (
                <InfiniteLoader
                  isRowLoaded={({ index }) => !!unlinkedDevices.data[index]}
                  loadMoreRows={async ({ startIndex, stopIndex }) => {
                    const data = await getUnlinkedDevices({
                      start: startIndex,
                      end: stopIndex,
                      search: unlinkedDevicesSearch
                    });
                    setUnlinkedDevices((prev) => ({
                      data: [...(prev?.data ?? []), ...data.data],
                      totalCount: data.totalCount
                    }));
                    setLastUnlinkedDevices(stopIndex);
                  }}
                  rowCount={unlinkedDevices.totalCount}
                >
                  {({ onRowsRendered, registerChild }) => (
                    <List
                      ref={registerChild}
                      className="scrollable-y !overflow-x-hidden"
                      height={height}
                      width={width}
                      rowCount={unlinkedDevices.totalCount}
                      rowHeight={68}
                      rowRenderer={({ key, index, style }) => {
                        const device = unlinkedDevices?.data[index];

                        if (!device) {
                          return <Skeleton key={key} style={style} />;
                        }

                        return (
                          <div key={key} style={style} className="px-4 py-1">
                            <div className="p-4 border rounded-lg border-gray-200 flex items-center justify-between gap-4 h-full">
                              <div className="flex gap-2">
                                <DeviceIcon className="size-5 text-[#5151F9] shrink-0" />
                                <div className="font-semibold">{device.ident}</div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm !size-7 btn-icon btn-outline btn-success"
                                onClick={async () => {
                                  await unlinkLinkDevice(user!.id, device.ident);
                                  update();
                                }}
                              >
                                <KeenIcon icon="plus" />
                              </button>
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
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
      <div className="card pb-2.5">
        <div className="p-4 gap-4 flex flex-col items-center justify-between">
          <div className="flex items-center justify-between gap-2 w-full">
            <h3 className="card-title text-nowrap">
              <FormattedMessage id="DEVICE.GRID.LINKED_DEVICES" />
            </h3>
            {linkedDevices?.totalCount !== undefined && (
              <h5 className="text-sm text-gray-400">
                <FormattedMessage
                  id="DEVICE.GRID.DEVICES_COUNT"
                  values={{ count: linkedDevices.totalCount }}
                />
              </h5>
            )}
          </div>
          {/* Search Input */}
          {linkedDevices && (
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeenIcon style="duotone" icon="magnifier" />
              </div>
              <DebouncedSearchInput
                type="search"
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-info focus:border-info"
                placeholder={intl.formatMessage({ id: 'COMMON.SEARCH' })}
                onDebounce={setLinkedDevicesSearch}
              />
            </div>
          )}
        </div>
        <div className="card-body p-0">
          {linkedDevices ? (
            <AutoSizer>
              {({ height, width }) => (
                <InfiniteLoader
                  isRowLoaded={({ index }) => !!linkedDevices.data[index]}
                  loadMoreRows={async ({ startIndex, stopIndex }) => {
                    const data = await getLinkedDevices(user!.id, {
                      start: startIndex,
                      end: stopIndex,
                      search: linkedDevicesSearch
                    });
                    setLinkedDevices((prev) => ({
                      data: [...(prev?.data ?? []), ...data.data],
                      totalCount: data.totalCount
                    }));
                    setLastLinkedDevices(stopIndex);
                  }}
                  rowCount={linkedDevices.totalCount}
                >
                  {({ onRowsRendered, registerChild }) => (
                    <List
                      ref={registerChild}
                      className="scrollable-y !overflow-x-hidden"
                      height={height}
                      width={width}
                      rowCount={linkedDevices.totalCount}
                      rowHeight={68}
                      rowRenderer={({ key, index, style }) => {
                        const device = linkedDevices?.data[index];

                        if (!device) {
                          return <Skeleton key={key} style={style} />;
                        }

                        return (
                          <div key={key} style={style} className="px-4 py-1">
                            <div className="p-4 border rounded-lg border-gray-200 flex items-center gap-4 h-full">
                              <DeviceIcon className="size-5 text-[#5151F9]" />
                              <div className="font-semibold flex-1">{device.ident}</div>
                              <button
                                type="button"
                                className="btn btn-sm !size-7 btn-icon btn-outline btn-warning"
                                onClick={async () => {
                                  await unlinkLinkDevice(user!.parentId || 'null', device.ident);
                                  update();
                                }}
                              >
                                <KeenIcon icon="minus" />
                              </button>
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
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const DeviceBlock = ({ user }: AddUserPageProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h3 className="card-title">
          <FormattedMessage id="USER.ADD.TAB.DEVICE" />
        </h3>
      </div>
      <div className="card-body grid lg:grid-cols-2 gap-5 h-[470px]">
        <Device user={user} />
      </div>
    </div>
  );
};

export { Device, DeviceBlock };
