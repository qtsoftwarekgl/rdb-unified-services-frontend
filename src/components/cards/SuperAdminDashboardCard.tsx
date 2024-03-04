import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { formatNumbers } from '../../helpers/Data';
import Button from '../inputs/Button';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface SuperAdminDashboardCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon: IconProp;
  route?: string;
}

const SuperAdminDashboardCard: FC<SuperAdminDashboardCardProps> = ({
  title,
  value,
  change,
  icon,
  route,
}) => {
  // STATE VARIABLES
  const [showCallToAction, setShowCallToAction] = useState(false);

  return (
    <section
      className={`flex flex-col items-start cursor-pointer justify-between w-full bg-white shadow-lg rounded-xl p-4 ease-in-out duration-200 max-w-[23%] max-[1150px]:max-w-[35%] max-[900px]:max-w-[45%] max-[600px]:max-w-[95%] ${
        showCallToAction ? 'gap-4' : 'gap-0'
      }`}
      onMouseEnter={() => setShowCallToAction(true)}
      onMouseLeave={() => setShowCallToAction(false)}
    >
      <section className="flex items-center justify-between w-full gap-2">
        <menu className="flex items-start flex-col gap-3 max-[700px]:gap-2">
          <h3 className="text-secondary font-medium text-[15px] max-[1200px]:text-[14px] max-[700px]:text-[13px]">{title}</h3>
          <h1 className="flex items-center gap-2 font-semibold text-[16px] max-[600px]:text-[15px] max-[500px]:text-[14px]">
            {formatNumbers(Number(value))}{' '}
            <span
              className={`${change ? 'flex' : 'hidden'} ${
                Number(change) > 0 ? 'text-green-600' : 'text-red-600'
              } text-[12.5px]`}
            >
              {Number(change) > 0 && '+'} {change}%
            </span>
          </h1>
        </menu>
        <figure className="p-3 rounded-xl flex items-center justify-center bg-primary">
          <FontAwesomeIcon className="text-white text-[20px] max-[500px]:text-[16px]" icon={icon} />
        </figure>
      </section>
      <Button
        className={`${
          showCallToAction
            ? 'flex w-full'
            : 'h-0 w-0 opacity-0 pointer-events-none'
        } text-[13px] ease-linear`}
        styled={false}
        route={route}
        value={
          <menu className="flex items-center gap-2 text-[13px] ease-in-out hover:gap-3 duration-300">
            View more
            <FontAwesomeIcon icon={faArrowRight} />
          </menu>
        }
      />
    </section>
  );
};

export default SuperAdminDashboardCard;
