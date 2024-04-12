import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";
import { AppDispatch } from "../../states/store";
import { useDispatch } from "react-redux";
import { UnknownAction } from "@reduxjs/toolkit";
import { setUserApplications } from "../../states/features/userApplicationSlice";

interface PreviewCardProps {
  header: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (step: string) => UnknownAction;
  children: ReactNode;
  stepName: string;
  tabName: string;
  entry_id?: string | null;
}

const PreviewCard: FC<PreviewCardProps> = ({
  children,
  header,
  setActiveTab,
  setActiveStep,
  stepName,
  tabName,
  entry_id,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
      <menu className="flex items-center justify-between w-full gap-3">
        <h2 className="text-lg font-semibold uppercase text-primary">
          {header}
        </h2>
        <FontAwesomeIcon
          icon={faPenToSquare}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setActiveStep(stepName));
            dispatch(setActiveTab(tabName));
            dispatch(setUserApplications({ entry_id, status: "in_preview" }));
          }}
          className="text-primary text-[18px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
        />
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
    </section>
  );
};

export default PreviewCard;
