import { ErrorResponse, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { AbstractNavigationFlow } from '@/types/models/navigationFlow';
import { useSelector } from 'react-redux';
import { useCreateNavigationFlowMutation } from '@/states/api/businessRegApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { setBusinessNavigationFlowsList } from '@/states/features/navigationFlowSlice';
import Loader from '@/components/Loader';

type ProgressNavigationProps = {
  navigationTabs: {
    tabName: string;
    completed: boolean;
    active: boolean;
    navigationSteps: AbstractNavigationFlow[];
  }[];
  setActiveTab: (tab: string) => UnknownAction;
}

const ProgressNavigation = ({ navigationTabs }: ProgressNavigationProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessNavigationFlowsList } = useSelector((state: RootState) => state.navigationFlow);
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
        dispatch(
          setBusinessNavigationFlowsList(createNavigationFlowData?.data)
        );
        resetCreateNavigationFlow();
      }
    }, [createNavigationFlowData?.data, createNavigationFlowError, createNavigationFlowIsError, createNavigationFlowIsSuccess, dispatch, resetCreateNavigationFlow]);

  return (
    <nav className="flex items-center gap-4 bg-white h-fit py-[5px] rounded-md shadow-sm w-full justify-evenly px-4">
      {navigationTabs.map((navigationTab, index: number, arr) => {
        return (
          <Link
            key={Number(index)}
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              let newNavigationFlow;
              const navigationsExist = businessNavigationFlowsList
                .filter(
                  (navigationFlow) =>
                    navigationFlow?.navigationFlowMass?.tabName ===
                    navigationTab?.tabName
                )
                ?.sort(
                  (a, b) =>
                    a?.navigationFlowMass?.stepPosition -
                    b?.navigationFlowMass?.stepPosition
                );
              if (navigationsExist.length > 0) {
                newNavigationFlow =
                  navigationsExist?.find((navFlow) => !navFlow?.completed) ||
                  navigationsExist.pop();
                  createNavigationFlow({
                    massId: newNavigationFlow?.navigationFlowMass?.id,
                    businessId: business?.id,
                    isActive: true,
                  });
              } else {
                newNavigationFlow = navigationTab?.navigationSteps[0];
                createNavigationFlow({
                  massId: newNavigationFlow?.id,
                  businessId: business?.id,
                  isActive: true,
                });
              }
            }}
            className={`step rounded-none w-full h-full py-[6px] px-2 flex text-center items-center justify-center gap-4 cursor-pointer hover:bg-primary hover:!rounded-md hover:text-white ${
              index < arr.length - 1 && 'border-r border-gray-500'
            } ${navigationTab?.active && 'bg-primary text-white !rounded-md'} ${
              navigationTab?.completed && '!rounded-md !border-none'
            }`}
          >
            {createNavigationFlowIsLoading ? (
              <Loader className="text-primary" />
            ) : (
              <h1 className="text-[14px] navigationTab-name flex items-center gap-2">
                {navigationTab?.completed && (
                  <FontAwesomeIcon
                    className="text-primary size-4"
                    icon={faCircleCheck}
                  />
                )}{' '}
                {(navigationTab as unknown as AbstractNavigationFlow)?.tabName}
              </h1>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default ProgressNavigation;
