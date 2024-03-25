import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/Modal';
import {
  setDeleteRoleModal,
  setRolesList,
} from '../../states/features/roleSlice';
import Button from '../../components/inputs/Button';
import { useState } from 'react';
import Loader from '../../components/Loader';

const DeleteRole = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteRoleModal, role, rolesList } = useSelector(
    (state: RootState) => state.role
  );
  const [isLoading, setIsLoading] = useState({
    status: false,
    activity: 'delete',
  });

  return (
    <Modal
      isOpen={deleteRoleModal}
      onClose={() => {
        dispatch(setDeleteRoleModal(false));
      }}
    >
      <h1 className="text-lg text-red-600 uppercase font-semibold text-center">
        Delete {role?.name}
      </h1>
      <section className="flex flex-col gap-4 w-full">
        <p className="text-[14px] text-center">
          All users assuming this role will be stripped of it, and won't be able
          to perform the activities that requires this role's authorization.
        </p>
        <menu className="flex flex-col gap-3">
          <p className="text-[14px] text-center">
            You can also deactivate a role to disable it until you activate it
            again. All users assuming this role will be affected.
          </p>
          <Button
            value={
              isLoading?.status && isLoading?.activity === 'deactivate' ? (
                <Loader />
              ) : (
                `Disable ${role?.name}`
              )
            }
            primary
            className="!w-fit mx-auto"
            onClick={(e) => {
              e.preventDefault();
              setIsLoading({
                status: true,
                activity: 'deactivate',
              });
              setTimeout(() => {
                dispatch(
                  setRolesList(
                    rolesList?.map((r) => {
                      if (r?.id === role?.id) {
                        return {
                          ...r,
                          status: 'inactive',
                        };
                      }
                      return r;
                    })
                  )
                );
                setIsLoading({
                  status: false,
                  activity: 'delete',
                });
                dispatch(setDeleteRoleModal(false));
              }, 1000);
            }}
          />
        </menu>
      </section>
      <section className="flex flex-col gap-4 items-center w-full my-3">
        <h3 className="text-[16px] uppercase font-medium">
          Delete role instead?
        </h3>
        <menu className="flex items-center gap-5 ">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteRoleModal(false));
            }}
          />
          <Button
            value={
              isLoading?.status && isLoading?.activity === 'delete' ? (
                <Loader color="red-600" />
              ) : (
                'Delete'
              )
            }
            primary
            danger
            onClick={(e) => {
              e.preventDefault();
              setIsLoading({
                status: true,
                activity: 'delete',
              });
              setTimeout(() => {
                dispatch(
                  setRolesList(rolesList?.filter((r) => r?.id !== role?.id))
                );
                setIsLoading({
                  status: false,
                  activity: '',
                });
                dispatch(setDeleteRoleModal(false));
              }, 1000);
            }}
          />
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteRole;
