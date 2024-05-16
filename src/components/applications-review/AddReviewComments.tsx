import { useDispatch, useSelector } from 'react-redux';
import Modal from '../Modal';
import { AppDispatch, RootState } from '../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import TextArea from '../inputs/TextArea';
import Button from '../inputs/Button';
import { FC, useEffect, useState } from 'react';
import Loader from '../Loader';
import { Step, TabType } from '../../states/features/types';
import moment from 'moment';
import {
  setAddReviewCommentsModal,
  setApplicationReviewComments,
  updateReviewComment,
} from '../../states/features/userApplicationSlice';

export type ReviewComment = {
  comment: string;
  step: Step;
  tab: TabType;
  created_at: string;
  entry_id?: string | null;
  checked?: boolean;
};

interface AddReviewCommentsProps {
  entry_id?: string | null;
  activeStep: Step;
  activeTab: TabType;
}

const AddReviewComments: FC<AddReviewCommentsProps> = ({
  entry_id,
  activeStep,
  activeTab,
}) => {
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
  const { addReviewCommentsModal, application_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<ReviewComment | null | undefined>(
    null || undefined
  );
  const { user } = useSelector((state: RootState) => state.user);

  // SET DEFAULT VALUE
  useEffect(() => {
    if (application_review_comments?.length > 0) {
      const commentExists = application_review_comments?.find(
        (business_comment: ReviewComment) =>
          business_comment?.step?.name === activeStep?.name &&
          business_comment?.entry_id === entry_id
      );
      if (commentExists) {
        setValue('comment', commentExists?.comment);
        setComment(commentExists);
      }
    }
  }, [
    activeStep?.name,
    application_review_comments,
    setValue,
    addReviewCommentsModal,
    entry_id,
  ]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newComment = {
        comment: data?.comment,
        step: activeStep,
        entry_id,
        tab: {
          name: activeTab?.name,
          label: activeTab?.label,
        },
        created_at: moment().format(),
      };
      if (comment) {
        dispatch(
          updateReviewComment({
            ...newComment,
            checked: false,
            reviewer: user,
          })
        );
      } else {
        dispatch(
          setApplicationReviewComments([
            {
              ...newComment,
              checked: false,
              reviewer: user,
            },
            ...application_review_comments,
          ])
        );
      }
      setValue('comment', '');
      reset({
        comment: '',
      });
      dispatch(setAddReviewCommentsModal(false));
    }, 1000);
  };

  return (
    <Modal
      isOpen={addReviewCommentsModal}
      onClose={() => {
        setTimeout(() => {
          setValue('comment', '');
          setComment(null);
        }, 500);
        dispatch(setAddReviewCommentsModal(false));
      }}
    >
      <h3 className="text-lg text-center">
        Add comment for {activeStep?.label}
      </h3>
      <form
        className="flex flex-col w-full gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="comment"
          control={control}
          defaultValue={comment && comment?.comment}
          rules={{ required: 'Comment is required' }}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-2">
                <TextArea
                  required
                  placeholder="Add comment to provide the applicant with more context"
                  label="Comment box"
                  {...field}
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
        <menu className="flex items-center justify-between w-full gap-3">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              setTimeout(() => {
                setValue('comment', '');
                setComment(null);
              }, 500);
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
