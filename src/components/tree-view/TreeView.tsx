import React, { useCallback, useEffect, useState, useRef } from 'react';
import { List, AutoSizer, ListRowProps } from 'react-virtualized';
import { TreeViewItem } from './TreeViewItem';
import { TreeItem, TreeViewProps, FlattenedTreeItem } from './types';

const TreeView: React.FC<TreeViewProps> = ({
  data,
  fetchChildren,
  onSelect,
  noChildrenMessage = 'No children under this item',
  preExpandedIds = [],
  selectedId = null
}) => {
  const [flattenedItems, setFlattenedItems] = useState<FlattenedTreeItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const listRef = useRef<List>(null);

  // Track the last action type to control scrolling behavior
  const lastActionRef = useRef<'select' | 'expand' | 'initial'>('initial');

  // Track previous selected ID to detect changes
  const prevSelectedIdRef = useRef<string | null>(null);

  // Helper to convert flattened array back to hierarchical structure
  const unflattenTree = useCallback((flatItems: FlattenedTreeItem[]): TreeItem[] => {
    const root: TreeItem[] = [];
    const itemMap = new Map<string, TreeItem>();

    flatItems.forEach((item) => {
      if (!item.isPlaceholder) {
        const treeItem: TreeItem = {
          id: item.id,
          label: item.label,
          hasChildren: item.hasChildren,
          children: item.children || [],
          parentId: item.parentId
        };
        itemMap.set(item.id, treeItem);
      }
    });

    flatItems.forEach((item) => {
      if (item.isPlaceholder) return;

      const parentId = item.parentId;

      if (!parentId) {
        if (!root.some((rootItem) => rootItem.id === item.id)) {
          root.push(itemMap.get(item.id)!);
        }
      } else if (itemMap.has(parentId)) {
        const parent = itemMap.get(parentId)!;
        if (!parent.children) parent.children = [];
        if (!parent.children.some((child) => child.id === item.id)) {
          parent.children.push(itemMap.get(item.id)!);
        }
      }
    });

    return root.length > 0
      ? root
      : (flatItems.filter((item) => !item.isPlaceholder && !item.parentId) as TreeItem[]);
  }, []);

  // Initialize expandedIds with preExpandedIds when they change
  useEffect(() => {
    if (preExpandedIds && preExpandedIds.length > 0) {
      setExpandedIds(new Set(preExpandedIds));
    }
  }, [preExpandedIds]);

  // Convert hierarchical tree data into a flattened array for virtualization
  const flattenTree = useCallback(
    (items: TreeItem[], depth = 0): FlattenedTreeItem[] => {
      let result: FlattenedTreeItem[] = [];

      for (const item of items) {
        result.push({
          ...item,
          depth,
          isExpanded: expandedIds.has(item.id),
          isLoading: loadingIds.has(item.id),
          isSelected: selectedId === item.id
        });

        if (expandedIds.has(item.id) && item.children && item.children.length > 0) {
          result = result.concat(flattenTree(item.children, depth + 1));
        } else if (expandedIds.has(item.id) && (!item.children || item.children.length === 0)) {
          result.push({
            id: `${item.id}-empty`,
            label: noChildrenMessage as string,
            hasChildren: false,
            depth: depth + 1,
            isExpanded: false,
            isLoading: false,
            isSelected: false,
            isPlaceholder: true
          });
        }
      }

      return result;
    },
    [expandedIds, loadingIds, selectedId, noChildrenMessage]
  );

  // Initialize flattened items when data changes
  useEffect(() => {
    if (data) {
      setFlattenedItems(flattenTree(data));
    }
  }, [data, flattenTree]);

  // Handle pre-expanded IDs by fetching their children
  useEffect(() => {
    const loadPreExpandedNodes = async () => {
      if (!preExpandedIds.length || !data.length) return;

      for (const expandId of preExpandedIds) {
        const nodeToExpand = flattenedItems.find((item) => item.id === expandId);

        if (!nodeToExpand || (nodeToExpand.children && nodeToExpand.children.length > 0)) continue;

        if (nodeToExpand.hasChildren && fetchChildren) {
          try {
            setLoadingIds((prev) => {
              const newLoadingIds = new Set(prev);
              newLoadingIds.add(expandId);
              return newLoadingIds;
            });

            const children = await fetchChildren(expandId);

            setFlattenedItems((prevItems) => {
              const itemIndex = prevItems.findIndex((i) => i.id === expandId);
              if (itemIndex === -1) return prevItems;

              const newItems = [...prevItems];
              newItems[itemIndex] = {
                ...newItems[itemIndex],
                children
              };

              return flattenTree(unflattenTree(newItems));
            });
          } catch (error) {
            console.error(`Error fetching children for pre-expanded node ${expandId}:`, error);
          } finally {
            setLoadingIds((prev) => {
              const newLoadingIds = new Set(prev);
              newLoadingIds.delete(expandId);
              return newLoadingIds;
            });
          }
        }
      }
    };

    loadPreExpandedNodes();
  }, [preExpandedIds, data, flattenedItems, fetchChildren, flattenTree, unflattenTree]);

  const handleToggleExpand = async (item: FlattenedTreeItem) => {
    if (item.isPlaceholder) return;

    // Set the action type to 'expand' to prevent scrolling
    lastActionRef.current = 'expand';

    if (expandedIds.has(item.id)) {
      const newExpandedIds = new Set(expandedIds);
      newExpandedIds.delete(item.id);
      setExpandedIds(newExpandedIds);
      return;
    }

    if (item.children && item.children.length > 0) {
      const newExpandedIds = new Set(expandedIds);
      newExpandedIds.add(item.id);
      setExpandedIds(newExpandedIds);
      return;
    }

    if (item.hasChildren && fetchChildren) {
      setLoadingIds((prev) => {
        const newLoadingIds = new Set(prev);
        newLoadingIds.add(item.id);
        return newLoadingIds;
      });

      try {
        const children = await fetchChildren(item.id);

        setFlattenedItems((prevItems) => {
          const itemIndex = prevItems.findIndex((i) => i.id === item.id);
          if (itemIndex === -1) return prevItems;

          const newItems = [...prevItems];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            children
          };

          return flattenTree(unflattenTree(newItems));
        });

        setExpandedIds((prev) => {
          const newExpandedIds = new Set(prev);
          newExpandedIds.add(item.id);
          return newExpandedIds;
        });
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setLoadingIds((prev) => {
          const newLoadingIds = new Set(prev);
          newLoadingIds.delete(item.id);
          return newLoadingIds;
        });
      }
    }
  };

  const handleSelect = (item: FlattenedTreeItem) => {
    if (item.isPlaceholder) return;

    // Set the action type to 'select' to allow scrolling
    lastActionRef.current = 'select';

    if (onSelect) {
      onSelect(item);
    }
  };

  // Controlled scrolling logic - only scroll when appropriate
  useEffect(() => {
    // On initial load or when selected ID changes from external source
    if (selectedId !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedId;

      // Only scroll if this was from a selection action or initial load
      if (lastActionRef.current === 'select' || lastActionRef.current === 'initial') {
        const selectedIndex = flattenedItems.findIndex((item) => item.id === selectedId);
        if (selectedIndex >= 0 && listRef.current) {
          listRef.current.scrollToRow(selectedIndex);
        }
      }
    }
  }, [selectedId, flattenedItems]);

  // Handle initial scroll to selected node when component mounts
  useEffect(() => {
    if (selectedId && lastActionRef.current === 'initial') {
      const selectedIndex = flattenedItems.findIndex((item) => item.id === selectedId);
      if (selectedIndex >= 0 && listRef.current) {
        listRef.current.scrollToRow(selectedIndex);
        // After initial scroll, update the action ref
        lastActionRef.current = 'select';
      }
    }
  }, [selectedId, flattenedItems]);

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const item = flattenedItems[index];
    return (
      <div key={key} style={style}>
        <TreeViewItem
          item={item}
          onToggle={() => handleToggleExpand(item)}
          onSelect={() => handleSelect(item)}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-[200px] overflow-hidden border border-gray-200 rounded-md">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            rowCount={flattenedItems.length}
            rowHeight={56}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default TreeView;
