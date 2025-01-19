import { KeenIcon, Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { ButtonRadioGroup } from '@/pages/dashboards/dashboard/blocks/ButtonRadioGroup';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { AutoSizer, List } from 'react-virtualized';
import { toAbsoluteUrl } from '@/utils';
import { useSearchParams } from 'react-router-dom';

export const MainCard = () => {
  const [searchParams] = useSearchParams();
  const {
    clients,
    setSelectedClient,
    selectedClient,
    locations,
    selectedLocation,
    setSelectedLocation,
    search
  } = useMonitoringProvider();
  const [searchTarget, setSearchTarget] = useState(searchParams.get('target') ?? 'User');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [selection, setSelection] = useState('All');
  const [resizableHeight, setResizableHeight] = useState(200);
  const onlineLocations = useMemo(() => locations.filter((loc) => loc.online), [locations]);
  const offlineLocations = useMemo(() => locations.filter((loc) => !loc.online), [locations]);
  const activeLocations = useMemo(
    () =>
      selection === 'All' ? locations : selection === 'Online' ? onlineLocations : offlineLocations,
    [locations, offlineLocations, onlineLocations, selection]
  );
  const locationsListRef = useRef<List>(null);

  useEffect(() => {
    if (!selectedLocation) return;

    locationsListRef.current?.scrollToRow(
      activeLocations.findIndex((v) => v.vehicle.imei === selectedLocation?.vehicle.imei)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  const getBatteryIcon = (batteryLevel: number) => {
    // Available options are 5, 3, 1, 0
    if (batteryLevel >= 70) return 'battery-5';
    if (batteryLevel >= 30) return 'battery-3';
    if (batteryLevel > 0) return 'battery-1';
    return 'battery-0';
  };

  return (
    <div className="card-body md:w-[380px] flex flex-col gap-4 px-3 py-3 h-full">
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          search(searchTarget, searchQuery);
        }}
      >
        <div className="input input-sm h-[34px] ps-0">
          <Menu>
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 0] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-clear font-semibold text-xs h-fit px-3 py-[6px] border-0 rounded-none border-e-2 border-dashed border-[#E4E6EF] dark:border-gray-400">
                {searchTarget}
                <KeenIcon icon="down" className="!text-inherit !text-xs" />
              </MenuToggle>
              <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
                {['User', 'Vehicle'].map((target) => (
                  <MenuItem
                    key={target}
                    onClick={() => {
                      setSearchTarget(target);
                    }}
                  >
                    <MenuLink>
                      <MenuTitle>{target}</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                ))}
              </MenuSub>
            </MenuItem>
          </Menu>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-icon my-auto"
            type="button"
            onClick={() => {
              setSearchQuery('');
              search(searchTarget, '');
            }}
          >
            <KeenIcon icon="cross" />
          </button>
        </div>
        <button className="btn btn-info btn-icon size-[34px]" type="submit">
          <img src={toAbsoluteUrl('/media/icons/search.svg')} />
        </button>
      </form>
      <div className="flex-1">
        <AutoSizer>
          {({ width, height }) => (
            <div className="flex flex-col gap-2" style={{ width, height }}>
              <Resizable
                height={resizableHeight}
                onResize={(_, data) => {
                  setResizableHeight(data.size.height);
                }}
                minConstraints={[width, 200]}
                maxConstraints={[width, height]}
                axis="y"
                className="w-full relative"
                resizeHandles={['s']}
                handle={(_, ref) => (
                  <div
                    className="flex flex-col items-center gap-1 py-1 bg-[#F5F5FC] dark:bg-gray-300 w-full absolute bottom-0 cursor-ns-resize"
                    ref={ref}
                  >
                    <div className="h-[1px] bg-[#5E6278] dark:bg-[#F5F5FC] w-12" />
                    <div className="h-[1px] bg-[#5E6278] dark:bg-[#F5F5FC] w-8" />
                  </div>
                )}
              >
                <div>
                  <List
                    rowRenderer={({ index, key, style }) => {
                      const client = clients[index];
                      return (
                        <div key={key} style={style}>
                          <div
                            data-selected={selectedClient?.name === client.name}
                            className="flex p-[10px] gap-4 justify-between text-[#3F4254] dark:text-gray-700 font-roboto data-[selected=true]:border border-[#5151F9] rounded-md cursor-pointer"
                            onClick={() => {
                              if (selectedClient?.name === client.name) {
                                setSelectedClient(undefined);
                                return;
                              }
                              setSelectedClient(client);
                            }}
                          >
                            <div className="flex gap-2 items-center font-medium">
                              <img
                                src={
                                  client.avatar ||
                                  toAbsoluteUrl('/media/avatars/avatar-placeholder.png')
                                }
                                className="size-8 rounded-md object-contain"
                              />
                              <span>{client.name}</span>
                            </div>
                            <div className="font-semibold">
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full border-2 border-[red] size-2" />
                                <span>{client.offlineDevices}</span>
                              </div>
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full border-2 border-[#50CD89] size-2" />
                                <span>{client.onlineDevices}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    rowCount={clients.length}
                    rowHeight={58}
                    height={resizableHeight}
                    width={width}
                    className="scrollable-y pb-4"
                  />
                </div>
              </Resizable>
              <div className="flex justify-center bg-[#F5F8FA] dark:bg-gray-200 rounded-lg py-2">
                <ButtonRadioGroup
                  selection={selection}
                  selections={['All', 'Online', 'Offline']}
                  suffix={{
                    All: ` (${locations.length})`,
                    Online: ` (${onlineLocations.length})`,
                    Offline: ` (${offlineLocations.length})`
                  }}
                  setSelection={setSelection}
                  className="btn btn-light data-[selected=false]:btn-clear uppercase border-0"
                />
              </div>
              <List
                ref={locationsListRef}
                rowRenderer={({ index, key, style }) => {
                  const location = activeLocations[index];
                  return (
                    <div key={key} style={style} className="pb-2">
                      <div
                        data-selected={selectedLocation?.vehicle.imei === location.vehicle.imei}
                        className="flex flex-col p-[15px] border data-[selected=true]:border-[#5151F9] dark:data-[selected=true]:border-[#5151F9] data-[selected=true]:bg-[#5151F9]/5 border-[#E7E8ED] dark:border-gray-300 rounded-[10px] gap-[10px] cursor-pointer"
                        onClick={() => {
                          if (selectedLocation?.vehicle.imei === location.vehicle.imei) {
                            setSelectedLocation(undefined);
                            return;
                          }
                          setSelectedLocation(location);
                        }}
                      >
                        <div className="flex justify-between">
                          <CarPlate plate={location.vehicle.plate} />
                          <div
                            data-online={location.online}
                            className="rounded-md font-medium text-xs bg-[#F1416C]/10 text-[#F1416C] data-[online=true]:bg-[#50CD89]/10 data-[online=true]:text-[#50CD89] px-[10px] py-[6px] self-center"
                          >
                            {location.online ? 'Online' : 'Offline'}
                          </div>
                        </div>
                        <div className="border-b-2 border-[#E4E6EF] dark:border-gray-400 border-dashed" />
                        <div className="flex justify-between font-semibold text-xs">
                          <div>
                            <div>{location.vehicle.name}</div>
                            <div>{location.vehicle.imei}</div>
                          </div>
                          <img
                            src={toAbsoluteUrl(
                              `/media/icons/${getBatteryIcon(location.status.batteryLevel)}.svg`
                            )}
                          />
                        </div>
                        <div className="border-b-2 border-[#E4E6EF] dark:border-gray-400 border-dashed" />
                        <div className="flex gap-[10px] text-[10px] font-semibold justify-evenly">
                          <div className="flex flex-col gap-0.5 items-start">
                            <img
                              src={toAbsoluteUrl(
                                `/media/icons/${location.status.engineStatus ? 'on' : 'off'}.svg`
                              )}
                            />
                            <div>{location.status.engineStatus ? 'ON' : 'OFF'}</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-start">
                            <img
                              src={toAbsoluteUrl(
                                `/media/icons/${location.status.speed > 1 ? 'speed-moving' : 'speed-stop'}.svg`
                              )}
                            />
                            <div>{`${location.status.speed.toFixed(0)}kmh`}</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-start">
                            <img src={toAbsoluteUrl('/media/icons/satellites.svg')} />
                            <div>{location.status.satellietes}</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-start">
                            <img
                              src={toAbsoluteUrl(
                                `/media/icons/${location.status.signalLevel >= 50 ? 'signal-good' : 'signal-medium'}.svg`
                              )}
                            />
                            <div>{`${location.status.signalLevel}%`}</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-start">
                            <img
                              src={toAbsoluteUrl(
                                `/media/icons/${location.status.defenseStatus ? 'defense-active' : 'defense-inactive'}.svg`
                              )}
                            />
                            <div>{location.status.defenseStatus ? 'Active' : 'Inactive'}</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-start">
                            <img
                              src={toAbsoluteUrl(
                                `/media/icons/${location.status.engineBlocked ? 'engine-block-active' : 'engine-block-inactive'}.svg`
                              )}
                            />
                            <div>{location.status.engineBlocked ? 'Active' : 'Inactive'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
                rowCount={activeLocations.length}
                rowHeight={192}
                height={height - resizableHeight - 50}
                width={width}
                className="scrollable-y"
              />
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
