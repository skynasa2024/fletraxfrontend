import { toAbsoluteUrl } from '@/utils';
import { useMap } from 'react-leaflet';
import { useControl } from './MapControls/provider';
import { useLayer } from '@/components/AppMap/contexts/LayerProvider';

export const OtherControls = () => {
  const map = useMap();
  const { size } = useControl();
  const { layer, setLayer } = useLayer();

  return (
    <div className="group bg-white rounded-lg shadow-lg cursor-pointer" data-size={size}>
      <div
        className="group-data-[size=large]:size-[46px] group-data-[size=small]:size-[28px] flex justify-center items-center"
        onClick={() => {
          // Open the same view on google maps
          window.open(
            `https://www.google.com/maps/@${map.getCenter().lat},${map.getCenter().lng},${map.getZoom()}z`
          );
        }}
      >
        <img
          src={toAbsoluteUrl('/media/icons/marker-on-map.svg')}
          className="group-data-[size=small]:size-[20px]"
        />
      </div>
      <div
        className="group-data-[size=large]:size-[46px] group-data-[size=small]:size-[28px] flex justify-center items-center"
        onClick={() => {
          // Change Layer
          if (layer === 'normal') {
            setLayer('satellite');
          } else {
            setLayer('normal');
          }
        }}
      >
        <img
          src={toAbsoluteUrl('/media/icons/satellite.svg')}
          className="group-data-[size=small]:size-[20px]"
        />
      </div>
      <div
        className="group-data-[size=large]:size-[46px] group-data-[size=small]:size-[28px] flex justify-center items-center"
        onClick={() => {
          // Fly to current location
          map.stopLocate();
          map.locate({
            watch: true,
            enableHighAccuracy: true
          });
          map.once('locationfound', (e) => {
            map.flyTo(e.latlng, map.getZoom());
          });
        }}
      >
        <img
          src={toAbsoluteUrl('/media/icons/marker-pulse.svg')}
          className="group-data-[size=small]:size-[20px]"
        />
      </div>
    </div>
  );
};
