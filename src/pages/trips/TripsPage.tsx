import { TripsProvider } from './providers/TripsContext';
import { TripsMap } from './TripsMap';

interface TripsPageProps {
  isNewTrips?: boolean;
}

const TripsPage = ({ isNewTrips = false }: TripsPageProps) => {
  return (
    <div className="size-full">
      <TripsProvider isNewTrips={isNewTrips} key={isNewTrips ? 'new-trips' : 'trips'}>
        <TripsMap />
      </TripsProvider>
    </div>
  );
};

export { TripsPage };
