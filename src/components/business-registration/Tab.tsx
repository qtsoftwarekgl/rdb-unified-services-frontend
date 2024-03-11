import { FC, useEffect } from 'react';
import {
  RegistrationStep,
  setActiveStep,
} from '../../states/features/businessRegistrationSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';

interface TabProps {
  steps: Array<RegistrationStep>;
  isOpen: boolean;
}

const Tab: FC<TabProps> = ({ steps, isOpen }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // HANDLE RENDER
  useEffect(() => {
    if (isOpen) {
      dispatch(
        setActiveStep(
          steps?.find((step: RegistrationStep) => !step?.completed) || steps[0]
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  return (
    <section className="flex items-start w-full">
      <aside
        className={`${
          steps && steps?.length > 0 ? 'flex' : 'hidden'
        } flex-col gap-2 w-full max-w-[25%]`}
      >
        {steps?.map(
          (
            step: RegistrationStep,
            index: number,
            arr: Array<RegistrationStep>
          ) => {
            return (
              <Link
                to={'#'}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setActiveStep(step));
                }}
                className="w-full flex items-start gap-4"
              >
                <figure className="flex flex-col gap-1 items-center max-w-[10%]">
                  {step?.completed ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <p
                      className={`text-[15px] p-2 px-4 rounded-full bg-white text-secondary font-semibold w-fit ${
                        step?.active && '!text-white !bg-primary'
                      }`}
                    >
                      {String(index + 1)}
                    </p>
                  )}
                  <hr
                    className={`border-l-[.5px] w-0 border-secondary h-8 ${
                      index === arr?.length - 1 && 'hidden'
                    }`}
                  />
                </figure>
                <h4 className="font-medium text-[15px] mt-2">{step?.label}</h4>
              </Link>
            );
          }
        )}
      </aside>
    </section>
  );
};

export default Tab;
