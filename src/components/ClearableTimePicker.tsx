import React from 'react';
import { KeenIcon } from '@/components';

interface ClearableTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ClearableTimePicker: React.FC<ClearableTimePickerProps> = ({
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`input input-sm h-[34px] shrink-0 relative ${className}`}>
      <input
        type="time"
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {value && (
        <button
          className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-600"
          onClick={() => onChange('')}
          type="button"
        >
          <KeenIcon icon="cross" />
        </button>
      )}
    </div>
  );
};
