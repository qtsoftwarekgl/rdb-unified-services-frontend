import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { formatNumbers } from '../../helpers/strings';
import Button from '../inputs/Button';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface RegistrationApplicationCardProps {
  label: string;
  value: string | number;
  route?: string;
  onClick?: (e: unknown) => void;
}

const RegistrationApplicationCard: FC<RegistrationApplicationCardProps> = ({
  label,
  value,
  route,
  onClick,
}) => {
  // STATE VARIABLES
  const [showCallToAction, setShowCallToAction] = useState(false);

  return (
    <section
      className={`flex flex-col items-start cursor-pointer justify-between w-full bg-white shadow-lg rounded-xl p-4 ease-in-out duration-200 max-w-[23%] max-[1150px]:max-w-[35%] max-[900px]:max-w-[45%] max-[600px]:max-w-[95%] ${
        showCallToAction ? 'gap-2' : 'gap-0'
      }`}
      onMouseEnter={() => setShowCallToAction(true)}
      onMouseLeave={() => setShowCallToAction(false)}
    >
      <section className="flex items-center justify-between w-full gap-2">
        <menu className="flex items-center w-full justify-between gap-3 max-[700px]:gap-2">
          <h3 className="text-secondary font-medium text-[14px] max-[1200px]:text-[14px] max-[700px]:text-[13px]">
            {label}
          </h3>
          <h1 className="flex items-center gap-2 text-primary font-semibold text-[16px] max-[600px]:text-[15px] max-[500px]:text-[14px]">
            {formatNumbers(Number(value))}{' '}
          </h1>
        </menu>
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
          <Link to={'#'} onClick={onClick} className="flex items-center gap-1 text-[13px] ease-in-out hover:gap-2 duration-300">
            <p className="text-[13px]">View more</p>
            <FontAwesomeIcon icon={faArrowRight} className='text-[13px]' />
          </Link>
        }
      />
    </section>
  );
};

export default RegistrationApplicationCard;
