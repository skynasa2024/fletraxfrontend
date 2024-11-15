import {
  About,
  CommunityBadges,
  Connections,
  Contributions,
  MediaUploads,
  Projects,
  RecentUploads,
  Tags,
  UnlockPartnerships,
  WorkExperience
} from './blocks';

const ProfileDefaultContent = () => {
  return (
      <div className="grid gap-5 lg:gap-7.5">
        <Projects />
     
    </div>
  );
};

export { ProfileDefaultContent };
