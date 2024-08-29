import UserLayout from "@/containers/UserLayout";
import { getchBusinessThunk } from "@/states/features/businessSlice";
import { AppDispatch, RootState } from "@/states/store";
import { UUID } from "crypto";
import { Loader } from "lucide-react";
import queryString, { ParsedQuery } from "query-string";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ForeignCompanyPreviewSubmission from "../business-applications/foreign-company-registration/preview-submission/ForeignCompanyPreviewSubmission";
import PreviewSubmission from "../business-applications/domestic-business-registration/preview-submission/BusinessPreviewSubmission";
import EnterprisePreviewSubmission from "../business-applications/enterprise-registration/EnterprisePreviewSubmission";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

const UserApplicationDetails = () => {
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const {
    business,
    getBusinessIsFetching,
    getBusinessIsError,
    getBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // NAVIGATION
  const { search } = useLocation();
  const dispatch: AppDispatch = useDispatch();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // GET BUSINESS THUNK
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(getchBusinessThunk(queryParams.businessId as UUID));
    }
  }, [dispatch, queryParams.businessId]);

  const navigate = useNavigate();

  return (
    <UserLayout>
      <div>
        <div className="flex flex-col gap-6 px-14">
          <h1 className="text-2xl font-bold">Application Details</h1>
          <div className="flex flex-col gap-6">
            {getBusinessIsFetching && <Loader />}
            {getBusinessIsError && (
              <p className="text-red-500">
                Error fetching business details. Please try again.
              </p>
            )}
            {getBusinessIsSuccess &&
              business.serviceId?.name.includes("Foreign") && (
                <ForeignCompanyPreviewSubmission
                  noActions
                  businessId={business?.id}
                  applicationStatus={business?.applicationStatus}
                />
              )}

            {getBusinessIsSuccess &&
              business.serviceId?.name.includes("Domestic") && (
                <PreviewSubmission
                  noActions
                  businessId={business?.id}
                  applicationStatus={business?.applicationStatus}
                />
              )}
            {getBusinessIsSuccess &&
              business.serviceId?.name.includes("Enterprise") && (
                <EnterprisePreviewSubmission
                  noActions
                  businessId={business?.id}
                  applicationStatus={business?.applicationStatus}
                />
              )}
            <menu className="flex w-28">
              <Link
                className=" w-full flex items-center gap-4 text-[16px] text-center p-1 px-2 rounded-md bg-primary text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/user/business/applications`);
                }}
                to={"#"}
              >
                <FontAwesomeIcon className="text-white" icon={faBackward} />
                Back
              </Link>
            </menu>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserApplicationDetails;
