import { CarList } from './blocks';
import { UserMiniCards } from './mini-cards/UserMiniCards';

const ProfileDefaultContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <h3 className="font-bold text-xl text-gray-800">Driver List</h3>

      <UserMiniCards />
      <CarList />
    </div>
  );
};

export { ProfileDefaultContent };
