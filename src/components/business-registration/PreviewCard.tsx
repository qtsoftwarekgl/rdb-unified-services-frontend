import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode, useEffect } from 'react';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../inputs/Button';
import { RDBAdminEmailPattern } from '@/constants/Users';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ErrorResponse, Link } from 'react-router-dom';
import { businessId } from '@/types/models/business';
import { UUID } from 'crypto';
import { useCreateNavigationFlowMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { setBusinessNavigationFlowsList } from '@/states/features/navigationFlowSlice';
import Loader from '../Loader';

interface PreviewCardProps {
  header: string;
  children: ReactNode;
  businessId?: businessId;
  applicationStatus?: string;
  navigationFlowMassId?: UUID;
}

const PreviewCard: FC<PreviewCardProps> = ({
  children,
  header,
  navigationFlowMassId,
  businessId,
  applicationStatus,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  // INITIALIZE CREATE BUSINESS NAVIGATION FLOW
  const [
    createNavigationFlow,
    {
      data: createNavigationFlowData,
      error: createNavigationFlowError,
      isError: createNavigationFlowIsError,
      isSuccess: createNavigationFlowIsSuccess,
      isLoading: createNavigationFlowIsLoading,
      reset: resetCreateNavigationFlow,
    },
  ] = useCreateNavigationFlowMutation();

  // HANDLE CREATE BUSINESS NAVIGATION FLOW RESPONSE
  useEffect(() => {
    if (createNavigationFlowIsError) {
      const errorResponse =
        (createNavigationFlowError as ErrorResponse)?.data?.message ||
        'An error occurred while creating business navigation flow. Refresh and try again';
      toast.error(errorResponse);
      resetCreateNavigationFlow();
    } else if (createNavigationFlowIsSuccess) {
      dispatch(setBusinessNavigationFlowsList(createNavigationFlowData?.data));
      resetCreateNavigationFlow();
    }
  }, [
    createNavigationFlowData?.data,
    createNavigationFlowError,
    createNavigationFlowIsError,
    createNavigationFlowIsSuccess,
    dispatch,
    resetCreateNavigationFlow,
  ]);

  return (
    <section
      className={`flex flex-col w-full gap-3 p-4 rounded-md shadow-sm border-primary border-[.3px]`}
    >
      <menu className="flex items-center justify-between w-full gap-3">
        <Link
          to={'#'}
          onClick={(e) => {
            e.preventDefault();
          }}
          className="text-lg font-semibold uppercase text-primary"
        >
          {header}
        </Link>
        <menu className="flex items-center gap-4 relative">
          {createNavigationFlowIsLoading ? (
            <Loader className="text-primary" />
          ) : (
            ['IN_PROGRESS', 'IS_AMENDING'].includes(
              String(applicationStatus)
            ) && (
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={(e) => {
                  e.preventDefault();
                  if (businessId && navigationFlowMassId) {
                    createNavigationFlow({
                      isActive: true,
                      massId: navigationFlowMassId,
                      businessId,
                    });
                  }
                }}
                className="text-primary text-[18px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              />
            )
          )}
          {false && (
            <ul className="flex flex-col gap-1 bg-white rounded-sm shadow-md absolute top-8 w-full z-[10000]">
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="p-1 px-2 text-[13px] hover:bg-primary hover:text-white"
              >
                View
              </Link>
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="p-1 px-2 text-[13px] hover:bg-primary hover:text-white"
              >
                Update
              </Link>
            </ul>
          )}
        </menu>
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
      {RDBAdminEmailPattern.test(String(user?.email)) && (
        <menu className="flex items-center w-full justify-center">
          <Button
            styled={false}
            onClick={(e) => {
              e.preventDefault();
            }}
            value={
              <menu className="flex items-center gap-2 hover:gap-3 transition-all duration-300">
                <p className="text-[13px]">View details</p>
                <FontAwesomeIcon className="text-[13px]" icon={faArrowRight} />
              </menu>
            }
          />
        </menu>
      )}
    </section>
  );
};

export default PreviewCard;
