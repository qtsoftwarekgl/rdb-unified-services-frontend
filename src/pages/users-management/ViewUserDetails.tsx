import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '../../components/Divider';
import Modal from '../../components/Modal';
import Button from '../../components/inputs/Button';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { setAssignRolesModal } from '@/states/features/roleSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import {
  setSelectedUser,
  setViewUserDetailsModal,
} from '@/states/features/userSlice';
import { capitalizeString } from '@/helpers/strings';
import AssignRoles from '../roles-management/AssignRoles';

const ViewUser = () => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { selectedUser, viewUserDetailsModal } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <>
      <Modal
        isOpen={viewUserDetailsModal}
        onClose={() => {
          dispatch(setViewUserDetailsModal(false));
          dispatch(setSelectedUser(undefined));
        }}
        heading={`${selectedUser?.firstName}'s Information`}
      >
        <main className="flex flex-col w-full gap-6 p-5 bg-white rounded-md">
          {/* User Info */}
          <div className="flex flex-col justify-between md:flex-row">
            <div className="flex">
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-semibold text-secondary">
                  {selectedUser?.firstName}
                </h1>
                <p className="text-base font-light text-gray-500">
                  {selectedUser?.email}
                </p>
              </div>
            </div>
            <div className="justify-between md:w-1/2">
              <menu className="flex items-center gap-12 mt-12">
                <Button
                  value="Disable User"
                  className=" bg-red-600 bg-opacity-[0.07] text-red-600 border border-red-600 hover:!bg-red-700 shadow-none"
                />
                <Button
                  submit
                  value="Delete User"
                  className="text-white !bg-red-600 hover:!bg-red-700 !border-red-600"
                />
              </menu>
            </div>
          </div>
          <Divider />
          {/* Personal Details */}
          <div className="flex flex-col gap-12 mb-8 md:flex-row">
            <div className="flex flex-col flex-1 max-w-lg gap-4">
              <div className="flex items-center">
                <h1 className="text-base font-semibold text-secondary ">
                  Personal Details
                </h1>
              </div>
              <div className="flex gap-8">
                <h1 className="w-32 text-base font-semibold text-secondary">
                  First Name
                </h1>
                <p className="text-gray-300 ">{selectedUser?.firstName}</p>
              </div>
              <div className="flex gap-8">
                <h1 className="w-32 text-base font-semibold text-secondary">
                  Last Name
                </h1>
                <p className="italic text-gray-300 ">Iriza</p>
              </div>
              <div className="flex gap-8">
                <h1 className="w-32 text-base font-semibold text-secondary">
                  Location
                </h1>
                <p className="italic text-gray-300 ">Nyarutarama</p>
              </div>
              <div className="flex gap-8">
                <h1 className="w-32 text-base font-semibold text-secondary">
                  Email
                </h1>
                <p className="italic text-gray-300 ">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              <div className="flex items-center text-base font-semibold">
                <h1 className="mr-20 text-secondary">Role</h1>
                <menu className="cursor-pointer">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setAssignRolesModal(true));
                    }}
                  />
                </menu>
              </div>
              <menu className="flex flex-col gap-2">
                {selectedUser?.roles?.map((role) => {
                  return (
                    <div key={role.id} className="flex items-center gap-4">
                      <p className="text-gray-300">
                        {capitalizeString(role.roleName)}
                      </p>
                    </div>
                  );
                })}
              </menu>
            </div>
          </div>
        </main>
      </Modal>
      <AssignRoles />
    </>
  );
};

export default ViewUser;
