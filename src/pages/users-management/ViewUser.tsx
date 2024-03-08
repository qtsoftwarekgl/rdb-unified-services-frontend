import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "../../components/Divider";
import Modal from "../../components/Modal";
import Button from "../../components/inputs/Button";
import { Dispatch, SetStateAction } from "react";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

interface ViewUserProps {
  user: unknown;
  setUserToView: Dispatch<SetStateAction<null>>;
}

const ViewUser = ({ user, setUserToView }: ViewUserProps) => {
  return (
    <Modal
      isOpen={!!user}
      onClose={() => {
        setUserToView(null);
      }}
      className="!min-w-[70%] !max-w-[1400px]"
    >
      <main className="flex flex-col w-full gap-6 px-12 py-16 bg-white rounded-md">
        <h1 className="pb-2 text-2xl font-medium border-b text-secondary w-fit">
          User Profile
        </h1>
        {/* User Info */}
        <div className="flex flex-col justify-between md:flex-row">
          <div className="flex">
            <figure className="overflow-hidden inline w-[7rem] h-[7rem] relative rounded-full mr-4">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="object-cover w-full h-full"
              />
            </figure>

            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-secondary">
                {user?.first_name}
              </h1>
              <p className="text-lg font-light text-gray-500">{user?.role}</p>
              <p className="text-base font-light text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="justify-between md:w-1/2">
            <menu className="flex items-center gap-12 mt-12">
              <Button
                value="Disable User"
                className=" bg-red-600 bg-opacity-[0.07] text-black border border-red-600 hover:!bg-red-700 shadow-none"
              />
              <Button
                submit
                primary
                value="Delete User"
                className="text-white !bg-red-600 hover:!bg-red-700"
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
              <p className="text-gray-300 ">{user.first_name}</p>
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
              <p className="italic text-gray-300 ">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="flex items-center text-base font-semibold">
              <h1 className="mr-20 text-secondary">Role</h1>
              <menu className="cursor-pointer">
                <FontAwesomeIcon icon={faEdit} className="text-primary" />
              </menu>
            </div>
            <p className="text-gray-300 ">Admin</p>
            <p className="text-gray-300 ">Verifier</p>
            <p className="text-gray-300 ">Approver</p>
          </div>
        </div>
      </main>
    </Modal>
  );
};

export default ViewUser;
