import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/Modal";
import { AppDispatch, RootState } from "../../states/store";
import { setCreateRoleModal, addRole } from "../../states/features/roleSlice";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";
import TextArea from "../../components/inputs/TextArea";
import ListPermissions from "./ListPermissions";
import { setListPermissionsModal } from "../../states/features/permissionSlice";
import Loader from "../../components/Loader";
import { useCreateRoleMutation } from "@/states/api/userManagementApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ErrorResponse } from "react-router-dom";
import { Role } from "@/types/models/role";

const CreateRole = () => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createRoleModal } = useSelector((state: RootState) => state.role);

  const [
    createRole,
    {
      data: createRoleData,
      isLoading: createRoleIsLoading,
      isSuccess: createRoleIsSuccess,
      isError: createRoleIsError,
      error: createRoleError,
    },
  ] = useCreateRoleMutation();

  useEffect(() => {
    if (createRoleIsSuccess) {
      dispatch(setCreateRoleModal(false));
      dispatch(addRole(createRoleData?.data as Role));
      toast.success("Role created successfully");
    }
    if (createRoleIsError) {
      const errorResponse =
        (createRoleError as ErrorResponse)?.data?.message ||
        "An error occurred while creating role. Refresh and try again";
      toast.error(errorResponse);
    }
  }, [createRoleError, createRoleIsError, createRoleIsSuccess, dispatch]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createRole({
      roleName: data.name,
      description: data.description,
      // To DO: Add permissions
      permissions: [],
    });
  };

  return (
    <Modal
      isOpen={createRoleModal}
      onClose={() => {
        dispatch(setCreateRoleModal(false));
      }}
    >
      <h1 className="text-lg font-semibold text-center uppercase text-primary">
        Add Role
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-[60%] mx-auto"
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => {
            return (
              <label className="flex flex-col items-start gap-1">
                <Input label="Name" {...field} />
                {errors.name && (
                  <p className="text-red-600 text-[13px]">
                    {String(errors?.name?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col items-start gap-1">
                <TextArea resize label="Description" {...field} />
              </label>
            );
          }}
        />

        <article className="flex flex-col gap-2">
          <h3 className="text-center text-primary">Selected permissions</h3>
          <menu className="flex flex-wrap items-center justify-center gap-3">
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
        <menu className="flex items-center justify-between gap-3">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateRoleModal(false));
            }}
          />
          <Button
            value={createRoleIsLoading ? <Loader /> : "Submit"}
            submit
            primary
          />
        </menu>
      </form>
      <ListPermissions />
    </Modal>
  );
};

export default CreateRole;
