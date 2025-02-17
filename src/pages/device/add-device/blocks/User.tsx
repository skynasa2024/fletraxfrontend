import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddDevicePageProps } from '../AddDevicePage';
import { UserSearch } from './UserSearch';
import { getUser, getUserModel, getUsersUnderParent, UserModel } from '@/api/user';
import { CircularProgress } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const User = ({ device }: AddDevicePageProps) => {
  const [loading, setLoading] = useState(false);
  const [userTree, setUserTree] = useState<({ name: string; id: string } | null)[]>([null]);
  useEffect(() => {
    const lastUser = userTree[userTree.length - 1];
    if (lastUser && lastUser.id) {
      getUsersUnderParent(lastUser.id, { start: 0, end: 0 }).then((users) => {
        if (users.totalCount > 0) {
          setUserTree((prev) => {
            if (prev[prev.length - 1]?.id === lastUser.id) {
              return prev.concat(null);
            }
            return prev;
          });
        }
      });
    }
  }, [userTree]);
  const selectedUser = useMemo(() => {
    for (let i = userTree.length - 1; i >= 0; i--) {
      if (userTree[i]?.id?.length && userTree[i]?.id.length! > 0) {
        return userTree[i];
      }
    }
    return null;
  }, [userTree]);

  const getParent = async (id: string | UserModel) => {
    const user = typeof id === 'string' ? await getUserModel(id) : id;
    if (!user.parentId) {
      return null;
    }
    return await getUser(user.parentId);
  };

  const getParents = useCallback(async (id: string) => {
    const parents: { name: string; id: string }[] = [];
    const user = await getUserModel(id);
    parents.push({ name: user.name, id: user.id });
    let parent = await getParent(user);
    while (parent) {
      parents.push({ id: parent.id, name: parent.name });
      parent = await getParent(parent.id);
    }
    return parents.reverse();
  }, []);

  // Populate the user tree if the device has a user
  useEffect(() => {
    if (!device?.userId) {
      return;
    }
    setLoading(true);
    getParents(device.userId)
      .then(setUserTree)
      .then(() => setLoading(false));
  }, [device, getParents]);

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="company_settings">
        <h3 className="card-title">
          <FormattedMessage id="DEVICE.FORM.USER" />
        </h3>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-16">
          <CircularProgress />
        </div>
      ) : (
        <div className="card-body grid grid-cols-3 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">
              <FormattedMessage id="DEVICE.FORM.USER" />
            </label>
            <UserSearch
              onSelectUserId={(id, name) => {
                setUserTree((prev) => {
                  const newTree = prev.slice(0, 0);
                  newTree.push({ id, name });
                  return newTree;
                });
              }}
              initialSearch={userTree[0]?.name}
            />
          </div>
          {userTree.slice(1).map((_, index) => (
            <div key={index} className="grid gap-2.5">
              <label className="form-label">
                <FormattedMessage id="DEVICE.FORM.SUBUSER" values={{ number: index + 1 }} />
              </label>
              <UserSearch
                parentId={userTree[index]?.id}
                onSelectUserId={(id, name) => {
                  setUserTree((prev) => {
                    const newTree = prev.slice(0, index + 1);
                    newTree.push({ id, name });
                    return newTree;
                  });
                }}
                initialSearch={userTree[index + 1]?.name}
              />
            </div>
          ))}
        </div>
      )}
      <input type="hidden" name="userId" value={selectedUser?.id} />
    </div>
  );
};

export { User };
