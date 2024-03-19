import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../components/Modal';
import { AppDispatch, RootState } from '../../../states/store';
import {
  setReviewComments,
  setAddReviewCommentsModal,
  updateReviewComment,
} from '../../../states/features/businessRegistrationSlice';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import TextArea from '../../../components/inputs/TextArea';
import Button from '../../../components/inputs/Button';
import { useEffect, useRef, useState } from 'react';
import Loader from '../../../components/Loader';
import { Step, TabType } from '../../../states/features/types';
import moment from 'moment';

export type ReviewComment = {
  comment: string;
  step: Step;
  tab: TabType;
  created_at: string;
};

const AddReviewComments = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    addReviewCommentsModal,
    business_active_step,
    business_review_comments,
    business_active_tab,
  } = useSelector((state: RootState) => state.businessRegistration);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<ReviewComment | null>(null);

  // COMMENT REF
  const commentRef = useRef<HTMLTextAreaElement>(null);

  // RESET FORM ON MODAL CLOSE
  useEffect(() => {
    if (!addReviewCommentsModal) {
      reset();
      commentRef.current?.blur();
      if (commentRef?.current?.value) {
        commentRef.current.value = '';
      }
      setComment(null);
    } else if (addReviewCommentsModal) {
      commentRef.current?.focus();
      const commentExists = business_review_comments?.find(
        (business_comment: ReviewComment) =>
          business_comment?.step?.name === business_active_step?.name
      );
      if (commentExists) {
        setComment(commentExists);
      }
    }
  }, [
    business_active_step?.name,
    business_review_comments,
    reset,
    addReviewCommentsModal,
  ]);

  // SET DEFAULT VALUE
  useEffect(() => {
    if (business_review_comments?.length > 0) {
      const commentExists = business_review_comments?.find(
        (business_comment: ReviewComment) =>
          business_comment?.step?.name === business_active_step?.name
      );
      if (commentExists) {
        setValue('comment', commentExists?.comment);
        setComment(commentExists);
        commentRef.current?.focus();
        if (commentRef.current) {
          commentRef.current.value = commentExists?.comment;
        }
      }
    }
  }, [
    business_active_step?.name,
    business_review_comments,
    setValue,
    addReviewCommentsModal,
  ]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newComment = {
        comment: data?.comment,
        step: business_active_step,
        tab: {
          name: business_active_tab?.name,
          label: business_active_tab?.label,
        },
        created_at: moment().format(),
      };
      if (comment) {
        dispatch(updateReviewComment(newComment));
      } else {
        dispatch(setReviewComments([newComment, ...business_review_comments]));
      }
      if (commentRef?.current?.value) {
        commentRef.current.value = '';
      }
      dispatch(setAddReviewCommentsModal(false));
    }, 1000);
  };

  return (
    <Modal
      isOpen={addReviewCommentsModal}
      onClose={() => {
        dispatch(setAddReviewCommentsModal(false));
      }}
    >
      <h3 className="text-center text-lg">
        Add comment for {business_active_step?.label}
      </h3>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="comment"
          control={control}
          defaultValue={comment && comment?.comment}
          rules={{ required: 'Comment is required' }}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-2 w-full">
                <TextArea
                  ref={commentRef}
                  required
                  defaultValue={comment ? comment?.comment : ''}
                  placeholder="Add comment to provide the applicant with more context"
                  label="Comment box"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
                {errors.comment && (
                  <p className="text-red-500 text-[13px]">
                    {String(errors.comment.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <menu className="flex items-center gap-3 justify-between w-full">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddReviewCommentsModal(false));
            }}
          />
          <Button value={isLoading ? <Loader /> : 'Save'} primary submit />
        </menu>
      </form>
    </Modal>
  );
};

export default AddReviewComments;
