import { useLanguage } from '@/i18n';
import { Menu, MenuItem, MenuToggle } from '@/components';
import ViewIcon from './icons/viewIcon';
import ConnectIcon from './icons/ConnectIcon';
import OnOffIcon from './icons/OnOffIcon';
import { useNavigate } from 'react-router-dom';
import DeviceCard from './DeviceCard';

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
  const navigate = useNavigate();

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
    },{
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
  ];

  const renderDeviceIcon = () => (
    <svg width={46} height={46} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1484_3186)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.4939 0.801081C32.6351 0.45044 31.4243 0.187485 30.2374 0.0256738C30.1363 0.0118871 30.0857 0.00499394 30.0035 0.00141704C29.3494 -0.0270767 28.6485 0.377027 28.3533 0.953117C28.3163 1.02547 28.2897 1.09203 28.2367 1.22514C28.1776 1.37292 28.1482 1.44682 28.1156 1.51202C27.8422 2.05823 27.2986 2.42338 26.6828 2.47428C26.6094 2.48035 26.5287 2.48035 26.3677 2.48035H20.6115C20.4505 2.48035 20.3698 2.48035 20.2963 2.47428C19.6806 2.42338 19.1369 2.05823 18.8635 1.51202C18.8309 1.44682 18.8015 1.37292 18.7425 1.22514C18.6895 1.09203 18.6629 1.02547 18.6259 0.953117C18.3306 0.377027 17.6298 -0.0270767 16.9757 0.00141704C16.8934 0.00499394 16.8429 0.0118871 16.7417 0.0256738C15.5549 0.187485 14.3441 0.45044 13.4852 0.801081C10.4636 2.0347 8.06288 4.40087 6.81119 7.37901C6.30523 8.58318 6.08396 9.87972 5.9772 11.4209C5.87254 12.9331 5.87256 14.8025 5.87256 17.1756V27.7217C5.87256 30.0946 5.87254 31.9642 5.9772 33.4762C6.08396 35.0176 6.30523 36.3139 6.81119 37.5181C8.06288 40.4963 10.4636 42.8624 13.4852 44.0961C14.707 44.5948 16.0223 44.8129 17.5861 44.9181C19.1204 45.0213 21.017 45.0213 23.4246 45.0213H23.5546C25.9621 45.0213 27.8588 45.0213 29.393 44.9181C30.9569 44.8129 32.2722 44.5948 33.4939 44.0961C36.5156 42.8624 38.9163 40.4963 40.168 37.5181C40.6739 36.3139 40.8952 35.0176 41.002 33.4762C41.1066 31.9642 41.1066 30.0946 41.1066 27.7217V17.1756C41.1066 14.8025 41.1066 12.9331 41.002 11.4209C40.8952 9.87972 40.6739 8.58318 40.168 7.37901C38.9163 4.40087 36.5156 2.0347 33.4939 0.801081ZM16.4428 36.3395C16.4428 35.3805 17.2315 34.6031 18.2045 34.6031H28.7747C29.7477 34.6031 30.5364 35.3805 30.5364 36.3395C30.5364 37.2985 29.7477 38.0758 28.7747 38.0758H18.2045C17.2315 38.0758 16.4428 37.2985 16.4428 36.3395Z"
          fill="#5151F9"
        />
      </g>
      <defs>
        <clipPath id="clip0_1484_3186">
          <rect width={46} height={46} rx={5} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const renderItem = (item: IProjectsItem, index: number) => {
    return (
      <div key={index} className="card hover:shadow-lg mb-2 p-2 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Device Info */}
          <div className="flex items-center gap-4">
            {renderDeviceIcon()}
            <div>
              <h4 className="font-bold text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">85552484675755</p>
              <p className="text-sm">#54654453</p>
            </div>
          </div>

          {/* Device Card */}
          <div className="md:col-span-1">
            <DeviceCard
              deviceName="Jimi IoT (Concox) GT06N"
              lastActive="16 minutes ago"
              icon1Count={2}
              icon2Count={5}
              icon3Count={8}
              icon4Count={4}
            />
          </div>

          {/* Messages Progress */}
          <div className="md:col-span-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-6
              ">
                <div className="font-bold">Messages</div>
                <span className="text-sm text-gray-500">56.5 MB / 100 MB</span>
              </div>
              <div className={`progress ${item.progress.variant}`}>
                <div className="progress-bar" style={{ width: `${item.progress.value}%` }}></div>
              </div>
              <p className="text-sm">messages deleted in 2 months</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-2">
            <button
              className="w-12 h-12 rounded-lg hover:bg-gray-100"
              onClick={() => navigate('/devices/device/view-device')}
            >
              <ViewIcon />
            </button>
            <button className="w-12 h-12 rounded-lg hover:bg-gray-100">
              <ConnectIcon />
            </button>
            <button className="w-12 h-12 rounded-lg hover:bg-gray-100">
              <OnOffIcon />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Device List</h3>
        <Menu>
          <MenuItem
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [{ name: 'offset', options: { offset: [0, -10] } }]
            }}
          >
            Actions
          </MenuItem>
        </Menu>
      </div>
      <div className="space-y-4">
        {items.map(renderItem)}
      </div>
    </div>
  );
};

export { Projects, type IProjectsItem, type IProjectsItems };