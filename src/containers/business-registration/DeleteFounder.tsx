import Modal from "@/components/Modal";
import Button from "@/components/inputs/Button";
import { useDeleteShareholderMutation } from "@/states/api/businessRegApiSlice";
import {
  removeFounderDetail,
  setDeleteFounderDetailModal,
  setFounderDetailModal,
  setSelectedFounderDetail,
} from "@/states/features/founderDetailSlice";
import { AppDispatch, RootState } from "@/states/store";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

const DeleteFounder = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteFounderDetailModal, selectedFounderDetail } = useSelector(
    (state: RootState) => state.founderDetail
  );

  // INITIALIZE DELETE FOUNDER MUTATION
  const [
    deleteFounder,
    {
      isLoading: founderIsLoading,
      isError: founderIsError,
      error: founderError,
      isSuccess: founderIsSuccess,
      reset: founderReset,
    },
  ] = useDeleteShareholderMutation();

  // HANDLE DELETE FOUNDER RESPONSE
  useEffect(() => {
    if (founderIsError) {
      const errorData =
        (founderError as ErrorResponse)?.data?.message ||
        "An error occurred while deleting founder. Refresh and try again";
      toast.error(errorData);
      founderReset();
    } else if (founderIsSuccess && selectedFounderDetail) {
      toast.success(
        `${
          selectedFounderDetail?.personDetail?.firstName ||
          selectedFounderDetail?.organization?.organizationName ||
          ""
        } removed successfully`
      );
      dispatch(removeFounderDetail(selectedFounderDetail?.id));
      dispatch(setSelectedFounderDetail(undefined));
      dispatch(setDeleteFounderDetailModal(false));
      dispatch(setFounderDetailModal(false));
      founderReset();
    }
  }, [
    founderError,
    founderIsError,
    founderIsSuccess,
    founderReset,
    selectedFounderDetail,
    dispatch,
  ]);

  return (
    <Modal
      isOpen={deleteFounderDetailModal}
      onClose={() => {
        dispatch(setDeleteFounderDetailModal(false));
        dispatch(setSelectedFounderDetail(undefined));
      }}
      heading={`Delete ${
        selectedFounderDetail?.personDetail?.firstName ||
        selectedFounderDetail?.organization?.organizationName ||
        ""
      }`}
    >
      <section className="flex flex-col w-full gap-4">
        <p>
          Are you sure you want to delete{" "}
          {selectedFounderDetail?.personDetail?.firstName ||
            selectedFounderDetail?.organization?.organizationName ||
            ""}
          ? This action cannot be undone!
        </p>
        <div className="flex justify-end gap-4">
          <Button
            value={"Cancel"}
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteFounderDetailModal(false));
              dispatch(setSelectedFounderDetail(undefined));
            }}
          />
          <Button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              deleteFounder({
                id: selectedFounderDetail?.id,
              });
            }}
            danger
            value={`${founderIsLoading ? <Loader /> : "Confirm"}`}
          />
        </div>
      </section>
    </Modal>
  );
};

export default DeleteFounder;
