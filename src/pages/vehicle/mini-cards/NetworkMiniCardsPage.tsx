import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { useLayout } from '@/providers';
import UserMiniCards, { MetricData } from './UserMiniCards.tsx';
import BlocksIcon from '../blocks/svg/BlocksIcon.tsx';
import PeopleIcon from '../blocks/svg/PeopleIcon.tsx';
import { useNavigate } from 'react-router';

const metrics: MetricData[] = [
  {
    value: '250',
    label: 'Total Vehicles',
    textColor: 'text-white',
    bgColor: 'bg-blue-500',
    icon: <BlocksIcon />
  },
  {
    value: '5',
    label: 'Rented Vehicles',
    textColor: 'text-gray-800',
    icon: <PeopleIcon color="#FF0000" />
  },
  {
    value: '25',
    label: 'Vehicles in maintenance',
    textColor: 'text-gray-800',
    icon: <PeopleIcon color="#FFA800" />
  },
  {
    value: '5',
    label: 'Available For Rent',
    textColor: 'text-gray-800',
    icon: <PeopleIcon color="#5271FF" />
  }
];

const NetworkMiniCardsPage = () => {
  const navigate = useNavigate();
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Central Hub for Personal Customization</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Upload CSV
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add User
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto"
          onClick={() => navigate('/vehicles/add-vehicle')}
        >
          New Vehicle
        </button>
        <UserMiniCards metrics={metrics} />
      </Container>
    </Fragment>
  );
};

export { NetworkMiniCardsPage };
