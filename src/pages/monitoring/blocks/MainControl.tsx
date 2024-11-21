import { ReactElement } from 'react';
import { useMap } from 'react-leaflet';

export const MainControl = ({ children }: { children: ReactElement[] | ReactElement }) => {
  const map = useMap();

  return (
    <div
      className="leaflet-top leaflet-left"
      onMouseOver={() => map.doubleClickZoom.disable()}
      onMouseOut={() => map.doubleClickZoom.enable()}
    >
      <div className="leaflet-control flex flex-col gap-[10px] !mt-16 !ml-7 !mb-24 font-sans">
        {children}
      </div>
    </div>
  );
};
