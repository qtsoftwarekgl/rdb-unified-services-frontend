import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import Modal from "../../components/Modal";
import {
  setCreateRoleModal,
  setUpdateRoleModal,
  setRole,
  setRolesList,
} from "../../states/features/roleSlice";
import { Controller, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";
import { useEffect, useState } from "react";
import TextArea from "../../components/inputs/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setListPermissionsModal } from "../../states/features/permissionSlice";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { roles } from "../../constants/dashboard";
import Loader from "../../components/Loader";

const EditRole = () => {
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
  const { editRoleModal, role } = useSelector((state: RootState) => state.role);
  const { selectedPermissions } = useSelector(
    (state: RootState) => state.permission
  );
  const [isLoading, setIsLoading] = useState(false);

  // UPDATE DEFAULT VALUES
  useEffect(() => {
    setValue("name", role?.name);
    setValue("description", role?.description);
  }, [setValue, role]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: object) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setRolesList(
          roles?.map((r) =>
            r?.id === role?.id
              ? { ...role, name: data?.name, description: data?.description }
              : r
          )
        )
      );
      dispatch(
        setRole({ ...role, name: data?.name, description: data?.description })
      );
      dispatch(setListPermissionsModal([]));
      setIsLoading(false);
      dispatch(setUpdateRoleModal(false));
    }, 1000);
  };

  return (
    <Modal
      isOpen={editRoleModal}
      onClose={() => {
        dispatch(setUpdateRoleModal(false));
      }}
    >
      <h1 className="text-lg text-center uppercase text-secondary">
        Edit <span className="font-semibold text-primary">{role?.name}</span>{" "}
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
                  onChange={(e) => {
                    field.onChange(e);
                  }}
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
              {role?.name} permissions
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
          <Button primary submit value={isLoading ? <Loader /> : "Save"} />
        </menu>
      </form>
    </Modal>
  );
};

export default EditRole;
