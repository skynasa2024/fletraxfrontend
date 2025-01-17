import { UserList } from './blocks';
import { UserMiniCards } from './mini-cards/UserMiniCards';

const UserPage = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800">User List</h3>

        <a href="/users/add-user">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
            New User
          </button>
        </a>
      </div>

      <UserMiniCards />
      <UserList />
    </div>
  );
};

export { UserPage };
