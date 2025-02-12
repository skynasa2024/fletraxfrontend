import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { getUsers, UserModel } from '@/api/user';

interface OwnerSearchProps {
  name: string;
}

const OwnerSearch = ({ name }: OwnerSearchProps) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [search, setSearch] = useState(values[name] || '');
  const [users, setUsers] = useState<UserModel[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    getUsers({ start: 0, end: 10, search }).then((data) => {
      setUsers(data.data);
    });
  }, [search]);

  return (
    <div className="relative">
      <input
        type="text"
        className="input"
        placeholder="Owner"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setFieldValue(name, '');
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && users.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border shadow max-h-60 overflow-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearch(user.name);
                setFieldValue(name, user.id);
                setFocused(false);
              }}
            >
              {user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerSearch;
