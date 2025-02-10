import { PropsWithChildren } from 'react';
import { useMap } from 'react-leaflet';
import { SizeContext } from './provider';

interface MapControlsProps extends PropsWithChildren {
  size?: 'small' | 'large' | 'hidden';
}

export const MapControls = ({ children, size = 'large' }: MapControlsProps) => {
  const map = useMap();

  if (size === 'hidden') {
    return <></>;
  }

  return (
    <div
      className="leaflet-top leaflet-right"
      onMouseOver={() => map.doubleClickZoom.disable()}
      onMouseOut={() => map.doubleClickZoom.enable()}
    >
      <div
        data-size={size}
        className="leaflet-control flex flex-col gap-[10px] data-[size=large]:!mt-20 data-[size=large]:!mr-5 data-[size=large]:md:!mt-[90px] data-[size=large]:md:!mr-5"
      >
        <SizeContext.Provider value={{ size }}>{children}</SizeContext.Provider>
      </div>
    </div>
  );
};
