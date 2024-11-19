import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';

import { CommonAvatars } from '@/partials/common';
import { DropdownCrud1, DropdownCrudItem1 } from '@/partials/dropdowns/general';

interface IProjectsItem {
  name: string;
  team: {
    group: Array<{ filename?: string; fallback?: string; variant?: string }>;
    more?: {
      number: number;
      variant: string;
    };
  };
  dueDate: string;
  progress: {
    variant: string;
    value: number;
  };
}
interface IProjectsItems extends Array<IProjectsItem> {}

const Projects = () => {
  const { isRTL } = useLanguage();

  const items: IProjectsItems = [
    {
      name: 'Acme software development',
      team: {
        group: [{ filename: '300-4.png' }, { filename: '300-1.png' }, { filename: '300-2.png' }],
        more: {
          number: 3,
          variant: 'text-success-inverse ring-success-light bg-success'
        }
      },
      dueDate: '24 Aug, 2024',
      progress: {
        variant: 'progress-primary',
        value: 60
      }
    },
    {
      name: 'Strategic Partnership Deal',
      team: {
        group: [
          { filename: '300-1.png' },
          { filename: '300-2.png' },
          {
            fallback: 'M',
            variant: 'text-danger-inverse ring-danger-light bg-danger'
          }
        ]
      },
      dueDate: '10 Sep, 2024',
      progress: {
        variant: '',
        value: 100
      }
    },
    {
      name: 'Client Onboarding',
      team: {
        group: [{ filename: '300-20.png' }, { filename: '300-7.png' }]
      },
      dueDate: '19 Sep, 2024',
      progress: {
        variant: 'progress-primary',
        value: 20
      }
    },
    {
      name: 'Widget Supply Agreement',
      team: {
        group: [{ filename: '300-6.png' }, { filename: '300-23.png' }, { filename: '300-12.png' }],
        more: {
          number: 1,
          variant: 'text-primary-inverse ring-primary-light bg-primary'
        }
      },
      dueDate: '5 May, 2024',
      progress: {
        variant: 'progress-success',
        value: 100
      }
    },
    {
      name: 'Project X Redesign',
      team: {
        group: [{ filename: '300-2.png' }, { filename: '300-15.png' }, { filename: '300-18.png' }],
        more: {
          number: 2,
          variant: 'text-success-inverse ring-success-light bg-success'
        }
      },
      dueDate: '1 Feb, 2025',
      progress: {
        variant: 'progress-primary',
        value: 80
      }
    }
  ];

  const renderItem = (item: IProjectsItem, index: number) => {
    return (
      <tr key={index}>
        <td className="text-start flex items-center w-full ">
          <div className="text-start font-bold">7586566</div>
        </td>
        <td>
          <div className="Owner">
            <div className="text-start">Karina Clark</div>
            <div className="text-grey text-start">Karina@khljkl.com</div>
          </div>
        </td>

        <td>
          <div className="flex justify-between items-center py-2">
            <div className="text-start font-bold">26.9.2024</div>
          </div>
        </td>
        <td>
          <div className="dropdown" data-dropdown="true" data-dropdown-trigger="click">
            <button className="dropdown-toggle btn btn-light">
              Show Dropdown
              <i className="ki-outline ki-down !text-sm dropdown-open:hidden"></i>
              <i className="ki-outline ki-up !text-sm hidden dropdown-open:block"></i>
            </button>
            <div className="dropdown-content w-full max-w-56">
              <div className="p-4 text-sm text-gray-900 font-medium">Dropdown Heading</div>
              <div className="border-b border-b-gray-200"></div>
              <option value="suspended" className="text-yellow-400 bg-yellow-100">
                Suspended
              </option>
              <option value="deactivate" className="text-red-500 bg-red-100">
                Deactivate
              </option>
              <option value="active" className="text-green-500 bg-green-100">
                Active
              </option>
              <option value="pending" className="text-blue-500 bg-blue-100">
                Pending Activation
              </option>
            </div>
          </div>
        </td>
        <td>
          <div className="flex justify-between items-center py-2">
            <div className="text-start font-bold">Messages</div>
          </div>
        </td>

        <td>
          <MenuToggle className="flex justify-end gap-2">
            <div className="flex justify-center items-center w-12 h-12 rounded-lg">
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="45"
                  height="45"
                  rx="5.5"
                  fill="#5E6278"
                  fill-opacity="0.1"
                />
                <rect x="0.5" y="0.5" width="45" height="45" rx="5.5" stroke="#5E6278" />
                <path
                  d="M23.0449 15.2959C18.1887 15.2959 13.7849 17.9527 10.5353 22.2682C10.2701 22.6217 10.2701 23.1157 10.5353 23.4692C13.7849 27.7899 18.1887 30.4467 23.0449 30.4467C27.901 30.4467 32.3048 27.7899 35.5544 23.4744C35.8196 23.1209 35.8196 22.6269 35.5544 22.2734C32.3048 17.9527 27.901 15.2959 23.0449 15.2959ZM23.3932 28.2058C20.1696 28.4086 17.5076 25.7517 17.7104 22.5229C17.8767 19.8609 20.0345 17.7032 22.6965 17.5368C25.9201 17.334 28.5821 19.9909 28.3794 23.2197C28.2078 25.8765 26.0501 28.0342 23.3932 28.2058ZM23.232 25.7413C21.4955 25.8505 20.0604 24.4207 20.1748 22.6841C20.2632 21.2491 21.4279 20.0897 22.8629 19.9961C24.5995 19.8869 26.0345 21.3167 25.9201 23.0533C25.8265 24.4935 24.6618 25.6529 23.232 25.7413Z"
                  fill="#5E6278"
                />
              </svg>
            </div>
            <div className="flex justify-center items-center w-12 h-12 rounded-lg">
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="45"
                  height="45"
                  rx="5.5"
                  fill="#5151F9"
                  fill-opacity="0.1"
                />
                <rect x="0.5" y="0.5" width="45" height="45" rx="5.5" stroke="#5151F9" />
                <path
                  d="M13.0907 25.8952H13.8759C14.847 25.9311 14.8471 27.3255 13.8759 27.3613H13.0907C12.1196 27.3255 12.1194 25.9311 13.0907 25.8952Z"
                  fill="#5151F9"
                />
                <path
                  d="M33.5048 19.5098H32.7196C31.7485 19.4739 31.7483 18.0795 32.7196 18.0437H33.5048C34.4759 18.0795 34.476 19.4739 33.5048 19.5098Z"
                  fill="#5151F9"
                />
                <path
                  d="M19.3717 31.3911C19.7766 31.3911 20.1048 31.7193 20.1048 32.1241V32.9093C20.0689 33.8804 18.6745 33.8805 18.6387 32.9093V32.1241C18.6387 31.7193 18.9668 31.3911 19.3717 31.3911Z"
                  fill="#5151F9"
                />
                <path
                  d="M27.2238 14.0127C26.8189 14.0127 26.4907 13.6845 26.4907 13.2797V12.4945C26.5265 11.5234 27.9209 11.5232 27.9568 12.4945V13.2797C27.9568 13.6845 27.6287 14.0127 27.2238 14.0127Z"
                  fill="#5151F9"
                />
                <path
                  d="M14.9659 29.9972C15.6771 29.3348 16.6645 30.3194 16.0042 31.0324L15.4506 31.5876C14.7395 32.25 13.752 31.2656 14.4124 30.5524L14.9659 29.9972Z"
                  fill="#5151F9"
                />
                <path
                  d="M31.6293 15.4079C30.9182 16.0703 29.9307 15.0859 30.5911 14.3727L31.1446 13.8175C31.8558 13.1551 32.8432 14.1396 32.1829 14.8527L31.6293 15.4079Z"
                  fill="#5151F9"
                />
                <path
                  d="M13.4156 15.0405C13.2407 15.2152 13.0779 15.3987 12.9271 15.5898L11.0018 13.6645C10.7155 13.3782 10.7155 12.9141 11.0018 12.6278L13.2232 10.4064C13.5095 10.1201 13.9736 10.1201 14.2599 10.4064L16.1845 12.331C15.787 12.6108 13.807 14.6683 13.4156 15.0405Z"
                  fill="#5151F9"
                />
                <path
                  d="M18.7461 24.8123L20.967 22.5915L22.1526 23.7768C22.7623 24.3867 22.7691 25.3809 22.1525 25.9978C21.5407 26.6097 20.5436 26.6108 19.9301 25.9972L18.7461 24.8123Z"
                  fill="#5151F9"
                />
                <path
                  d="M26.5933 21.5564C25.9815 22.1683 24.9844 22.1694 24.3709 21.5558L23.187 20.3711L25.4079 18.1503L26.5934 19.3354C27.2032 19.9454 27.21 20.9395 26.5933 21.5564Z"
                  fill="#5151F9"
                />
                <path
                  d="M17.1538 24.3312C16.8676 24.6173 16.4038 24.6175 16.1175 24.3316L14.4528 22.6659C12.6285 20.8438 12.6308 17.8964 14.4527 16.0767L16.6709 13.8557C18.4891 12.0398 21.4459 12.0417 23.2631 13.8568C23.2631 13.8568 24.9263 15.5211 24.9265 15.5213C25.2129 15.8073 25.2134 16.272 24.927 16.5584L17.1538 24.3312Z"
                  fill="#5151F9"
                />
                <path
                  d="M35.5939 32.7768L33.3724 34.9982C33.0862 35.2845 32.622 35.2845 32.3358 34.9982L30.4111 33.0735C30.6024 32.9231 30.786 32.7607 30.9607 32.5862C31.342 32.1849 33.3781 30.2203 33.6686 29.8148L35.5939 31.7401C35.8801 32.0264 35.8801 32.4905 35.5939 32.7768Z"
                  fill="#5151F9"
                />
                <path
                  d="M32.1424 22.7389C33.9669 24.5612 33.9642 27.5086 32.1424 29.3282L29.9243 31.549C28.107 33.364 25.1503 33.3641 23.3321 31.548C23.3321 31.548 21.6689 29.8838 21.6687 29.8836C21.3822 29.5976 21.3818 29.1329 21.6682 28.8464L29.4414 21.0736C29.7275 20.7875 30.1913 20.7873 30.4776 21.0732L32.1424 22.7389Z"
                  fill="#5151F9"
                />
              </svg>
            </div>
            <div className="flex justify-center items-center w-12 h-12 rounded-lg ">
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="45"
                  height="45"
                  rx="5.5"
                  fill="#50CD89"
                  fill-opacity="0.1"
                />
                <rect x="0.5" y="0.5" width="45" height="45" rx="5.5" stroke="#50CD89" />
                <path
                  d="M28.5685 14.9567C28.2404 15.2849 28.0561 15.7299 28.0561 16.194C28.0561 16.658 28.2404 17.103 28.5685 17.4312C29.6698 18.5326 30.4198 19.9357 30.7237 21.4633C31.0275 22.9909 30.8716 24.5743 30.2755 26.0133C29.6795 27.4523 28.6701 28.6822 27.3751 29.5475C26.0801 30.4128 24.5575 30.8746 23 30.8746C21.4425 30.8746 19.9199 30.4128 18.6249 29.5475C17.3299 28.6822 16.3205 27.4523 15.7245 26.0133C15.1284 24.5743 14.9725 22.9909 15.2763 21.4633C15.5802 19.9357 16.3302 18.5326 17.4315 17.4312C17.7503 17.1012 17.9267 16.6591 17.9227 16.2003C17.9187 15.7414 17.7347 15.3025 17.4102 14.978C17.0857 14.6536 16.6468 14.4695 16.188 14.4655C15.7291 14.4615 15.2871 14.6379 14.957 14.9567C13.3661 16.5475 12.2826 18.5743 11.8436 20.7809C11.4047 22.9874 11.6299 25.2746 12.4908 27.3532C13.3517 29.4318 14.8097 31.2083 16.6803 32.4583C18.5509 33.7082 20.7502 34.3754 23 34.3754C25.2498 34.3754 27.4491 33.7082 29.3197 32.4583C31.1903 31.2083 32.6483 29.4318 33.5092 27.3532C34.3701 25.2746 34.5954 22.9874 34.1564 20.7809C33.7174 18.5743 32.6339 16.5475 31.043 14.9567C30.7148 14.6286 30.2698 14.4443 29.8058 14.4443C29.3417 14.4443 28.8967 14.6286 28.5685 14.9567Z"
                  fill="#50CD89"
                />
                <path
                  d="M23 22.825C23.4634 22.8227 23.9072 22.6376 24.2349 22.3099C24.5626 21.9822 24.7477 21.5384 24.75 21.075V13.375C24.75 12.9109 24.5656 12.4658 24.2374 12.1376C23.9092 11.8094 23.4641 11.625 23 11.625C22.5359 11.625 22.0908 11.8094 21.7626 12.1376C21.4344 12.4658 21.25 12.9109 21.25 13.375V21.075C21.2523 21.5384 21.4374 21.9822 21.7651 22.3099C22.0928 22.6376 22.5366 22.8227 23 22.825Z"
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
                    offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
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
        {' '}
        {/*table headers */}
        <table className="table-auto border-separate w-full text-end">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">ID</th>
              <th className="text-left py-2 px-4">Owner</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Role</th>

              <th className="text-end py-2 px-4">Actions</th>
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
