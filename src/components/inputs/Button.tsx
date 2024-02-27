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
}) => {
  if (submit || type === 'submit') {
    return (
      <button
        type={type || 'submit'}
        className={`py-2 px-6 rounded-md text-[15px] text-primary border-[1px] border-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-100 hover:scale-[1.01] ${
          disabled &&
          'bg-secondary hover:!scale-[1] cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center'
        } ${
          !styled &&
          'bg-transparent !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
        } ${className} ${
          primary &&
          '!bg-primary !text-white hover:!bg-primary hover:!text-white'
        } max-[800px]:!text-[14px]`}
      >
        {value}
      </button>
    );
  }

  return (
    <Link
      to={route}
      onClick={onClick}
      className={`py-2 px-6 rounded-md text-[15px] text-primary border-[1px] border-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-400 hover:scale-[1.005] ${
        disabled &&
        'bg-secondary hover:!scale-[1] cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center'
      } ${
        !styled &&
        'bg-transparent !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
      } ${className} ${
        primary && '!bg-primary !text-white hover:!bg-primary hover:!text-white'
      } max-[800px]:!text-[14px]`}
    >
      {value}
    </Link>
  );
};

export default Button;
