import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { TabType } from "../../navigationTypes/navigationTypes";
import { UnknownAction } from "@reduxjs/toolkit";
import { ReviewComment } from "../applications-review/AddReviewComments";
import {
  setUserReviewTabComments,
  setUserReviewTabCommentsModal,
} from "../../states/features/userApplicationSlice";

interface Props {
  tabs: TabType[];
  setActiveTab: (tab: string) => UnknownAction;
}

const ProgressNavigation = ({ tabs, setActiveTab }: Props) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");
  const { user } = useSelector((state: RootState) => state.user);

  const countUnresolvedTabComments = (tab: TabType) => {
    return applicationReviewComments.filter(
      (comment: ReviewComment) =>
        comment?.tab.name === tab?.name &&
        comment?.entry_id === entry_id &&
        !comment?.checked
    ).length;
  };

  const countCheckedTabComments = (tab: TabType) => {
    return applicationReviewComments.filter(
      (comment: ReviewComment) =>
        comment?.tab.name === tab?.name &&
        comment?.entry_id === entry_id &&
        comment?.checked
    ).length;
  }

  return (
    <nav className="flex items-center gap-4 bg-white h-fit py-[5px] rounded-md shadow-sm w-full justify-evenly px-4">
      {tabs.map((tab: TabType, index: number, arr: Array<TabType>) => {
        return (
          <Link
            key={Number(index)}
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setActiveTab(tab?.name));
            }}
            className={`step rounded-none w-full h-full py-[6px] px-2 flex text-center items-center justify-center gap-4 cursor-pointer hover:bg-primary hover:!rounded-md hover:text-white ${
              index < arr.length - 1 && 'border-r border-gray-500'
            } ${tab?.active && 'bg-primary text-white !rounded-md'}`}
          >
            <h1 className="text-[14px] tab-name">{tab?.label}</h1>
            {!/info|admin/.test(user.email) && (countUnresolvedTabComments(tab) > 0 ||
                countCheckedTabComments(tab) > 0) && (
                <menu
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const tabComments = applicationReviewComments.filter(
                      (comment: ReviewComment) =>
                        comment?.tab.name === tab?.name &&
                        comment?.entry_id === entry_id
                    );
                    dispatch(setUserReviewTabComments(tabComments));
                    dispatch(setUserReviewTabCommentsModal(true));
                  }}
                  className={`flex items-center text-[12px] w-2 h-2 p-3 text-white justify-center transition-all rounded-full cursor-pointer hover:scale-102 ${
                    countUnresolvedTabComments(tab) <= 0
                      ? 'bg-secondary'
                      : 'bg-red-500'
                  }`}
                >
                  <p className="text-[12px]">
                    {countUnresolvedTabComments(tab)}
                  </p>
                </menu>
              )}
          </Link>
        );
      })}
    </nav>
  );
};

export default ProgressNavigation;
