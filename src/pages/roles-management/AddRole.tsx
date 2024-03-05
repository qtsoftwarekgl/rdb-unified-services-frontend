import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import { setAddRoleModal } from '../../states/features/roleSlice';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import TextArea from '../../components/inputs/TextArea';
import SelectPermissions from './SelectPermissions';
import { setAddPermissionModal } from '../../states/features/permissionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddRole = () => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addRoleModal } = useSelector((state: RootState) => state.role);
  const { selectedPermissions } = useSelector(
    (state: RootState) => state.permission
  );

  // HANDLE FORM SUBMIT
  const onSubmit = (data: object) => {
    console.log({
      ...data,
      permissions: selectedPermissions,
    });
  };

  return (
    <Modal
      isOpen={addRoleModal}
      onClose={() => {
        dispatch(setAddRoleModal(false));
      }}
    >
      <h1 className="text-primary text-lg font-semibold uppercase text-center">
        Add Role
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-[60%] mx-auto"
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
                    {errors?.name?.message}
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
        {selectedPermissions?.length <= 0 ? (
          <Button
            primary
            className="flex items-center justify-center"
            value={
              <menu className="flex items-center gap-2">
                Select permissions <FontAwesomeIcon icon={faPlus} />
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddPermissionModal(true));
            }}
          />
        ) : (
          <article className="flex flex-col gap-2">
            <h3 className="text-primary text-center">Selected permissions</h3>
            <menu className="flex items-center gap-3 flex-wrap justify-center">
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
                            dispatch(setAddPermissionModal(true));
                            dispatch(setAddRoleModal(false));
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
                  dispatch(setAddPermissionModal(true));
                  dispatch(setAddRoleModal(false));
                }}
              />
            </menu>
          </article>
        )}
        <menu className="flex items-center gap-3 justify-between">
          <Button value="Cancel" onClick={(e) => {
            e.preventDefault();
            dispatch(setAddRoleModal(false));
          }} />
          <Button value="Submit" submit primary />
        </menu>
      </form>
      <SelectPermissions />
    </Modal>
  );
};

export default AddRole;
