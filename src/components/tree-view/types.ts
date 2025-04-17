export interface TreeItem {
  id: string;
  label: string;
  hasChildren: boolean;
  children?: TreeItem[];
  parentId?: string;
  [key: string]: any;
}

export interface TreeViewProps {
  data: TreeItem[];
  fetchChildren: (nodeId: string) => Promise<TreeItem[]>;
  onSelect?: (node: TreeItem) => void;
  noChildrenMessage?: string | boolean;
  preExpandedIds?: string[];
  selectedId?: string | null;
}

export interface FlattenedTreeItem extends TreeItem {
  depth: number;
  isExpanded: boolean;
  isLoading: boolean;
  isSelected: boolean;
  isPlaceholder?: boolean;
}
