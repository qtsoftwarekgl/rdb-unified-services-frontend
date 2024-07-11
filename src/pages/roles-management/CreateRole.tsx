import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import { setCreateRoleModal, addRole } from '../../states/features/roleSlice';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import TextArea from '../../components/inputs/TextArea';
import ListPermissions from './ListPermissions';
import { setListPermissionsModal } from '../../states/features/permissionSlice';
import Loader from '../../components/Loader';
import { useCreateRoleMutation } from '@/states/api/userManagementApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'react-router-dom';
import { Role } from '@/types/models/role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
  const { selectedPermissions } = useSelector(
    (state: RootState) => state.permission
  );

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
      toast.success('Role created successfully');
    }
    if (createRoleIsError) {
      const errorResponse =
        (createRoleError as ErrorResponse)?.data?.message ||
        'An error occurred while creating role. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    createRoleData?.data,
    createRoleError,
    createRoleIsError,
    createRoleIsSuccess,
    dispatch,
  ]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createRole({
      roleName: data.name,
      description: data.description,
      permissions: selectedPermissions?.map((permission) => permission.id),
    });
  };

  return (
    <Modal
      isOpen={createRoleModal}
      onClose={() => {
        dispatch(setCreateRoleModal(false));
      }}
      heading="Create role"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
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
          <h3 className="text-center text-primary uppercase mt-4 font-medium">
            Selected permissions
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
                  <FontAwesomeIcon icon={faPlus} />

                  {selectedPermissions?.length > 0
                    ? 'Add more'
                    : 'Add permissions'}
                </menu>
              }
              onClick={(e) => {
                e.preventDefault();
                dispatch(setListPermissionsModal(true));
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
            value={createRoleIsLoading ? <Loader /> : 'Submit'}
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
