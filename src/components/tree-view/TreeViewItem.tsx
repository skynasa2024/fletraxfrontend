import React from 'react';
import { FlattenedTreeItem } from './types';
import clsx from 'clsx';

interface TreeViewItemProps {
  item: FlattenedTreeItem;
  onToggle: () => void;
  onSelect: () => void;
}

export const TreeViewItem: React.FC<TreeViewItemProps> = ({ item, onToggle, onSelect }) => {
  const indentationPadding = `${item.depth * 20}px`;

  if (item.isPlaceholder) {
    return (
      <div
        className="flex items-center h-9 text-gray-500 italic"
        style={{ paddingLeft: indentationPadding }}
      >
        <span className="ml-6">{item.label}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center h-12 cursor-pointer select-none',
        item.depth === 0 ? 'border rounded-md' : 'border-0',
        {
          'bg-info-light text-info': item.isSelected,
          'hover:bg-gray-100': !item.isSelected
        }
      )}
      onClick={onSelect}
    >
      <div
        className="flex items-center h-full flex-grow"
        style={{ paddingLeft: indentationPadding }}
      >
        {item.hasChildren && (
          <div
            className="flex items-center justify-center w-5 h-5 mr-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {item.isLoading ? (
              <div className="flex items-center justify-center w-5 h-5">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 border-t-primary animate-spin"></div>
              </div>
            ) : (
              <span className="h-4 w-4 flex items-center justify-center font-semibold text-lg">
                {item.isExpanded ? '-' : '+'}
              </span>
            )}
          </div>
        )}
        {!item.hasChildren && <div className="w-2 mr-1"></div>}
        <div className="flex-grow truncate">{item.label}</div>
      </div>
    </div>
  );
};
