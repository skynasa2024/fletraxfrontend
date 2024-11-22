import { KeenIcon } from '@/components';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import { useMonitoringProvider } from '../providers/MonitoringProvider';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { ButtonRadioGroup } from '@/pages/dashboards/dashboard/blocks/ButtonRadioGroup';
import { CarPlate } from '@/pages/dashboards/dashboard/blocks/CarPlate';
import { AutoSizer, List } from 'react-virtualized';

export const MainCard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { searchQuery, setSearchQuery, clients, setSelectedClient, selectedClient, locations } =
    useMonitoringProvider();
  const [selection, setSelection] = useState('All');

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

      <Collapse in={isOpen} classes={{ wrapperInner: 'h-full' }}>
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
          <ResizableBox
            height={200}
            minConstraints={[0, 200]}
            maxConstraints={[0, 600]}
            axis="y"
            className="w-full"
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
            <div className="h-full scrollable">
              {clients.map((client) => (
                <div
                  key={client.name}
                  data-selected={selectedClient?.name === client.name}
                  className="flex p-[10px] gap-4 justify-between text-[#3F4254] font-roboto data-[selected=true]:border border-[#5151F9] rounded-md cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex gap-2 items-center font-medium">
                    <img src={client.avatar} className="size-8 rounded-md object-contain" />
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
              ))}
            </div>
          </ResizableBox>
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
          {/* <div className="scrollable">
            {locations.map((location) => (
              <div key={location.vehicle.imei}>
                <CarPlate plate={location.vehicle.plate} />
              </div>
            ))}
          </div> */}
          <AutoSizer>
            {({ width, height }) => (
              <List
                rowRenderer={({ index, key, style }) => {
                  const location = locations[index];
                  return (
                    <div key={key} style={style} className="flex">
                      <CarPlate plate={location.vehicle.plate} /> {index}
                    </div>
                  );
                }}
                rowCount={locations.length}
                rowHeight={36}
                height={height}
                width={width}
                className="scrollable"
              />
            )}
          </AutoSizer>
        </div>
      </Collapse>
    </div>
  );
};
