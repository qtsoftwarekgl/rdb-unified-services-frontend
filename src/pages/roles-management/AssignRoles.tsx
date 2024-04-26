import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import Select from '@/components/inputs/Select';
import { users } from '@/constants/Users';
import { setAssignRolesModal } from '@/states/features/roleSlice';
import { setUsersList } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const AssignRoles = ({ user_id }: { user_id?: string }) => {
  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    trigger
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { assignRolesModal } = useSelector((state: RootState) => state.role);
  const { usersList } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(setUsersList(users?.slice(0, 10)));
  }, [dispatch]);

  return (
    <Modal
      isOpen={assignRolesModal}
      onClose={() => {
        dispatch(setAssignRolesModal(false));
      }}
    >
      <h1 className="text-primary font-semibold uppercase">Assign roles</h1>
      {!user_id && (
        <section className="w-full flex flex-col gap-4">
          <Controller
            control={control}
            name="user"
            render={({ field }) => {
              return (
                <label className="flex w-full flex-col gap-1">
                  <p className="text-[14px]">Select user to assign roles</p>
                  <Select
                    placeholder="Select user"
                    {...field}
                    options={usersList?.map(
                      (user: {
                        id: string;
                        first_name: string;
                        last_name: string;
                      }) => {
                        return {
                          value: user?.id,
                          label: `${user?.first_name} ${user?.last_name}`,
                        };
                      }
                    )}
                    onChange={async (value) => {
                      field.onChange(value);
                      await trigger('user');
                    }}
                  />
                  {errors?.user && (
                    <p className="text-red-600 text-[14px]">
                      {String(errors?.user?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu className="w-full flex items-center gap-3 justify-between">
            <Button
              value="Cancel"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setAssignRolesModal(false));
              }}
            />
            <Button value={'Continue'} primary />
          </menu>
        </section>
      )}
    </Modal>
  );
};

export default AssignRoles;
