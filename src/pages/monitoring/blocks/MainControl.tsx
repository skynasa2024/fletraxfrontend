import { KeenIcon } from '@/components';
import { Collapse } from '@mui/material';
import { PropsWithChildren, ReactElement, useState } from 'react';
import { useMap } from 'react-leaflet';

export interface MainControlProps extends PropsWithChildren {
  title: string;
  bar?: ReactElement;
}

export const MainControl = ({ children, title, bar }: MainControlProps) => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="leaflet-top leaflet-left max-h-screen flex items-stretch group data-[open=true]:h-screen"
      data-open={isOpen}
    >
      <div className="leaflet-control flex flex-col gap-[10px] !mx-4 md:!mt-16 md:!ml-7 md:!mb-6 font-sans">
        <div
          className="card group-data-[open=true]:h-full"
          onMouseOver={() => {
            map.doubleClickZoom.disable();
            map.dragging.disable();
            map.scrollWheelZoom.disable();
          }}
          onMouseOut={() => {
            map.doubleClickZoom.enable();
            map.dragging.enable();
            map.scrollWheelZoom.enable();
          }}
        >
          <div
            className="card-header border-dashed border-0 group-data-[open=true]:border-b-2"
            onClick={() => setIsOpen((open) => !open)}
          >
            <div className="card-title font-bold text-[22px]">
              <h3>{title}</h3>
            </div>
            <div className="flex items-center gap-2">
              {bar}
              {isOpen ? <KeenIcon icon="up" /> : <KeenIcon icon="down" />}
            </div>
          </div>

          <Collapse in={isOpen} className="flex-grow" classes={{ wrapper: 'h-full' }}>
            {children}
          </Collapse>
        </div>
      </div>
    </div>
  );
};
