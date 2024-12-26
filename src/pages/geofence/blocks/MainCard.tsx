import { useGeofenceContext } from '../providers/GeofenceContext';
import 'react-resizable/css/styles.css';
import { toAbsoluteUrl } from '@/utils';
import { deleteGeofence } from '@/api/geofence';

export const MainCard = () => {
  const { searchQuery, setSearchQuery, search, geofences, selectedGeofence, setSelectedGeofence } =
    useGeofenceContext();

  return (
    <div className="card-body md:w-[411px] flex flex-col gap-2 px-3 py-3 h-full">
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <div className="input input-sm h-[34px]">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-info btn-icon size-[34px]" type="submit">
          <img src={toAbsoluteUrl('/media/icons/search.svg')} />
        </button>
      </form>
      <div className="scrollable-y-auto pb-2 flex flex-col gap-[10px]">
        {geofences.map((geofence) => (
          <div
            key={geofence.id}
            data-selected={geofence.id === selectedGeofence?.id}
            onClick={() => setSelectedGeofence(geofence)}
            className="flex gap-2 justify-between items-center p-[14px] rounded-[10px] border border-[#E7E8ED] dark:border-gray-300 dark:data-[selected=true]:border-[#5151F9] data-[selected=true]:border-[#5151F9] data-[selected=true]:bg-[#5151F90A]"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold">{geofence.name}</div>
              <div className="text-xs text-gray-400">{geofence.type}</div>
            </div>
            <div className="flex gap-2">
              <a href="#" className="btn btn-icon btn-clean btn-lg !size-[18px]">
                <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} className="size-3" />
              </a>
              <a
                href="#"
                className="btn btn-icon btn-clean btn-lg !size-[18px]"
                onClick={async (e) => {
                  e.preventDefault();

                  await deleteGeofence(geofence.id);
                  await search();

                  if (selectedGeofence?.id === geofence.id) {
                    setSelectedGeofence(null);
                  }
                }}
              >
                <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} className="size-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
