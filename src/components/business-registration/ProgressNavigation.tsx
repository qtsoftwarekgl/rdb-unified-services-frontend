import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { TabType } from "../../states/features/types";
import { UnknownAction } from "@reduxjs/toolkit";
import { ReviewComment } from "../applications-review/AddReviewComments";
import { useState } from "react";
import Modal from "../Modal";
import { formatDate } from "../../helpers/Strings";

interface Props {
  tabs: TabType[];
  activeTab: TabType;
  setActiveTab: (tab: string) => UnknownAction;
}

const ProgressNavigation = ({ tabs, setActiveTab, activeTab }: Props) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { application_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");
  const { user } = useSelector((state: RootState) => state.user);
  const [showTabComments, setShowTabComments] = useState(false);
  const [comments, setTabComments] = useState<ReviewComment[]>([]);

  const tabComments = (tab: TabType) => {
    return application_review_comments.filter(
      (comment: ReviewComment) =>
        comment?.tab.name === tab?.name && comment?.entry_id === entry_id
    ).length;
  };

  return (
    <nav className="flex items-center gap-4 bg-white h-fit py-[5px] rounded-md shadow-sm w-full justify-evenly px-4">
      {tabs.map((tab: TabType, index: number, arr: Array<TabType>) => {
        return (
          <Link
            key={Number(index)}
            to={"#"}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setActiveTab(tab?.name));
            }}
            className={`step rounded-none w-full h-full py-[6px] px-2 flex text-center items-center justify-center gap-4 cursor-pointer hover:bg-primary hover:!rounded-md hover:text-white ${
              index < arr.length - 1 && "border-r border-gray-500"
            } ${tab?.active && "bg-primary text-white !rounded-md"}`}
          >
            <h1 className="text-[14px] tab-name">{tab?.label}</h1>
            {!/info|admin/.test(user.email) && tabComments(tab) > 0 && (
              <menu
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const tabComments = application_review_comments.filter(
                    (comment: ReviewComment) =>
                      comment?.tab.name === tab?.name &&
                      comment?.entry_id === entry_id
                  );
                  setTabComments(tabComments);
                  setShowTabComments(!showTabComments);
                }}
                className="flex items-center justify-center w-8 h-8 text-white transition-all bg-red-500 rounded-full cursor-pointer hover:scale-105"
              >
                <span>{tabComments(tab)}</span>
              </menu>
            )}
          </Link>
        );
      })}
      <Modal
        isOpen={showTabComments}
        onClose={() => {
          setShowTabComments(false);
        }}
      >
        <section className="flex w-full flex-col gap-6 mt-6 max-h-[70vh] overflow-y-scroll pr-4">
          <h1 className="text-lg font-semibold text-center uppercase text-primary">
            {activeTab.label} Review Comments
          </h1>
          {comments.map((comment, index: number) => {
            return (
              <menu
                key={index}
                className="flex items-center justify-between w-full gap-3 p-2 px-4 rounded-md hover:bg-slate-50"
              >
                <ul className="flex flex-col gap-1">
                  <h3 className="font-semibold uppercase text-primary">
                    {comment?.step?.label}
                  </h3>
                  <p className="text-[14px] font-normal">{comment.comment}</p>
                  <p className="text-sm">{formatDate(comment.created_at)}</p>
                </ul>
              </menu>
            );
          })}
        </section>
      </Modal>
    </nav>
  );
};

export default ProgressNavigation;
