import { DriverDetails, updateDriverStatus } from '@/api/drivers';
import { StatusDropdown, StatusDropdownProps } from '../StatusDropdown';
import { toAbsoluteUrl } from '@/utils';

interface DriverCardProps {
  driver?: DriverDetails;
  onDelete: () => void;
}

export const DriverCard = ({ driver, onDelete }: DriverCardProps) => {
  const options: StatusDropdownProps['options'] = {
    'Under Review': {
      color: '#FFA800',
      backgroundColor: '#FFF8EA'
    },
    Active: {
      color: '#50CD89',
      backgroundColor: '#EEFAF4'
    }
  };

  if (!driver) {
    return (
      <div className="flex hover:shadow-md h-full w-[402px] flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] dark:border-gray-200 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: '#212121' }} />
      </div>
    );
  }

  return (
    <div className="flex hover:shadow-md flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] dark:border-gray-200 overflow-hidden">
      <div
        className="h-1 w-full"
        style={{ backgroundColor: options[driver.status]?.color || '#212121' }}
      />
      <div className="flex flex-col gap-3 px-8 py-6">
        <div className="flex justify-between items-center">
          <img
            src={driver.driver.avatar || toAbsoluteUrl('/media/avatars/avatar-placeholder.png')}
            className="size-12 rounded-[4px]"
          />
          <StatusDropdown
            selected={driver.status}
            setSelected={async (status) => {
              await updateDriverStatus(driver.id, status === 'Active');
              onDelete();
            }}
            options={options}
          />
        </div>
        <div className="text-[#3F4254] dark:text-gray-50 font-bold text-[22px]">
          {driver.driver.name}
        </div>
        <div className="text-[#B5B5C3] font-medium">{driver.nationality}</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-medium text-sm text-[#B5B5C3] text-nowrap">
          <div className="flex gap-1 w-36">
            <img src={toAbsoluteUrl('/media/icons/email.svg')} />
            <span className="overflow-hidden text-ellipsis">{driver.driver.email}</span>
          </div>
          <div className="flex gap-1 w-36">
            <img src={toAbsoluteUrl('/media/icons/phone.svg')} />
            <span className="overflow-hidden text-ellipsis">{driver.phone}</span>
          </div>
          <div className="flex gap-1 w-36">
            <img src={toAbsoluteUrl('/media/icons/city.svg')} />
            <span className="overflow-hidden text-ellipsis">{driver.country}</span>
          </div>
          <div className="flex gap-1 w-36">
            <img src={toAbsoluteUrl('/media/icons/city.svg')} />
            <span className="overflow-hidden text-ellipsis">{driver.city}</span>
          </div>
        </div>
      </div>
      <div className="text-xs border-t flex justify-center">
        <a href={`/drivers/driver/${driver.id}`} className="px-5 py-2 flex gap-2">
          <img src={toAbsoluteUrl('/media/icons/view-light.svg')} />
          <span>View</span>
        </a>
        <a href={`/drivers/edit/${driver.id}`} className="px-5 py-2 border-x flex gap-2">
          <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
          <span>Edit</span>
        </a>
        <a
          href="#"
          className="px-5 py-2 flex gap-2"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
          <span>Delete</span>
        </a>
      </div>
    </div>
  );
};
