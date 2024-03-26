import { FC, ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { UnknownAction } from "@reduxjs/toolkit";
import { Step, TabType } from "../../states/features/types";

interface TabProps {
  steps: Array<Step>;
  isOpen: boolean;
  children: ReactNode;
  setActiveStep: (step: string) => UnknownAction;
  active_tab?: TabType;
}

const Tab: FC<TabProps> = ({
  steps,
  isOpen,
  children,
  active_tab,
  setActiveStep,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {application_review_comments} = useSelector((state: RootState) => state.userApplication);

  // HANDLE RENDER
  useEffect(() => {
    if (isOpen && steps?.length > 0) {
      dispatch(
        setActiveStep(
          steps?.find(
            (step) =>
              step?.tab_name === active_tab?.name && step?.active === true
          )?.name ||
            steps?.find((step: Step) => !step?.completed)?.name ||
            steps[0]?.name
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  return (
    <section className="flex items-start w-full p-6 bg-white rounded-md shadow-sm">
      <aside
        className={`${
          steps && steps?.length > 1 ? "flex" : "hidden"
        } flex-col gap-2 w-[20%] p-3 px-4 rounded-md`}
      >
        {steps?.map((step: Step, index: number, arr: Array<Step>) => {
          return (
            <Link
              to={'#'}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setActiveStep(step?.name));
              }}
              className="flex items-start w-full gap-4"
            >
              <figure className="flex flex-col gap-1 items-center max-w-[10%]">
                {step?.completed ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="py-[8px] px-[9px] text-white rounded-full bg-primary"
                  />
                ) : (
                  <p
                    className={`text-[15px] h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white text-secondary font-semibold ${
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
              <menu className="flex items-center justify-between gap-3">
                <h4 className="font-medium text-[15px] mt-[5px]">{step?.label}</h4>
                {step?.active && <hr className="border-[1px] border-primary font-bold text-primary h-full min-h-[25px]" />}
              </menu>
            </Link>
          );
        })}
      </aside>
      <menu
        className={`flex flex-col gap-3 h-full p-5 ${
          steps?.length <= 1 ? "!w-[90%] mx-auto" : "w-[80%]"
        }`}
      >
        <h1 className="text-lg font-semibold text-center uppercase">
          {steps?.find((step) => step?.active)?.label}
        </h1>
        <section className="w-full p-4">{children}</section>
      </menu>
    </section>
  );
};

export default Tab;
