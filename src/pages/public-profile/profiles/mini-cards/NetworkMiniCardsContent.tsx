import React, { Fragment } from 'react';
import { KeenIcon } from '@/components';
import { ToolbarActions } from '@/layouts/demo1/toolbar/ToolbarActions';

interface IMetricCard {
  value: string | number;
  label: string;
  color: string;
  iconColor?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

const UserIcon = ({ color = 'currentColor', className = '' }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      opacity="0.3"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.0249 8.375C6.0249 10.8603 8.03962 12.875 10.5249 12.875C13.0102 12.875 15.0249 10.8603 15.0249 8.375C15.0249 5.88972 13.0102 3.875 10.5249 3.875C8.03962 3.875 6.0249 5.88972 6.0249 8.375ZM17.2749 12.875C17.2749 14.739 18.7859 16.25 20.6499 16.25C22.5139 16.25 24.0249 14.739 24.0249 12.875C24.0249 11.011 22.5139 9.50001 20.6499 9.50001C18.7859 9.50001 17.2749 11.011 17.2749 12.875Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5062 15.125C5.19455 15.125 0.836693 17.8548 0.400635 23.2241C0.376883 23.5166 0.936204 24.125 1.21834 24.125H19.8024C20.6476 24.125 20.6607 23.4449 20.6476 23.225C20.3179 17.7048 15.8925 15.125 10.5062 15.125ZM20.2012 17.3757C21.6132 19.2558 22.4499 21.5927 22.4499 24.125H26.7879C27.3982 24.125 27.4077 23.6149 27.3982 23.45C27.1627 19.3551 24.0336 17.4176 20.2012 17.3757Z"
      fill={color}
    />
  </svg>
);

const NetworkMiniCardsContent = () => {
  const metrics: IMetricCard[] = [
    {
      value: '250',
      label: 'Total Maintainance Times',
      color: 'text-white',
      bgColor: 'bg-blue-500',
      icon: (
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.833496" y="0.833008" width="10.2083" height="10.2083" rx="1.5" fill="white" />
          <rect
            x="14.042"
            y="0.833008"
            width="10.2083"
            height="10.2083"
            rx="1.5"
            fill="#DADADA"
            fill-opacity="0.52"
          />
          <path
            opacity="0.3"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.3335 14.041C1.50507 14.041 0.833496 14.7126 0.833496 15.541V22.7493C0.833496 23.5778 1.50507 24.2493 2.3335 24.2493H9.61473C10.4432 24.2493 11.1147 23.5778 11.1147 22.7493V15.541C11.1147 14.7126 10.4432 14.041 9.61473 14.041H2.3335ZM15.5522 14.041C14.7238 14.041 14.0522 14.7126 14.0522 15.541V22.7493C14.0522 23.5778 14.7238 24.2493 15.5522 24.2493H22.8335C23.6619 24.2493 24.3335 23.5778 24.3335 22.7493V15.541C24.3335 14.7126 23.6619 14.041 22.8335 14.041H15.5522Z"
            fill="white"
          />
        </svg>
      )
    },
    {
      value: '5',
      label: 'Maintainance last month',
      color: 'text-gray-900',
      icon: <UserIcon color=" #0010f5" />
    },
    {
      value: '25',
      label: 'Under maintenance',
      color: 'text-gray-900',
      icon: <UserIcon color="#2bdedb" />
    },
    {
      value: '5',
      label: 'Unspecific Status',
      color: 'text-gray-900',
      icon: <UserIcon color="#f50000" />
    },
    {
      value: '0',
      label: 'Pending',
      color: 'text-gray-900',

      icon: <UserIcon color="#f5e400" />
    }
  ];

  const renderMetricCard = (metric: IMetricCard, index: number) => (
    <div
      key={index}
      className={`rounded-xl p-5 flex flex-col items-start ${metric.bgColor || 'bg-white'} ${index === 0 ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="self-start mb-2">{metric.icon}</div>
      <span className={`text-2xl font-semibold ${metric.color}`}>{metric.value}</span>
      <span className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
        {metric.label}
      </span>
    </div>
  );

  return (
    <Fragment>
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mb-8">
        {metrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      <div className="flex items-center justify-between gap-2.5 flex-wrap mb-7.5">
        <div className="flex items-center flex-wrap gap-2.5 ml-auto">
          <button className="btn btn-sm btn-outline group hover:bg-blue-50">
            <i className="ki-duotone ki-row-horizontal text-gray-500 group-hover:text-blue-700"></i>
          </button>
          <button className="btn btn-sm btn-outline group hover:bg-blue-50">
            <i className="ki-duotone ki-category text-blue-600 group-hover:text-blue-700"></i>
          </button>

          <button className="btn btn-sm w-28 btn-outline btn-light">
            <KeenIcon icon="setting-4" /> Filters
          </button>
          <select className="select select-sm w-28">
            <option value="1">Export</option>
            <option value="2">Disabled</option>
            <option value="2">Pending</option>
          </select>

          <div className="flex">
            <label className="input input-sm w-60">
              <KeenIcon icon="search-normal-1" /> Search...
            </label>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { NetworkMiniCardsContent };
