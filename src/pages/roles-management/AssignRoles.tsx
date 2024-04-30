import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { users } from '@/constants/Users';
import { roles } from '@/constants/dashboard';
import { setAssignRolesModal } from '@/states/features/roleSlice';
import { setUsersList } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const AssignRoles = ({ user_id }: { user_id?: string }) => {
  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { assignRolesModal } = useSelector((state: RootState) => state.role);
  const { usersList } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setUsersList(users?.slice(0, 10)));
  }, [dispatch]);

  useEffect(() => {
    setValue('user', user_id);
  }, [setValue, user_id]);

  return (
    <Modal
      isOpen={assignRolesModal}
      onClose={() => {
        dispatch(setAssignRolesModal(false));
      }}
    >
      <h1 className="text-primary font-semibold uppercase">Assign roles</h1>
      <section className="w-full flex flex-col gap-4">
        {!user_id && (
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
        )}
        <AssignRolesModal user_id={watch('user')} />
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAssignRolesModal(false));
            }}
          />
          <Button
            value={isLoading ? <Loader /> : 'Complete'}
            primary
            onClick={(e) => {
              e.preventDefault();
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                dispatch(setAssignRolesModal(false));
              }, 1000);
            }}
          />
        </menu>
      </section>
    </Modal>
  );
};

export const AssignRolesModal = ({ user_id }: { user_id: string }) => {
  if (!user_id) return null;

  return (
    <section className="flex flex-col gap-4">
      <menu className="flex flex-col gap-3">
        {roles?.slice(0, 5).map((role) => {
          return (
            <label key={role?.id} className="flex items-center gap-2">
              <Input type="checkbox" />
              <p>{role?.name}</p>
            </label>
          );
        })}
      </menu>
    </section>
  );
};

export default AssignRoles;
