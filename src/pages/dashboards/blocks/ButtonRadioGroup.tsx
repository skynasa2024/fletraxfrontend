export interface ButtonRadioGroupProps<T = string> {
  selection: T;
  // eslint-disable-next-line no-unused-vars
  setSelection: (value: T) => void;
  selections: T[];
  translations?: Record<string, string>;
  className?: string;
  suffix?: Record<string, string>;
  disabled?: boolean;
}

export const ButtonRadioGroup = <T extends string | number>({
  selection,
  setSelection,
  selections,
  suffix,
  translations,
  className = 'btn data-[selected=true]:btn-dark btn-light data-[selected=false]:btn-clear',
  disabled
}: ButtonRadioGroupProps<T>) => {
  return (
    <div className="flex gap-4">
      {selections.map((value) => (
        <button
          key={String(value)}
          data-selected={selection === value}
          className={className}
          onClick={() => setSelection(value)}
          disabled={disabled}
        >
          {translations?.[String(value)] ?? value}
          {suffix?.[String(value)] ?? ''}
        </button>
      ))}
    </div>
  );
};
