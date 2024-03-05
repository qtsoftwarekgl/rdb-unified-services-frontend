import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/inputs/Button";
import SuperAdminLayout from "../../containers/SuperAdminLayout";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../states/store";
import { useSelector } from "react-redux";
import NotificationPreference from "./NotificationPreference";

const Profile = () => {
  const registeredCompanies = ["YXZ LTD", "ZTD LTD", "STORE BUS"];
  const roles = ["Verifier", "Admin", "Super Admin"];
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <SuperAdminLayout>
      <main className="flex flex-col w-full gap-6 p-6 bg-white rounded-md">
        <h1 className="text-lg font-bold border-b text-secondary w-fit">
          User Profile
        </h1>

        {/* User Info */}
        <div className="flex justify-between">
          <div className="flex">
            <figure className="overflow-hidden inline w-[7rem] h-[7rem] relative rounded-full mr-4">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="object-cover w-full h-full"
              />
            </figure>

            <div className="flex flex-col justify-center">
              <h1 className="text-[16px] text-secondary font-semibold">
                Christella
              </h1>
              <p className="text-[12px] text-gray-500">Verifier</p>
              <p className="text-[12px] text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="justify-between w-1/2">
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
        <div className="h-[1px] bg-gray-300 "></div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4 p-4 ">
            <h1 className="text-lg font-bold text-secondary w-fit">
              Personal Details
            </h1>
            <div className="flex w-2/3 ">
              <h1 className="w-1/2 text-secondary ">First Name</h1>
              <p className="w-1/2 text-gray-300">Christella</p>
            </div>
            <div className="flex w-2/3 ">
              <h1 className="w-1/2 text-secondary">Last Name</h1>
              <p className="w-1/2 text-gray-300">Christella</p>
            </div>
            <div className="flex w-2/3">
              <h1 className="w-1/2 text-secondary">Location</h1>
              <p className="w-1/2 italic text-gray-300">Nyarutarama</p>
            </div>
            <div className="flex w-2/3 ">
              <h1 className="w-1/2 text-secondary">Email</h1>
              <p className="w-1/2 text-gray-300">Christella</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-12">
              <h1 className="text-lg font-bold text-secondary w-fit">Role</h1>
              <FontAwesomeIcon
                className="cursor-pointer text-secondary"
                icon={faEdit}
              />
            </div>
            {roles.map((role, index) => {
              return (
                <div className="flex w-2/3 gap-2 mr-4" key={index}>
                  <p className="text-gray-300">{role}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-12">
              <h1 className="flex-1 text-lg font-bold text-secondary w-fit">
                Your Registered Companies
              </h1>
              <FontAwesomeIcon
                className="cursor-pointer text-secondary"
                icon={faEdit}
              />
            </div>
            {registeredCompanies.map((company, index) => {
              return (
                <div className="flex w-2/3 gap-2 mr-4" key={index}>
                  <p className="italic text-gray-300">{company}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-[1px] bg-gray-300 "></div>

        {/* Notification Preferences */}
        <NotificationPreference />
      </main>
    </SuperAdminLayout>
  );
};

export default Profile;
