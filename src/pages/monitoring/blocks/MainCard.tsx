import { KeenIcon } from '@/components';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { ButtonRadioGroup } from '@/pages/dashboards/dashboard/blocks/ButtonRadioGroup';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { AutoSizer, List } from 'react-virtualized';

export const MainCard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { searchQuery, setSearchQuery, clients, setSelectedClient, selectedClient, locations } =
    useMonitoringProvider();
  const [selection, setSelection] = useState('All');
  const [resizableHeight, setResizableHeight] = useState(200);

  return (
    <div className="card w-[380px] data-[open=true]:h-full group" data-open={isOpen}>
      <div
        className="card-header border-dashed border-0 group-data-[open=true]:border-b-2"
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="card-title uppercase font-bold text-[22px]">
          <h3>Monitoring</h3>
        </div>
        {isOpen ? <KeenIcon icon="up" /> : <KeenIcon icon="down" />}
      </div>

      <Collapse in={isOpen} className="flex-grow" classes={{ wrapper: 'h-full' }}>
        <div className="card-body flex flex-col gap-4 px-3 py-3 h-full">
          <div className="input input-sm h-[34px] shrink-0">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                        className="flex flex-col items-center gap-1 py-1 bg-[#F5F5FC] w-full absolute bottom-0 cursor-ns-resize"
                        ref={ref}
                      >
                        <div className="h-[1px] bg-[#5E6278] w-12" />
                        <div className="h-[1px] bg-[#5E6278] w-8" />
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
                                className="flex p-[10px] gap-4 justify-between text-[#3F4254] font-roboto data-[selected=true]:border border-[#5151F9] rounded-md cursor-pointer"
                                onClick={() => setSelectedClient(client)}
                              >
                                <div className="flex gap-2 items-center font-medium">
                                  <img
                                    src={client.avatar}
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
                        className="scrollable pb-4"
                      />
                    </div>
                  </Resizable>
                  <div className="flex justify-center bg-[#F5F8FA] rounded-lg py-2">
                    <ButtonRadioGroup
                      selection={selection}
                      selections={['All', 'Online', 'Offline']}
                      suffix={{
                        All: selectedClient
                          ? ` (${selectedClient?.onlineDevices + selectedClient?.offlineDevices})`
                          : '',
                        Online: selectedClient ? ` (${selectedClient?.onlineDevices})` : '',
                        Offline: selectedClient ? ` (${selectedClient?.offlineDevices})` : ''
                      }}
                      setSelection={setSelection}
                      className="btn btn-light data-[selected=false]:btn-clear uppercase border-0"
                    />
                  </div>
                  <List
                    rowRenderer={({ index, key, style }) => {
                      const location = locations.filter((loc) => {
                        if (selection === 'All') return true;

                        if (selection === 'Online') return loc.online;
                        if (selection === 'Offline') return !loc.online;
                      })[index];
                      return (
                        <div key={key} style={style} className="pb-2">
                          <div className="flex flex-col p-[15px] border border-[#E7E8ED] rounded-[10px] gap-[10px]">
                            <CarPlate plate={location.vehicle.plate} />
                            <div className="border-b-2 border-[#E4E6EF] border-dashed" />
                            <div className="flex justify-between font-semibold text-xs">
                              <div>
                                <div>{location.vehicle.name}</div>
                                <div>{location.vehicle.imei}</div>
                              </div>
                            </div>
                            <div className="border-b-2 border-[#E4E6EF] border-dashed" />
                            <div className="flex gap-[10px] text-[10px] font-semibold justify-evenly">
                              <div>{location.status.engineStatus ? 'ON' : 'OFF'}</div>
                              <div>{`${location.status.speed}kmh`}</div>
                              <div>{location.status.satellietes}</div>
                              <div>{`${location.status.signalLevel}%`}</div>
                              <div>{location.status.engineBlocked ? 'Active' : 'Inactive'}</div>
                              <div>{location.status.defenseStatus ? 'Active' : 'Inactive'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    rowCount={locations.length}
                    rowHeight={167}
                    height={height - resizableHeight - 50}
                    width={width}
                    className="scrollable"
                  />
                </div>
              )}
            </AutoSizer>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
