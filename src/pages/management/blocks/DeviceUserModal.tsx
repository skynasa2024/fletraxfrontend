import { Box, CircularProgress, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@/components';
import { getUserHirarchy, UserModel } from '@/api/user';
import { FormattedMessage, useIntl } from 'react-intl';
import { Users } from 'lucide-react';

interface DeviceUserModalProps {
  deviceIdent: string | null;
  userId: string | null;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflow: 'auto'
};

export function DeviceUserModal({ deviceIdent, userId }: DeviceUserModalProps) {
  const intl = useIntl();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const buildTreeNode = (user: UserModel, hasChildren: boolean): TreeItem => ({
    id: user.id,
    label: user.name,
    hasChildren,
    userData: user
  });

  const buildNodeWithChildren = (
    parent: UserModel,
    child: UserModel,
    childHasChildren: boolean
  ): TreeItem => ({
    id: parent.id,
    label: parent.name,
    hasChildren: true,
    userData: parent,
    children: [buildTreeNode(child, childHasChildren)]
  });

  const buildTreeStructure = (hierarchy: UserModel[]): TreeItem[] => {
    if (!hierarchy.length) return [];

    const rootUser = hierarchy[hierarchy.length - 1];

    if (hierarchy.length === 1) {
      return [buildTreeNode(rootUser, false)];
    }

    const createRecursiveStructure = (users: any[], index: number): TreeItem[] => {
      if (index >= users.length - 1) {
        return [buildTreeNode(users[index], index > 0)];
      }

      return [buildNodeWithChildren(users[index + 1], users[index], index > 0)];
    };

    return createRecursiveStructure(hierarchy, hierarchy.length - 1);
  };

  const collectAllNodeIds = (items: TreeItem[]): string[] => {
    const ids: string[] = [];

    const traverse = (nodes: TreeItem[]) => {
      nodes.forEach((node) => {
        ids.push(node.id);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(items);
    return ids;
  };

  const fetchUserHierarchy = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const hierarchy = await getUserHirarchy(userId);

      if (hierarchy.length) {
        const tree = buildTreeStructure(hierarchy);
        setTreeData(tree);

        // Collect all node IDs for full expansion
        const allIds = collectAllNodeIds(tree);
        setExpandedIds(allIds);
      }
    } catch (error) {
      console.error('Error fetching user hierarchy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildren = async () => [];

  const openUserModal = () => setIsUserModalOpen(true);
  const closeUserModal = () => setIsUserModalOpen(false);

  useEffect(() => {
    if (deviceIdent && userId && isUserModalOpen) {
      fetchUserHierarchy();
    }
  }, [isUserModalOpen, deviceIdent, userId]);

  const renderContent = () => {
    if (!userId) {
      return (
        <div className="flex justify-center items-center h-full text-gray-500">
          <FormattedMessage
            id="DEVICE.NO_LINKED_USERS"
            defaultMessage="No linked users for this device"
          />
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      );
    }

    return (
      <TreeView
        data={treeData}
        fetchChildren={fetchChildren}
        onSelect={() => {}}
        noChildrenMessage={intl.formatMessage({
          id: 'USER.NO_CHILDREN',
          defaultMessage: 'No users under this item'
        })}
        preExpandedIds={expandedIds}
        selectedId={userId}
      />
    );
  };

  return (
    <>
      <Modal
        open={isUserModalOpen}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            closeUserModal();
          }
        }}
        disableEscapeKeyDown
      >
        <Box sx={modalStyle}>
          <h2 className="text-xl font-semibold mb-4">
            <FormattedMessage id="USER.LINKED_USERS.TITLE" defaultMessage="Device User Hierarchy" />
          </h2>
          <p className="text-gray-500 mb-4">
            <FormattedMessage
              id="DEVICE.LINKED_USERS.DESCRIPTION"
              defaultMessage="This shows the user hierarchy for device {ident}. The highlighted user is linked to this device."
              values={{ ident: deviceIdent || '' }}
            />
          </p>
          <div className="border rounded-md h-[400px]">{renderContent()}</div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-light" onClick={closeUserModal}>
              <FormattedMessage id="COMMON.CLOSE" defaultMessage="Close" />
            </button>
          </div>
        </Box>
      </Modal>
      <button
        type="button"
        className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#009EF7]/10"
        onClick={openUserModal}
      >
        <Users size={14} className="text-[#009EF7]" />
      </button>
    </>
  );
}
