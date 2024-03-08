import { useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import { RootState } from "../../states/store";
import RegisteredBusinessesTable from "./RegisteredBusinessesTable";
import NotificationPreference from "./NotificationPreference";
import UpdatePassword from "./UpdatePassowrd";
import Divider from "../../components/Divider";

const UserProfile = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f7f7f7] rounded-md">
        <h1 className="pb-2 text-2xl font-medium border-b text-secondary w-fit">
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
              <h1 className="text-xl font-semibold text-secondary">
                Sandra Isheja
              </h1>
              <p className="text-lg font-light text-gray-500">Verifier</p>
              <p className="text-base font-light text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        <Divider />
        {/* Personal Details */}
        <h1 className=" text-tertiary w-fit">Personal Details</h1>
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <h1 className="w-1/2 text-base font-semibold text-secondary ">
                Document Type
              </h1>
              <p className="w-1/2 text-gray-300">NID</p>
            </div>
            <div className="flex ">
              <h1 className="w-1/2 text-base font-semibold text-secondary">
                Document Number
              </h1>
              <p className="w-1/2 text-gray-300">11918191819181818</p>
            </div>
            <div className="flex ">
              <h1 className="w-1/2 text-base font-semibold text-secondary">
                Address
              </h1>
              <p className="w-1/2 italic text-gray-300">Nyarutarama</p>
            </div>
            <div className="flex ">
              <h1 className="w-1/2 text-base font-semibold text-secondary">
                Location
              </h1>
              <p className="w-1/2 italic text-gray-300">Nyarutarama</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">First Name</h1>
              <p className="w-1/2 text-gray-300">Christella</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary">Last Name</h1>
              <p className="w-1/2 text-gray-300">Christella</p>
            </div>
            <div className="flex text-base font-semibold">
              <h1 className="w-1/2 text-secondary">Gender</h1>
              <p className="w-1/2 text-gray-300">Nyarutarama</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary">Female</h1>
              <p className="w-1/2 text-gray-300">20-06-1992</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">Country</h1>
              <p className="w-1/2 text-gray-300">Rwanda</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">Province</h1>
              <p className="w-1/2 text-gray-300">Kigali</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary">District</h1>
              <p className="w-1/2 text-gray-300">Gasabo</p>
            </div>
            <div className="flex text-base font-semibold">
              <h1 className="w-1/2 text-secondary">Sector</h1>
              <p className="w-1/2 italic text-gray-300">Nyarutarama</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary">Cell</h1>
              <p className="w-1/2 text-gray-300">Nyarutarama</p>
            </div>
          </div>
        </div>
        {/* User Registered businesses */}
        <RegisteredBusinessesTable />
        <UpdatePassword />
        <NotificationPreference />
      </main>
    </UserLayout>
  );
};

export default UserProfile;
