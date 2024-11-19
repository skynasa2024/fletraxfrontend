import { useLanguage } from '@/i18n';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';

import { DropdownCrud1, DropdownCrudItem1 } from '@/partials/dropdowns/general';

interface IProjectsItem {
  name: string;
  id: string;
  owner: {
    name: string;
    email: string;
  };
  date: string;
  status: {
    label: string;
    color: string;
  };
  team: {
    group: Array<{ filename?: string; fallback?: string; variant?: string }>;
    more?: {
      number: number;
      variant: string;
    };
  };
}
interface IProjectsItems extends Array<IProjectsItem> {}

const Projects = () => {
  const { isRTL } = useLanguage();

  const items: IProjectsItems = [
    {
      id: '7586566',
      name: 'Acme software development',
      owner: {
        name: 'Karina Clark',
        email: 'Karina@khljkl.com'
      },
      date: '26.9.2024',
      status: {
        label: 'Active',
        color: 'badge-success'
      },
      team: {
        group: [{ filename: '300-4.png' }, { filename: '300-1.png' }, { filename: '300-2.png' }],
        more: {
          number: 3,
          variant: 'text-success-inverse ring-success-light bg-success'
        }
      }
    },
    {
      id: '7586567',
      name: 'Strategic Partnership Deal',
      owner: {
        name: 'Paul Wilson',
        email: 'paul@example.com'
      },
      date: '24.9.2024',
      status: {
        label: 'Suspended',
        color: 'badge-warning'
      },
      team: {
        group: [
          { filename: '300-1.png' },
          { filename: '300-2.png' },
          {
            fallback: 'M',
            variant: 'text-danger-inverse ring-danger-light bg-danger'
          }
        ]
      }
    },
    {
      id: '7586568',
      name: 'Client Onboarding',
      owner: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com'
      },
      date: '22.9.2024',
      status: {
        label: 'Pending',
        color: 'badge-primary'
      },
      team: {
        group: [{ filename: '300-20.png' }, { filename: '300-7.png' }]
      }
    },
    {
      id: '7586569',
      name: 'Widget Supply Agreement',
      owner: {
        name: 'Robert Brown',
        email: 'robert@example.com'
      },
      date: '20.9.2024',
      status: {
        label: 'Deactivated',
        color: 'badge-danger'
      },
      team: {
        group: [{ filename: '300-6.png' }, { filename: '300-23.png' }, { filename: '300-12.png' }],
        more: {
          number: 1,
          variant: 'text-primary-inverse ring-primary-light bg-primary'
        }
      }
    }
  ];

  const renderItem = (item: IProjectsItem, index: number) => {
    return (
      <tr key={index}>
        <td className="text-start flex items-center w-full p-3">
          <div className="text-start font-bold">{item.id}</div>
        </td>
        <td>
          <div className="Owner">
            <div className="text-start font-bold p-3">{item.owner.name}</div>
            <div className="text-start p-3">{item.owner.email}</div>
          </div>
        </td>
        <td>
          <div className="flex justify-between items-center">
            <div className="text-start font-bold">{item.date}</div>
          </div>
        </td>
        <td className="text-start">
          {' '}
          <div className="flex justify-start">
            {' '}
            <div
              className={`badge badge-xl badge-outline border-none font-bold ${item.status.color}`}
            >
              {item.status.label}
              <i className={`ki-outline ki-down ml-2 text-${item.status.color}`} />
            </div>
          </div>
        </td>
        <td>
          <div className="flex justify-between items-center py-2">
            <div className="text-center font-bold">Role</div>
          </div>
        </td>
        <td>
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
        </td>
      </tr>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">User List</h3>
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
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <KeenIcon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCrud1()}
          </MenuItem>
        </Menu>
      </div>

      <div className="card-table scrollable-x-auto">
        <table className="table-auto border-separate w-full p-5">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 w-1/6">ID</th>
              <th className="text-left py-2 px-4 w-2/6">Owner</th>
              <th className="text-left py-2 px-4 w-1/6">Date</th>
              <th className="text-left py-2 px-4 w-1/6">Status</th>
              <th className="text-left py-2 px-0 w-1/6">Role</th>
              <th className="text-left py-2 px-1 w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              return renderItem(item, index);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Projects, type IProjectsItem, type IProjectsItems };
