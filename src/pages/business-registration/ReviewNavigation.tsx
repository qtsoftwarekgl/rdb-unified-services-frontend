import {
  faBars,
  faChevronCircleLeft,
  faChevronCircleRight,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/inputs/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../states/store";
import { Step, TabType } from "../../states/features/types";
import { Link } from "react-router-dom";
import { FC, useState } from "react";
import { UnknownAction } from "@reduxjs/toolkit";
import {
  setAddReviewCommentsModal,
  setListReviewCommentsModal,
} from "../../states/features/userApplicationSlice";

interface ReviewNavigationProps {
  tabs: Array<TabType>;
  activeStep: Step;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (string: string) => UnknownAction;
}

const ReviewNavigation: FC<ReviewNavigationProps> = ({
  tabs,
  activeStep,
  setActiveTab,
  setActiveStep,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  // HANDLE STEPS NAVIGATION
  const handleNavigation = (direction: string) => {
    const steps = tabs?.flatMap((tab: TabType) => tab?.steps);
    const activeStepIndex = steps?.findIndex(
      (step: Step) => step?.name === activeStep?.name
    );
    const nextStep = steps?.[activeStepIndex + 1];
    const prevStep = steps?.[activeStepIndex - 1];

    if (direction === "next") {
      dispatch(setActiveStep(nextStep?.name));
      dispatch(setActiveTab(nextStep?.tab_name));
    } else if (direction === "prev") {
      dispatch(setActiveStep(prevStep?.name));
      dispatch(setActiveTab(prevStep?.tab_name));
    }
  };

  return (
    <section className="left-[17vw] right-0 w-fit mx-auto fixed bottom-4">
      <menu className="relative flex items-center justify-center gap-3 p-5 mx-auto bg-white rounded-md shadow-md w-fit">
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          onClick={(e) => {
            if (
              activeStep?.name.includes("company_details") ||
              activeStep?.name === "enterprise_details"
            ) {
              return;
            }
            e.preventDefault();
            handleNavigation("prev");
          }}
          className={`${
            activeStep?.name.includes("company_details") ||
            activeStep?.name === "enterprise_details"
              ? "text-secondary !cursor-default hover:scale-[1]"
              : "flex"
          } text-3xl text-primary ease-in-out duration-200 hover:scale-[1.02] cursor-pointer`}
        />
        <ul className="flex items-center gap-3">
          <Button
            value="Recommend for approval"
            primary={activeStep?.name.includes("preview_submission")}
            disabled={!activeStep?.name.includes("preview_submission")}
          />
          <Button value="Decline" danger />
          {!activeStep?.name.includes("preview_submission") ? (
            <Button
              value="Add comment"
              className="!bg-orange-600 !border-none hover:!bg-orange-700 !text-white !hover:!text-white !hover:!border-none"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setAddReviewCommentsModal(true));
              }}
            />
          ) : (
            <Button
              className="!bg-orange-600 !border-none hover:!bg-orange-700 !text-white !hover:!text-white !hover:!border-none"
              value="View comments"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setListReviewCommentsModal(true));
                setShowMenu(false);
              }}
            />
          )}
          <section
            className={`${
              activeStep?.name.includes("preview_submission") && "hidden"
            } flex flex-col gap-2`}
          >
            <menu
              className={`${
                showMenu ? "flex" : "hidden"
              } flex-col gap-1 absolute bottom-[80px] right-2 bg-background shadow-md rounded-sm`}
            >
              <Link
                className={`hover:bg-primary bg-white hover:text-white p-2`}
                to={"#"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setListReviewCommentsModal(true));
                  setShowMenu(false);
                }}
              >
                View comments
              </Link>
            </menu>
            <FontAwesomeIcon
              icon={showMenu ? faX : faBars}
              className={`${
                showMenu ? "text-[13px] px-[9px]" : "text-[14px]"
              } p-2 cursor-pointer ease-in-out duration-200 hover:scale-[1.02] bg-primary text-white rounded-full`}
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
            />
          </section>
        </ul>
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          onClick={(e) => {
            if (activeStep?.name.includes("preview_submission")) {
              return;
            }
            e.preventDefault();
            handleNavigation("next");
          }}
          className={`${
            activeStep?.name.includes("preview_submission")
              ? "text-secondary !cursor-default hover:scale-[1]"
              : "flex"
          } text-3xl text-primary ease-in-out duration-200 hover:scale-[1.02] cursor-pointer`}
        />
      </menu>
    </section>
  );
};

export default ReviewNavigation;