import clsx from 'clsx';
import { useField } from 'formik';
import React from 'react';

type FormRadioButtonProps = {
  name: string;
  value: string;
  label: string;
};

export default function FormRadioButton({ name, value, label }: FormRadioButtonProps) {
  const [field] = useField({ name, type: 'radio', value });

  return (
    <label
      className={clsx(
        'px-6 py-2 border border-dashed rounded-md dark:bg-light-active dark:light-active',
        'hover:bg-gray-200 bg-neutral-50 transition-colors',
        'flex items-center gap-2 cursor-pointer',
        {
          'border-info': field.checked,
          'border-gray-300': !field.checked
        }
      )}
    >
      <input type="radio" {...field} checked={field.checked} className="hidden" />
      <div
        className={clsx('w-4 h-4 rounded-full bg-gray-200', {
          'border-4 border-info': field.checked,
          'border-2 border-gray-300': !field.checked
        })}
      />
      {label}
    </label>
  );
}
