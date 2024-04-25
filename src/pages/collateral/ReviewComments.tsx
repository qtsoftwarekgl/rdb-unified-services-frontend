import { ReviewComment } from "@/components/applications-review/AddReviewComments";
import {
  updateReviewComment,
  updateUserReviewComment,
} from "@/states/features/userApplicationSlice";
import { RootState } from "@/states/store";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ReviewComments = () => {
  const { application_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");
  const dispatch = useDispatch();

  const my_reviews = application_review_comments.filter(
    (comment: ReviewComment) =>
      comment?.entry_id === entry_id && comment?.checked !== true
  );

  console.log(my_reviews);

  if (my_reviews.length === 0) return null;

  return (
    <section className="p-6 bg-white rounded-md shadow-sm w-[33%] h-fit overflow-auto ">
      <h1 className="w-full text-base font-bold">Unresolved Comments</h1>
      {my_reviews.map((comment: ReviewComment, index: number) => {
        return (
          <section>
            <menu
              key={index}
              className="flex items-center justify-between w-full gap-3 p-2 px-4 rounded-md hover:bg-slate-50"
            >
              <ul className="flex flex-col gap-1">
                <p className="text-[14px] text-red-800 font-normal">
                  {comment.comment}
                </p>
              </ul>
              <menu className="flex items-center gap2">
                <FontAwesomeIcon
                  icon={comment?.checked ? faCircleCheck : faCheckDouble}
                  className="w-3 h-3 p-2 text-white transition-all duration-200 ease-in-out rounded-full cursor-pointer hover:scale-102 bg-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      updateUserReviewComment({ ...comment, checked: true })
                    );
                    dispatch(
                      updateReviewComment({ ...comment, checked: true })
                    );
                  }}
                />
              </menu>
            </menu>
            {index !== my_reviews.length - 1 && (
              <hr className="h-0.5 border-t-0 my-2 bg-neutral-100 dark:bg-white/10" />
            )}
          </section>
        );
      })}
    </section>
  );
};

export default ReviewComments;
