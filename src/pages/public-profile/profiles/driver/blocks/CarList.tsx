import { useLanguage } from '@/i18n';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';

interface ICarItem {
  owner: {
    name: string;
    email: string;
    avatar?: string;
  };
  car: {
    model: string;
    make: string;
    registration: string;
    logo: string;
  };
  date: string;
  status: {
    label: string;
    color: string;
  };
}

interface ICarItems extends Array<ICarItem> {}

const CarList = () => {
  const { isRTL } = useLanguage();

  const items: ICarItems = [
    {
      owner: {
        name: 'Karina Clark',
        email: 'karina@kpmg.com.au',
        avatar: ''
      },
      car: {
        model: 'GL96ABR',
        make: 'Reno Volvo',
        registration: 'TR',
        logo: ''
      },
      date: 'Sep 9, 2020',
      status: {
        label: 'Active',
        color: 'badge-success'
      }
    },
    {
      owner: {
        name: 'Karina Clark',
        email: 'karina@kpmg.com.au',
        avatar: ''
      },
      car: {
        model: 'GL96ABR',
        make: 'Reno Volvo',
        registration: 'TR',
        logo: '/path/to/toyota-logo.svg'
      },
      date: 'Sep 9, 2020',
      status: {
        label: 'Under Review',
        color: 'badge-warning'
      }
    },
    {
      owner: {
        name: 'Karina Clark',
        email: 'karina@kpmg.com.au',
        avatar: 'N'
      },
      car: {
        model: 'GL96ABR',
        make: 'Reno Volvo',
        registration: 'TR',
        logo: '/path/to/toyota-logo.svg'
      },
      date: 'Sep 9, 2020',
      status: {
        label: 'Active',
        color: 'badge-success'
      }
    },
    {
      owner: {
        name: 'Karina Clark',
        email: 'karina@kpmg.com.au',
        avatar: ''
      },
      car: {
        model: 'GL96ABR',
        make: 'Reno Volvo',
        registration: 'TR',
        logo: '/path/to/toyota-logo.svg'
      },
      date: 'Sep 9, 2020',
      status: {
        label: 'Active',
        color: 'badge-success'
      }
    }
  ];

  const renderItem = (item: ICarItem, index: number) => {
    return (
      <tr key={index} className="hover:bg-gray-50">
        <td className="py-4">
          <div className="flex items-center gap-3">
            {item.owner.avatar ? (
              typeof item.owner.avatar === 'string' && item.owner.avatar.length === 1 ? (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {item.owner.avatar}
                </div>
              ) : (
                <img
                  src={item.owner.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              )
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {item.owner.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900">{item.owner.name}</div>
              <div className="text-gray-500">{item.owner.email}</div>
            </div>
          </div>
        </td>
        <td className="py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-md text-blue-600 text-sm font-medium">
              {item.car.registration}
            </div>
            <img src={item.car.logo} alt="" className="w-6 h-6" />
            <div>
              <div className="font-medium">{item.car.model}</div>
              <div className="text-gray-500">{item.car.make}</div>
            </div>
          </div>
        </td>
        <td className="py-4">
          <div className="text-gray-700 font-bold">{item.date}</div>
        </td>
        <td className="py-4">
          <div
            className={`badge badge-xl badge-outline border-none font-bold ${item.status.color}`}
          >
            {item.status.label}
            <i className={`ki-outline ki-down ml-2 text-${item.status.color}`} />
          </div>
        </td>
        <td className="py-4">
          <div className="flex items-center gap-2">
            <MenuToggle className="flex justify-end gap-2">
              <div className="flex justify-center items-center w-12 h-12 rounded-lg">
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle opacity="0.1" cx="15.4556" cy="15.5" r="15" fill="#5271FF" />
                  <path
                    d="M22.8983 15.6891C22.7554 15.4935 19.3496 10.9014 14.9999 10.9014C10.6502 10.9014 7.24431 15.4935 7.10153 15.6889C6.96616 15.8744 6.96616 16.126 7.10153 16.3115C7.24431 16.507 10.6502 21.0992 14.9999 21.0992C19.3496 21.0992 22.7554 16.507 22.8983 16.3116C23.0339 16.1262 23.0339 15.8744 22.8983 15.6891ZM14.9999 20.0442C11.7959 20.0442 9.02085 16.9963 8.19938 15.9999C9.01979 15.0026 11.789 11.9563 14.9999 11.9563C18.2038 11.9563 20.9787 15.0037 21.8005 16.0006C20.9801 16.9979 18.2108 20.0442 14.9999 20.0442Z"
                    fill="#5271FF"
                  />
                  <path
                    d="M14.9998 12.835C13.2547 12.835 11.835 14.2547 11.835 15.9998C11.835 17.7449 13.2547 19.1647 14.9998 19.1647C16.7449 19.1647 18.1647 17.7449 18.1647 15.9998C18.1647 14.2547 16.7449 12.835 14.9998 12.835ZM14.9998 18.1097C13.8364 18.1097 12.8899 17.1632 12.8899 15.9998C12.8899 14.8364 13.8364 13.8899 14.9998 13.8899C16.1632 13.8899 17.1097 14.8364 17.1097 15.9998C17.1097 17.1632 16.1633 18.1097 14.9998 18.1097Z"
                    fill="#5271FF"
                  />
                </svg>
              </div>
              <div className="flex justify-center items-center w-12 h-12 rounded-lg">
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle opacity="0.1" cx="15.4556" cy="15.5" r="15" fill="#50CD89" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.2895 19.068L18.1946 14.018C18.4068 13.7456 18.4823 13.4308 18.4115 13.1102C18.3502 12.8188 18.171 12.5417 17.9022 12.3315L17.2466 11.8107C16.6759 11.3568 15.9685 11.4046 15.5629 11.9254L15.1243 12.4944C15.0677 12.5656 15.0819 12.6707 15.1526 12.728C15.1526 12.728 16.2609 13.6166 16.2845 13.6358C16.36 13.7074 16.4166 13.803 16.4307 13.9176C16.4543 14.1422 16.2986 14.3524 16.0675 14.3811C15.9591 14.3954 15.8553 14.362 15.7799 14.2999L14.6149 13.373C14.5583 13.3305 14.4735 13.3395 14.4263 13.3969L11.6579 16.9801C11.4786 17.2047 11.4173 17.4961 11.4786 17.778L11.8324 19.3116C11.8512 19.3928 11.922 19.4502 12.0069 19.4502L13.5632 19.4311C13.8462 19.4263 14.1103 19.2973 14.2895 19.068ZM16.4688 18.5903H19.0067C19.2543 18.5903 19.4556 18.7943 19.4556 19.0451C19.4556 19.2964 19.2543 19.4999 19.0067 19.4999H16.4688C16.2212 19.4999 16.0199 19.2964 16.0199 19.0451C16.0199 18.7943 16.2212 18.5903 16.4688 18.5903Z"
                    fill="#50CD89"
                  />
                </svg>
              </div>
            </MenuToggle>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Car List</h2>
          <Menu>
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="p-2 hover:bg-gray-100 rounded-lg">
                <KeenIcon icon="dots-vertical" className="w-5 h-5 text-gray-500" />
              </MenuToggle>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="card-table scrollable-x-auto">
        <table className="table-auto border-separate w-full p-5">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 w-1/5">Owner</th>
              <th className="text-left py-2 px-4 w-1/6">Car</th>
              <th className="text-left py-2 px-4 w-1/6">Date</th>
              <th className="text-left py-2 px-4 w-1/12">Status</th>
              <th className="text-end py-2 px-4 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => renderItem(item, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { CarList, type ICarItem, type ICarItems };
