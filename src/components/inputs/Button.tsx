import { FC, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  route?: string;
  value: string | JSX.Element;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  primary?: boolean;
  styled?: boolean;
  className?: string;
  submit?: boolean;
  danger?: boolean;
}

const Button: FC<ButtonProps> = ({
  route = '#',
  value,
  onClick,
  type = null,
  disabled = false,
  primary = false,
  styled = true,
  className,
  submit = false,
  danger = false,
}) => {
  if (submit || type === 'submit') {
    return (
      <button
        type={type || 'submit'}
        className={`py-[8px] max-[800px]:!text-[14px] shadow-md transition-all flex items-center justify-center text-center px-6 rounded-md text-[15px] text-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-100 hover:scale-[1.01] max-[800px]:!text-lg max-md:!py-2 ${
          disabled &&
          '!bg-background !shadow-none hover:!scale-[1] !cursor-default hover:!bg-background hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center transition-all'
        } ${
          !styled &&
          'bg-transparent !shadow-none !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary transition-all'
        } ${className} ${
          primary &&
          '!bg-primary !sha !text-white hover:!bg-primary hover:!text-white !shadow-sm'
        }`}
        disabled={disabled}
      >
        {value}
      </button>
    );
  }

  return (
    <Link
      to={route}
      onClick={onClick}
      className={`py-2 text-center border-[1px] border-primary px-6 rounded-md text-[15px] text-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-400 hover:scale-[1.005] max-[800px]:!text-lg max-md:!py-2 ${
        !styled &&
        'bg-transparent !shadow-none !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
      } ${className} ${
        primary &&
        '!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm'
      }
      ${
        danger &&
        '!bg-red-600 !border-none !text-white hover:!bg-red-600 hover:!text-white !shadow-sm'
      } ${
        disabled &&
        '!bg-secondary !shadow-none hover:!scale-[1] !cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center transition-all'
      }`}
    >
      {value}
    </Link>
  );
};

export default Button;
