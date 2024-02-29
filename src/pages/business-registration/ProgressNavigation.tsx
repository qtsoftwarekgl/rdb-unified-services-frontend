import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '../../states/features/businessRegistrationSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

const ProgressNavigation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { step } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  // BREADCRUMB NAVIGATION
  const steps = [
    {
      no: 1,
      name: 'Company Details',
      path: '/business-registration/business-details',
    },
    {
      no: 2,
      name: 'Articles of association',
      path: '/business-registration/articles-of-association',
    },
    {
      no: 3,
      name: 'Business Activity',
      path: '/business-registration/business-activity',
    },
    {
      no: 4,
      name: 'Request for VAT',
      path: '/business-registration/request-for-vat',
    },
    {
      no: 5,
      name: 'Preview',
      path: '/business-registration/preview',
    }
  ];

  return (
    <nav className="flex items-center gap-4 bg-white h-fit py-[5px] rounded-md shadow-sm w-full justify-evenly px-4">
      {steps.map((currentStep, index) => {
        const selected = step === currentStep?.no;
        return (
          <Link
            key={index}
            to={'#'}
            className={`step w-full h-full py-[6px] flex items-center justify-center gap-4 cursor-pointer hover:bg-background rounded-md ${
              selected && 'bg-background'
            }`}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setStep(currentStep?.no));
            }}
          >
            <span className="text-[14px] currentStep-no">
              {currentStep?.no >= step ? (
                currentStep?.no
              ) : (
                <FontAwesomeIcon icon={faCircleCheck} />
              )}
            </span>
            <span className="text-[14px] currentStep-name">
              {currentStep.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default ProgressNavigation;
