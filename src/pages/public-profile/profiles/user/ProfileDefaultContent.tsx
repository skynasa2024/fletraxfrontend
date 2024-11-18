import { Projects } from './blocks';
import { NetworkMiniCardsContent } from '../mini-cards/NetworkMiniCardsContent';

const ProfileDefaultContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
<h3 className="font-bold text-xl text-gray-800 mb-4">User List</h3>
<NetworkMiniCardsContent />
      <Projects />
    </div>
  );
};

export { ProfileDefaultContent };
