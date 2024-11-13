import clsx from 'clsx';

export interface ButtonRadioGroupProps {
  selection: string;
  // eslint-disable-next-line no-unused-vars
  setSelection: (value: string) => void;
  selections: string[];
}

export const ButtonRadioGroup = ({
  selection,
  setSelection,
  selections
}: ButtonRadioGroupProps) => {
  return (
    <div className="flex gap-2">
      {selections.map((value) => (
        <button
          key={value}
          className={clsx('btn', selection === value ? 'btn-dark' : 'btn-light btn-clear')}
          onClick={() => setSelection(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
};
