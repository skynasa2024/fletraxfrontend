import { Container } from '@/components/container';
import { ProfileDefaultContent } from '.';

const Device = () => {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">Device List</h3>

        <a href="/devices/add-device">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            New Device
          </button>
        </a>
      </div>

      <ProfileDefaultContent />
    </Container>
  );
};

export { Device };
