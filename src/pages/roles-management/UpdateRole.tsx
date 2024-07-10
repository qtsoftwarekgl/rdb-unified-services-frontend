import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import Modal from "../../components/Modal";
import {
  setCreateRoleModal,
  setSelectedRole,
  setUpdateRoleModal,
  updateRole,
} from "../../states/features/roleSlice";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";
import { useEffect } from "react";
import TextArea from "../../components/inputs/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setListPermissionsModal } from "../../states/features/permissionSlice";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader";
import { useEditRoleMutation } from "@/states/api/userManagementApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateRole = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateRoleModal, role } = useSelector(
    (state: RootState) => state.role
  );
  const { selectedPermissions } = useSelector(
    (state: RootState) => state.permission
  );

  // INITIALIZE UPDATE ROLE QUERY
  const [
    editRole,
    {
      data: editRoleData,
      isLoading: editRoleIsLoading,
      isSuccess: editRoleIsSuccess,
      isError: editRoleIsError,
      error: editRoleError,
    },
  ] = useEditRoleMutation();

  // HANDLE UPDATE ROLE RESPONSE
  useEffect(() => {
    if (editRoleIsSuccess) {
      dispatch(setUpdateRoleModal(false));
      dispatch(updateRole(editRoleData?.data));
      dispatch(setSelectedRole(undefined));
    }
    if (editRoleIsError) {
      const errorResponse =
        (editRoleError as ErrorResponse)?.data?.message ||
        "An error occurred while updating role. Refresh and try again";
      toast.error(errorResponse);
    }
  }, [editRoleError, editRoleIsError, editRoleIsSuccess, dispatch]);

  // UPDATE DEFAULT VALUES
  useEffect(() => {
    setValue("name", role?.roleName);
    setValue("description", role?.description);
  }, [setValue, role]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    editRole({
      id: role?.id,
      roleName: data?.name,
      description: data?.description,
      permissions: selectedPermissions?.map((permission) => permission?.id),
    });
  };

  return (
    <Modal
      isOpen={updateRoleModal}
      onClose={() => {
        dispatch(setUpdateRoleModal(false));
      }}
    >
      <h1 className="text-lg text-center uppercase text-secondary">
        Edit{" "}
        <span className="font-semibold text-primary">{role?.roleName}</span>{" "}
        role
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-[80%] mx-auto"
      >
        <Controller
          defaultValue={watch("name")}
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-2">
                <Input
                  label="Name"
                  placeholder="Role name"
                  defaultValue={watch("name")}
                  {...field}
                />
                {errors?.name && (
                  <p className="text-red-600 text-[13px]">
                    {String(errors?.name?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <Controller
          defaultValue={watch("description")}
          name="description"
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-2">
                <TextArea
                  label="Description"
                  resize
                  placeholder="Role description"
                  defaultValue={watch("description")}
                  {...field}
                />
              </label>
            );
          }}
        />
        {selectedPermissions?.length <= 0 ? (
          <Button
            primary
            className="flex items-center justify-center"
            value={
              <menu className="flex items-center gap-2">
                Update permissions <FontAwesomeIcon icon={faPlus} />
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setListPermissionsModal(true));
              dispatch(setCreateRoleModal(false));
            }}
          />
        ) : (
          <article className="flex flex-col gap-2">
            <h3 className="text-center text-primary">
              {role?.roleName} permissions
            </h3>
            <menu className="flex flex-wrap items-center justify-center gap-3">
              {selectedPermissions?.map((permission) => {
                return (
                  <Button
                    styled={false}
                    value={
                      <menu className="flex items-center gap-1 p-1 rounded-md bg-secondary">
                        <p className="text-[14px] text-white">
                          {permission?.name}
                        </p>
                        <FontAwesomeIcon
                          className="text-secondary bg-white p-[2px] px-[3px] rounded-full text-[8px]"
                          icon={faPlus}
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(setListPermissionsModal(true));
                          }}
                        />
                      </menu>
                    }
                  />
                );
              })}
              <Button
                styled={false}
                className="!text-[13px] bg-secondary text-white rounded-md px-3 py-1 hover:bg-[#ff0000] transition-all duration-300 ease-in-out hover:shadow-md"
                value="Add more"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setListPermissionsModal(true));
                  dispatch(setCreateRoleModal(false));
                }}
              />
            </menu>
          </article>
        )}
        <menu className="flex items-center justify-between w-full gap-2">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setUpdateRoleModal(false));
            }}
          />
          <Button
            primary
            submit
            value={editRoleIsLoading ? <Loader /> : "Save"}
          />
        </menu>
      </form>
    </Modal>
  );
};

export default UpdateRole;
