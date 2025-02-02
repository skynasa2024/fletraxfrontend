import InfoIcon from './svg/info.svg?react';
import AIIcon from './svg/ai.svg?react';
import EditIcon from './svg/edit.svg?react';
import TelemetryIcon from './svg/telemetry.svg?react';
import CommandsIcon from './svg/commands.svg?react';
import LogsIcon from './svg/logs.svg?react';
import GroupsIcon from './svg/groups.svg?react';
import CalcsIcon from './svg/calcs.svg?react';
import GeofenceIcon from './svg/geofence.svg?react';
import StreamsIcon from './svg/streams.svg?react';
import PluginsIcon from './svg/plugins.svg?react';
import { usePathname } from '@/providers';
import { useMemo } from 'react';

const DeviceNavigation = () => {
  const navItems = useMemo(
    () => [
      {
        icon: <InfoIcon />,
        label: 'Info',
        path: 'info',
        disabled: true
      },
      {
        icon: <AIIcon />,
        label: 'AI',
        path: 'ai',
        disabled: true
      },
      {
        icon: <EditIcon />,
        label: 'Edit',
        path: 'edit',
        disabled: true
      },
      {
        icon: <TelemetryIcon />,
        label: 'Telemetry',
        path: 'telemetry',
        default: true
      },
      {
        icon: <CommandsIcon />,
        label: 'Commands & Settings',
        path: 'commands',
        disabled: true
      },
      {
        icon: <LogsIcon />,
        label: 'Logs & Messages',
        path: 'logs',
        disabled: true
      },
      {
        icon: <GroupsIcon />,
        label: 'Groups',
        path: 'groups',
        disabled: true
      },
      {
        icon: <CalcsIcon />,
        label: 'Calcs',
        path: 'calcs',
        disabled: true
      },
      {
        icon: <GeofenceIcon />,
        label: 'Geofences',
        path: 'geofences',
        disabled: true
      },
      {
        icon: <StreamsIcon />,
        label: 'Streams',
        path: 'streams',
        disabled: true
      },
      {
        icon: <PluginsIcon />,
        label: 'Plugins',
        path: 'plugins',
        disabled: true
      }
    ],
    []
  );
  const { pathname } = usePathname();
  const getNavPath = (path: string) => {
    const pathParts = pathname.split('/');
    if (pathParts.length > 4) {
      pathParts.pop();
    }
    return pathParts.join('/') + '/' + path;
  };

  const activePath = useMemo(() => {
    const pathParts = pathname.split('/');
    if (pathParts.length <= 4) {
      return navItems.find((item) => item.default)?.path;
    }
    return pathParts[pathParts.length - 1];
  }, [navItems, pathname]);

  return (
    <div className="w-full bg-[rgba(245,248,250,1)] px-20 py-2">
      <div className="flex items-center justify-between overflow-x-auto">
        {navItems.map((item, index) => (
          <a
            key={index}
            data-active={item.path === activePath}
            data-disabled={item.disabled}
            className="flex flex-col items-center min-w-fit cursor-pointer hover:text-blue-600 data-[active=true]:text-blue-600 text-gray-500 transition-colors data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-gray-400"
            href={item.disabled ? '#' : getNavPath(item.path)}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault();
              }
            }}
          >
            <div className="w-12 h-12 flex items-center justify-center">{item.icon}</div>
            <span className="text-xs font-medium mt-1 uppercase">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DeviceNavigation;
