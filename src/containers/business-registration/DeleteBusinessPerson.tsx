import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Button from "@/components/inputs/Button";
import { useDeleteBusinessPersonMutation } from "@/states/api/businessRegApiSlice";
import { removeBoardMember } from "@/states/features/boardOfDirectorSlice";
import {
  setBusinessPerson,
  setDeleteBusinessPersonModal,
  setSelectedBusinessPerson,
} from "@/states/features/businessPeopleSlice";
import { setBusinessPersonDetailsModal } from "@/states/features/businessRegistrationSlice";
import { removeExecutiveManager } from "@/states/features/executiveManagerSlice";
import { AppDispatch, RootState } from "@/states/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

const DeleteBusinessPerson = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBusinessPersonModal, selectedBusinessPerson } = useSelector(
    (state: RootState) => state.businessPeople
  );

  // INITIALIZE DELETE BUSINESS PERSON MUTATION
  const [
    deleteBusinessPerson,
    {
      isLoading: businessPersonIsLoading,
      isError: businessPersonIsError,
      error: businessPersonError,
      isSuccess: businessPersonIsSuccess,
      reset: businessPersonReset,
    },
  ] = useDeleteBusinessPersonMutation();

  // HANDLE DELETE BUSINESS PERSON RESPONSE
  useEffect(() => {
    if (businessPersonIsError) {
      const errorData =
        (businessPersonError as ErrorResponse)?.data?.message ||
        "An error occurred while deleting person. Refresh and try again";
      toast.error(errorData);
      businessPersonReset();
    } else if (businessPersonIsSuccess && selectedBusinessPerson) {
      toast.success(
        `${selectedBusinessPerson?.firstName || ""} removed successfully`
      );
      dispatch(removeExecutiveManager(selectedBusinessPerson?.id));
      dispatch(removeBoardMember(selectedBusinessPerson?.id));
      dispatch(setSelectedBusinessPerson(undefined));
      dispatch(setBusinessPerson(undefined));
      dispatch(setDeleteBusinessPersonModal(false));
      dispatch(setBusinessPersonDetailsModal(false));
      businessPersonReset();
    }
  }, [
    businessPersonError,
    businessPersonIsError,
    businessPersonIsSuccess,
    businessPersonReset,
    dispatch,
    selectedBusinessPerson,
  ]);

  return (
    <Modal
      isOpen={deleteBusinessPersonModal}
      onClose={() => {
        dispatch(setDeleteBusinessPersonModal(false));
        dispatch(setSelectedBusinessPerson(undefined));
      }}
      heading={`Delete ${selectedBusinessPerson?.firstName || ""}
          ${selectedBusinessPerson?.lastName || ""}`}
    >
      <section className="flex flex-col w-full gap-4">
        <p>
          Are you sure you want to delete{" "}
          {selectedBusinessPerson?.firstName || ""}{" "}
          {selectedBusinessPerson?.lastName || ""}? This action cannot be
          undone!
        </p>
        <menu className="flex items-center justify-between w-full gap-3">
          <Button
            value={"Cancel"}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteBusinessPersonModal(false));
              dispatch(setSelectedBusinessPerson(undefined));
            }}
          />
          <Button
            value={businessPersonIsLoading ? <Loader /> : "Confirm"}
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteBusinessPerson({ id: selectedBusinessPerson?.id });
            }}
          />
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteBusinessPerson;
