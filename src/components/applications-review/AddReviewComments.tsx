import { useDispatch, useSelector } from 'react-redux';
import Modal from '../Modal';
import { AppDispatch, RootState } from '../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import TextArea from '../inputs/TextArea';
import Button from '../inputs/Button';
import { FC, useEffect, useState } from 'react';
import Loader from '../Loader';
import { Step, TabType } from '../../types/navigationTypes';
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
  createdAt: string;
  updatedAt?: string;
  entryId?: string | null;
  checked?: boolean;
};

interface AddReviewCommentsProps {
  entryId?: string | null;
  activeStep: Step;
  activeTab: TabType;
}

const AddReviewComments: FC<AddReviewCommentsProps> = ({
  entryId,
  activeStep,
  activeTab,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addReviewCommentsModal, applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<ReviewComment | null | undefined>(
    null || undefined
  );
  const { user } = useSelector((state: RootState) => state.user);

  // SET DEFAULT VALUE
  useEffect(() => {
    if (applicationReviewComments?.length > 0 && addReviewCommentsModal) {
      const commentExists = applicationReviewComments?.find(
        (business_comment: ReviewComment) =>
          business_comment?.step?.name === activeStep?.name &&
          business_comment?.entryId === entryId
      );
      if (commentExists) {
        setValue('comment', commentExists?.comment);
        setComment(commentExists);
      } else {
        setValue('comment', '');
        setComment(null);
      }
    }
  }, [
    activeStep,
    applicationReviewComments,
    setValue,
    addReviewCommentsModal,
    entryId,
  ]);


  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newComment = {
        comment: data?.comment,
        step: activeStep,
        entryId,
        tab: {
          name: activeTab?.name,
          label: activeTab?.label,
        },
        createdAt: moment().format(),
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
            ...applicationReviewComments,
          ])
        );
      }
      setValue('comment', '');
      setComment(null);
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
          defaultValue={comment?.comment}
          rules={{ required: 'Comment is required' }}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-2">
                <TextArea
                  required
                  placeholder="Add comment to provide the applicant with more context"
                  label="Comment box"
                  {...field}
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
