import { Paginated } from '@/api/common';
import { useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { CustomerDetails, getCustomers } from '@/api/customer';

const DriverList = () => {
  const [customers, setCustomers] = useState<Paginated<CustomerDetails>>();

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  return (
    <div className="card">
      <div className="px-7 pt-6 flex items-center justify-between">
        <div className="card-title">
          <h3>Driver</h3>
          <h4 className="text-sm font-thin text-[#B5B5C3]">
            You have {customers?.totalCount}{' '}
            {(customers?.totalCount ?? 0 > 1) ? 'customers' : 'customer'}
          </h4>
        </div>
        <button className="btn btn-info px-4">
          <img src={toAbsoluteUrl('/media/icons/add-user.svg')} />
          Add Customer
        </button>
      </div>

      <div className="card-body scrollable-x pt-2 px-6 pb-7">
        <div className="flex gap-4">
          {customers?.data.map((customer) => (
            <div className="flex flex-col flex-shrink-0 rounded-2xl border border-[#E7E8ED] overflow-hidden">
              <div
                className="h-1 w-full"
                style={{ backgroundColor: customer.state === 'Active' ? '#50CD89' : '#5E6278' }}
              />
              <div className="flex flex-col gap-3 px-8 py-6">
                <div className="flex justify-between">
                  <img src={customer.customer.avatar} className="size-12 rounded-[4px]" />
                </div>
                <div className="text-[#3F4254] font-bold text-[22px]">{customer.customer.name}</div>
                <div className="text-[#B5B5C3] font-medium">{customer.nationality}</div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-medium text-sm text-[#B5B5C3]">
                  <div className="flex gap-1">
                    <img src={toAbsoluteUrl('/media/icons/email.svg')} />
                    <span>{customer.customer.email}</span>
                  </div>
                  <div className="flex gap-1">
                    <img src={toAbsoluteUrl('/media/icons/phone.svg')} />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex gap-1">
                    <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                    <span>{customer.country}</span>
                  </div>
                  <div className="flex gap-1">
                    <img src={toAbsoluteUrl('/media/icons/city.svg')} />
                    <span>{customer.city}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs border-t flex justify-center">
                <a href="#" className="px-5 py-2 flex gap-2">
                  <img src={toAbsoluteUrl('/media/icons/view-light.svg')} />
                  <span>View</span>
                </a>
                <a href="#" className="px-5 py-2 border-x flex gap-2">
                  <img src={toAbsoluteUrl('/media/icons/edit-light.svg')} />
                  <span>Edit</span>
                </a>
                <a href="#" className="px-5 py-2 flex gap-2">
                  <img src={toAbsoluteUrl('/media/icons/delete-light.svg')} />
                  <span>Delete</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { DriverList };
