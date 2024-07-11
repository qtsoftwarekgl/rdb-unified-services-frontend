import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/Modal';
import {
  setCreateRoleModal,
  setSelectedRole,
  setTotalElements,
  setTotalPages,
  setUpdateRoleModal,
} from '../../states/features/roleSlice';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { useEffect } from 'react';
import TextArea from '../../components/inputs/TextArea';
import {
  setListPermissionsModal,
  setSelectedPermissions,
} from '../../states/features/permissionSlice';
import Loader from '../../components/Loader';
import {
  useEditRoleMutation,
  useLazyFetchPermissionsQuery,
} from '@/states/api/userManagementApiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { capitalizeString } from '@/helpers/strings';

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
  const { updateRoleModal, selectedRole } = useSelector(
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
      dispatch(setSelectedRole(undefined));
      window.location.reload();
    }
    if (editRoleIsError) {
      const errorResponse =
        (editRoleError as ErrorResponse)?.data?.message ||
        'An error occurred while updating role. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    editRoleError,
    editRoleIsError,
    editRoleIsSuccess,
    dispatch,
    editRoleData?.data,
  ]);

  // INITIALIZE FETCH PERMISSIONS QUERY
  const [
    fetchPermissions,
    {
      data: permissionsData,
      isFetching: permissionsIsFetching,
      error: permissionsError,
      isSuccess: permissionsIsSuccess,
      isError: permissionsIsError,
    },
  ] = useLazyFetchPermissionsQuery();

  // FETCH PERMISSIONS
  useEffect(() => {
    if (selectedRole && updateRoleModal) {
      fetchPermissions({ roleId: selectedRole?.id, page: 1, size: 1000 });
    }
  }, [fetchPermissions, selectedRole, updateRoleModal]);

  // HANDLE FETCH PERMISSIONS RESPONSE
  useEffect(() => {
    if (permissionsIsSuccess) {
      dispatch(setSelectedPermissions(permissionsData?.data?.data));
      dispatch(setTotalElements(permissionsData?.data?.totalElements));
      dispatch(setTotalPages(permissionsData?.data?.totalPages));
    } else if (permissionsIsError) {
      const errorResponse =
        (permissionsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching permissions. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    permissionsData,
    permissionsError,
    permissionsIsError,
    permissionsIsSuccess,
  ]);

  // UPDATE DEFAULT VALUES
  useEffect(() => {
    if (permissionsIsSuccess) {
      setValue('name', selectedRole?.roleName);
      setValue('description', selectedRole?.description);
      dispatch(setSelectedPermissions(permissionsData?.data?.data));
    }
  }, [setValue, selectedRole, dispatch, permissionsIsSuccess, permissionsData]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    editRole({
      id: selectedRole?.id,
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
      heading={`Update ${capitalizeString(selectedRole?.roleName)} role`}
    >
      {permissionsIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[30vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <Controller
            defaultValue={watch('name')}
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-2">
                  <Input
                    label="Name"
                    placeholder="Role name"
                    defaultValue={watch('name')}
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
            defaultValue={watch('description')}
            name="description"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-2">
                  <TextArea
                    label="Description"
                    resize
                    placeholder="Role description"
                    defaultValue={watch('description')}
                    {...field}
                  />
                </label>
              );
            }}
          />
          <article className="flex flex-col gap-2">
            <h3 className="text-center text-primary uppercase mt-4 font-medium">
              {capitalizeString(selectedRole?.roleName)} permissions
            </h3>
            <menu className="flex flex-col items-center justify-center gap-3">
              {selectedPermissions?.length > 0 && (
                <ul className="w-full flex items-center justify-center gap-2">
                  {selectedPermissions?.map((permission) => {
                    return (
                      <p
                        key={permission.id}
                        className="bg-gray-700 text-white rounded-md p-1 px-2 text-[13px]"
                      >
                        {permission.name}
                      </p>
                    );
                  })}
                </ul>
              )}
              <Button
                className="!py-1"
                value={
                  <menu className="flex items-center gap-2 text-[13px]">
                    Manage permissions
                  </menu>
                }
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setListPermissionsModal(true));
                  dispatch(setCreateRoleModal(false));
                }}
              />
            </menu>
          </article>
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
              value={editRoleIsLoading ? <Loader /> : 'Save'}
            />
          </menu>
        </form>
      )}
    </Modal>
  );
};

export default UpdateRole;
