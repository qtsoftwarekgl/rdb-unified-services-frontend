import { useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import { AppDispatch, RootState } from "../../states/store";
import RegisteredBusinessesTable from "./RegisteredBusinessesTable";
import NotificationPreference from "./NotificationPreference";
import Divider from "../../components/Divider";
import { useLazyGetUserQuery } from "@/states/api/userManagementApiSlice";
import { useEffect } from "react";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/states/features/userSlice";
import Loader from "@/components/Loader";
import { formatDate } from "@/helpers/strings";

const UserProfile = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user, userProfile } = useSelector((state: RootState) => state.user);

  // INITIALIZE GET USER QUERY
  const [
    getUser,
    {
      data: userData,
      error: userError,
      isFetching: userIsFetching,
      isSuccess: userIsSuccess,
      isError: userIsError,
    },
  ] = useLazyGetUserQuery();

  // GET USER
  useEffect(() => {
    getUser({ id: user?.id });
  }, [getUser, user?.id]);

  // HANDLE GET USER RESPONSE
  useEffect(() => {
    if (userIsSuccess) {
      dispatch(setUserProfile(userData?.data));
    } else if (userIsError) {
      const errorResponse =
        (userError as ErrorResponse)?.data?.message ||
        "An error occurred while fetching user data. Refresh and try again";
      toast.error(errorResponse);
    }
  }, [userIsSuccess, userData, userIsError, dispatch, userError]);

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f7f7f7] rounded-md">
        <h1 className="pb-2 text-2xl font-medium text-secondary w-fit">
          User Profile
        </h1>
        {/* User Info */}
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-secondary">
                {userProfile?.firstName} {userProfile?.lastName || ""}
              </h1>
              <p className="text-base font-light text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        {/* Personal Details */}
        <h1 className=" text-tertiary w-fit">Personal Details</h1>
        {userIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" size={"medium"} />
          </figure>
        ) : (
          userIsSuccess && (
            <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <h1 className="w-1/2 text-base font-semibold text-secondary ">
                    Document Type
                  </h1>
                  <p className="w-1/2 text-gray-300">
                    {userProfile?.personIdentType || ""}
                  </p>
                </div>
                <div className="flex ">
                  <h1 className="w-1/2 text-base font-semibold text-secondary">
                    Document Number
                  </h1>
                  <p className="w-1/2 text-gray-300">
                    {userProfile?.personDocNo || ""}
                  </p>
                </div>
                <div className="flex text-base font-semibold ">
                  <h1 className="w-1/2 text-secondary ">First Name</h1>
                  <p className="w-1/2 text-gray-300">
                    {userProfile?.firstName}
                  </p>
                </div>
                <div className="flex text-base font-semibold ">
                  <h1 className="w-1/2 text-secondary">Last Name</h1>
                  <p className="w-1/2 text-gray-300">{userProfile?.lastName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex text-base font-semibold">
                  <h1 className="w-1/2 text-secondary">Gender</h1>
                  <p className="w-1/2 text-gray-300">
                    {userProfile?.gender || ""}
                  </p>
                </div>
                <div className="flex text-base font-semibold ">
                  <h1 className="w-1/2 text-secondary">Date of birth</h1>
                  <p className="w-1/2 text-gray-300">
                    {formatDate(userProfile?.dateOfBirth)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex text-base font-semibold ">
                  <h1 className="w-1/2 text-secondary ">Nationality</h1>
                  <p className="w-1/2 text-gray-300">
                    {userProfile?.nationality || ""}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
        {/* User Registered businesses */}
        <RegisteredBusinessesTable />
        <NotificationPreference />
      </main>
    </UserLayout>
  );
};

export default UserProfile;
