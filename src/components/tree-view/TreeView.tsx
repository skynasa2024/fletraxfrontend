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
  const [treeData, setTreeData] = useState<TreeItem[]>(data);
  const [flattenedItems, setFlattenedItems] = useState<FlattenedTreeItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(preExpandedIds));
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const listRef = useRef<List>(null);
  const initialLoad = useRef(true);
  const lastAction = useRef<'expand' | 'select' | 'initial'>('initial');
  const prevSelectedId = useRef<string | null>(null);

  // Helper to find a node in the tree by ID
  const findNodeById = (items: TreeItem[], id: string): TreeItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children && item.children.length > 0) {
        const found = findNodeById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to update a node in the tree
  const updateNodeInTree = (items: TreeItem[], id: string, updater: (node: TreeItem) => TreeItem): TreeItem[] => {
    return items.map(item => {
      if (item.id === id) {
        return updater(item);
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateNodeInTree(item.children, id, updater)
        };
      }
      return item;
    });
  };

  // Convert hierarchical tree data into a flattened array for virtualization
  const flattenTree = useCallback(
    (items: TreeItem[], depth = 0): FlattenedTreeItem[] => {
      let result: FlattenedTreeItem[] = [];

      for (const item of items) {
        // Add the current item to the flattened list
        result.push({
          ...item,
          depth,
          isExpanded: expandedIds.has(item.id),
          isLoading: loadingIds.has(item.id),
          isSelected: selectedId === item.id
        });

        // If this item is expanded, add its children to the flattened list
        if (expandedIds.has(item.id)) {
          if (item.children && item.children.length > 0) {
            // Add all children recursively
            result = result.concat(flattenTree(item.children, depth + 1));
          } else if (!loadingIds.has(item.id)) {
            // If we're not currently loading children and no children exist, show the "no children" message
            const showEmptyMessage = item.hasChildren === false ||
              (item.hasChildren && item.children && item.children.length === 0);

            if (showEmptyMessage) {
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
        }
      }

      return result;
    },
    [expandedIds, loadingIds, selectedId, noChildrenMessage]
  );

  // Update flattened items whenever treeData changes
  useEffect(() => {
    setFlattenedItems(flattenTree(treeData));
  }, [treeData, flattenTree]);

  // Initialize with provided data
  useEffect(() => {
    if (data) {
      setTreeData(data);
    }
  }, [data]);

  // Handle pre-expanded nodes on initial load
  useEffect(() => {
    const loadPreExpandedNodes = async () => {
      if (!preExpandedIds.length || initialLoad.current === false) return;
      initialLoad.current = false;
      lastAction.current = 'initial';

      const nodesToExpand = preExpandedIds.filter(id => {
        const node = findNodeById(treeData, id);
        return node && node.hasChildren && (!node.children || node.children.length === 0);
      });

      for (const id of nodesToExpand) {
        try {
          setLoadingIds(prev => new Set(prev).add(id));
          const children = await fetchChildren(id);

          setTreeData(prevData => updateNodeInTree(prevData, id, node => ({
            ...node,
            children
          })));
        } catch (error) {
          console.error(`Error fetching children for pre-expanded node ${id}:`, error);
        } finally {
          setLoadingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      }
    };

    loadPreExpandedNodes();
  }, [preExpandedIds, treeData, fetchChildren]);

  // Handle node expansion/collapse
  const handleToggleExpand = async (item: FlattenedTreeItem) => {
    if (item.isPlaceholder) return;

    // Set the action to expand to prevent scrolling
    lastAction.current = 'expand';

    // If already expanded, collapse the node
    if (expandedIds.has(item.id)) {
      const newExpandedIds = new Set(expandedIds);
      newExpandedIds.delete(item.id);
      setExpandedIds(newExpandedIds);
      return;
    }

    // Mark as expanded immediately for better UX
    setExpandedIds(prev => new Set(prev).add(item.id));

    // Only fetch children if they haven't been loaded yet
    if (item.hasChildren && (!item.children || item.children.length === 0) && fetchChildren) {
      setLoadingIds(prev => new Set(prev).add(item.id));

      try {
        const children = await fetchChildren(item.id);

        // Update the tree data with the fetched children
        setTreeData(prevData => updateNodeInTree(prevData, item.id, node => ({
          ...node,
          children
        })));
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setLoadingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }
    }
  };

  // Handle node selection
  const handleSelect = (item: FlattenedTreeItem) => {
    if (item.isPlaceholder) return;

    // Set the action to select to allow scrolling
    lastAction.current = 'select';

    if (onSelect) {
      onSelect(item);
    }
  };

  // Scroll to selected node when selectedId changes, but only if it's from a selection action
  useEffect(() => {
    // Only scroll if the selectedId actually changed
    if (selectedId !== prevSelectedId.current) {
      prevSelectedId.current = selectedId;

      // Only scroll if this was from a selection action or initial load
      if ((lastAction.current === 'select' || lastAction.current === 'initial') && selectedId) {
        const selectedIndex = flattenedItems.findIndex(item => item.id === selectedId);
        if (selectedIndex >= 0 && listRef.current) {
          listRef.current.scrollToRow(selectedIndex);
        }
      }
    }
  }, [selectedId, flattenedItems]);

  // Row renderer for the virtualized list
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
    <div className="w-full h-full min-h-[200px] overflow-hidden border border-gray-200 rounded-md p-2">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            rowCount={flattenedItems.length}
            rowHeight={54}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default TreeView;
