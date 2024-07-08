import { useSelector } from "react-redux";
import Divider from "../../components/Divider";
import NotificationPreference from "./NotificationPreference";
import UpdatePassword from "./UpdatePassowrd";
import { RootState } from "../../states/store";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f7f7f7] rounded-md">
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
              {user?.first_name || "Nishimwe"}
            </h1>
            <p className="text-lg font-light text-gray-500">
              {user?.role || user?.email?.includes("verifier")
                ? "Verifier"
                : user?.email?.includes("approver")
                ? "Approver"
                : "Admin"}
            </p>
            <p className="text-base font-light text-gray-500">{user?.email}</p>
          </div>
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
          </div>
          <p className="text-gray-300 ">Admin</p>
          <p className="text-gray-300 ">Verifier</p>
          <p className="text-gray-300 ">Approver</p>
        </div>
      </div>
      <UpdatePassword />
      <NotificationPreference />
    </main>
  );
};

export default Profile;
