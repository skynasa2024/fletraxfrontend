import { Projects } from './blocks';
import { NetworkMiniCardsContent } from '../mini-cards/NetworkMiniCardsContent';

const ProfileDefaultContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <NetworkMiniCardsContent />
      <Projects />
    </div>
  );
};

export { ProfileDefaultContent };
