import { PropsWithChildren } from 'react';
import { useMap } from 'react-leaflet';

export const MapControls = ({ children }: PropsWithChildren) => {
  const map = useMap();

  return (
    <div
      className="leaflet-top leaflet-right"
      onMouseOver={() => map.doubleClickZoom.disable()}
      onMouseOut={() => map.doubleClickZoom.enable()}
    >
      <div className="leaflet-control flex flex-col gap-[10px] !mt-20 !mr-4 md:!mt-[67px] md:!mr-11">
        {children}
      </div>
    </div>
  );
};
