import { FC, ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { AppDispatch } from "../../states/store";
import { useDispatch } from "react-redux";
import { UnknownAction } from "@reduxjs/toolkit";
import { Step } from "../../states/features/types";

interface TabProps {
  steps: Array<Step>;
  isOpen: boolean;
  children: ReactNode;
  setActiveStep: (step: string) => UnknownAction;
}

const Tab: FC<TabProps> = ({ steps, isOpen, children, setActiveStep }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // HANDLE RENDER
  useEffect(() => {
    if (isOpen && steps?.length > 0) {
      dispatch(
        setActiveStep(
          steps?.find((step: Step) => !step?.completed)?.name || steps[0]?.name
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
          steps && steps?.length > 0 ? "flex" : "hidden"
        } flex-col gap-2 w-[20%] p-3 px-4 rounded-md`}
      >
        {steps?.map((step: Step, index: number, arr: Array<Step>) => {
          return (
            <Link
              to={"#"}
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
                    className="p-2 text-white rounded-full bg-primary"
                  />
                ) : (
                  <p
                    className={`text-[15px] p-[6px] px-[14px] rounded-full bg-white text-secondary font-semibold w-fit ${
                      step?.active && "!text-white !bg-primary"
                    }`}
                  >
                    {String(index + 1)}
                  </p>
                )}
                <hr
                  className={`border-l-[.5px] w-0 border-secondary h-8 ${
                    index === arr?.length - 1 && "hidden"
                  }`}
                />
              </figure>
              <h4 className="font-medium text-[15px] mt-2">{step?.label}</h4>
            </Link>
          );
        })}
      </aside>
      <menu className="flex w-[80%] flex-col gap-3 bg-white rounded-md shadow-sm h-full p-5">
        <h1 className="text-lg font-semibold text-center uppercase">
          {steps?.find((step) => step?.active)?.label}
        </h1>
        <section className="w-full p-4">{children}</section>
      </menu>
    </section>
  );
};

export default Tab;
