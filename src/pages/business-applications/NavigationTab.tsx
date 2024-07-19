import { ReactNode, useEffect } from 'react';
import { ErrorResponse, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  AbstractNavigationFlow,
  NavigationFlow,
} from '@/types/models/navigationFlow';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useCreateNavigationFlowMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { setBusinessNavigationFlowsList } from '@/states/features/navigationFlowSlice';
import Loader from '@/components/Loader';

interface NavigationTabProps {
  children: ReactNode;
  navigationSteps: AbstractNavigationFlow[];
  activeNavigation?: NavigationFlow;
}

const NavigationTab = ({
  navigationSteps,
  children,
  activeNavigation,
}: NavigationTabProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const { business } = useSelector((state: RootState) => state.business);

  // INITIALIZE CREATE BUSINESS NAVIGATION FLOW
  const [
    createNavigationFlow,
    {
      data: createNavigationFlowData,
      error: createNavigationFlowError,
      isError: createNavigationFlowIsError,
      isSuccess: createNavigationFlowIsSuccess,
      isLoading: createNavigationFlowIsLoading,
    },
  ] = useCreateNavigationFlowMutation();
  // HANDLE CREATE BUSINESS NAVIGATION FLOW RESPONSE
  useEffect(() => {
    if (createNavigationFlowIsError) {
      const errorResponse =
        (createNavigationFlowError as ErrorResponse)?.data?.message ||
        'An error occurred while creating business navigation flow. Refresh and try again';
      toast.error(errorResponse);
    } else if (createNavigationFlowIsSuccess) {
      dispatch(setBusinessNavigationFlowsList(createNavigationFlowData?.data));
    }
  }, [
    createNavigationFlowData?.data,
    createNavigationFlowError,
    createNavigationFlowIsError,
    createNavigationFlowIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex items-start w-full p-6 bg-white rounded-md shadow-sm">
      <aside
        className={`${
          navigationSteps && navigationSteps?.length > 1 ? 'flex' : 'hidden'
        } flex-col gap-2 w-[20%] p-3 px-4 rounded-md`}
      >
        {navigationSteps
          ?.filter(
            (tempNavigationStep) =>
              (tempNavigationStep as unknown as AbstractNavigationFlow)
                ?.tabName === activeNavigation?.navigationFlowMass?.tabName
          )
          ?.map(
            (
              navigationStep: AbstractNavigationFlow,
              index: number,
              arr: AbstractNavigationFlow[]
            ) => {
              const navigationExists = businessNavigationFlowsList?.find(
                (navigationFlow) =>
                  navigationFlow?.navigationFlowMass?.stepName ===
                  navigationStep?.stepName
              );
              return (
                <Link
                  to={'#'}
                  key={index}
                  className="flex items-start w-full gap-4"
                  onClick={(e) => {
                    e.preventDefault();
                    createNavigationFlow({
                      isActive: true,
                      massId: navigationStep?.id,
                      businessId: business?.id,
                    });
                  }}
                >
                  <figure className="flex flex-col gap-1 items-center max-w-[10%]">
                    {navigationExists?.completed ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="py-[8px] px-[9px] text-white rounded-full bg-primary"
                      />
                    ) : (
                      <p
                        className={`text-[15px] h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white text-secondary font-semibold ${
                          navigationExists?.active && '!text-white !bg-primary'
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
                  <menu className="flex items-center justify-between gap-3">
                    <h4 className="font-medium text-[15px] mt-[5px]">
                      {navigationStep?.stepName}
                    </h4>
                  </menu>
                </Link>
              );
            }
          )}
      </aside>
      {createNavigationFlowIsLoading ? (
        <figure className="min-h-[30vh] flex items-center justify-center w-full">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <menu
          className={`flex flex-col gap-3 h-full p-4 ${
            navigationSteps?.length <= 1 ? '!w-[90%] mx-auto' : 'w-[80%]'
          }`}
        >
          <menu
            className={`relative flex items-center justify-between gap-3 w-full`}
          >
            <h1 className="min-w-[70%] w-full text-lg font-semibold text-center uppercase">
              {activeNavigation?.navigationFlowMass?.stepName}
            </h1>
          </menu>
          <section className="w-full p-4">{children}</section>
        </menu>
      )}
    </section>
  );
};

export default NavigationTab;
