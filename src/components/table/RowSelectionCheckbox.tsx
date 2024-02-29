import { useEffect, useRef, FC } from 'react';

interface RowSelectionCheckboxProps {
  indeterminate?: boolean;
  label?: string;
  checked?: boolean;
}

const RowSelectionCheckbox: FC<RowSelectionCheckboxProps> = ({
  indeterminate,
  label = null,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }
  }, [indeterminate, rest.checked]);

  return (
    <label className="flex items-center gap-[6px]">
      <input
        className="w-4 h-8 rounded-xl checked:bg-whiteTheme-primaryColor cursor-pointer shadow-sm hover:ring-whiteTheme-primaryColor"
        type="checkbox"
        ref={ref}
        {...rest}
      />
      {label && label}
    </label>
  );
};

export default RowSelectionCheckbox;
