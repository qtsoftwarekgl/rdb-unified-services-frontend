import { useEffect, useState } from "react";
import queryString, { ParsedQuery } from "query-string";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../../containers/UserLayout";
import ProgressNavigation from "../../../components/business-registration/ProgressNavigation";
import { ErrorResponse, useLocation } from "react-router-dom";
import Tab from "../../../components/business-registration/Tab";
import {
  RegistrationTab,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../../states/features/foreignCompanyRegistrationSlice";
import CompanyDetails from "./general-information/CompanyDetails";
import CompanyAddress from "./general-information/CompanyAddress";
import BusinessActivity from "./general-information/BusinessActivity";
import BoardDirectors from "./management/BoardDirectors";
import ExecutiveManagement from "./management/ExecutiveManagement";
import EmploymentInfo from "./management/EmploymentInfo";
import BeneficialOwners from "./beneficial-owners/BeneficialOwners";
import CompanyAttachments from "./attachments/CompanyAttachments";
import PreviewSubmission from "./preview-submission/BusinessPreviewSubmission";
import { AppDispatch, RootState } from "../../../states/store";
import UserReviewTabComments from "../../../components/applications-review/UserReviewTabComments";
import { useLazyGetBusinessQuery } from "@/states/api/businessRegApiSlice";
import { toast } from "react-toastify";
import { setBusiness } from "@/states/features/businessSlice";
import { Loader } from "lucide-react";

const ForeignBranchRegistration = () => {
  const {
    foreign_business_registration_tabs,
    foreign_business_active_step,
    foreign_business_active_tab,
  } = useSelector((state: RootState) => state.foreignCompanyRegistration);
  const dispatch: AppDispatch = useDispatch();
  const { business } = useSelector((state: RootState) => state.business);

  const { search } = useLocation();
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusiness,
    {
      data: businessData,
      error: businessError,
      isLoading: businessIsLoading,
      isError: businessIsError,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessQuery();

  // GET BUSINESS
  useEffect(() => {
    if (queryParams?.businessId) {
      getBusiness({ id: queryParams?.businessId });
    }
  }, [getBusiness, queryParams?.businessId]);

  // HANDLE GET BUSINESS RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching business data");
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess) {
      dispatch(setBusiness(businessData?.data));
    }
  }, [
    businessData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
  ]);

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8">
        <ProgressNavigation
          tabs={foreign_business_registration_tabs}
          setActiveTab={setForeignBusinessActiveTab}
        />
        <menu className="flex items-center w-full gap-5">
          {foreign_business_registration_tabs?.map(
            (tab: RegistrationTab, index: number) => {
              const isActiveTab = tab?.active;
              const activeStepName = foreign_business_active_step?.name;

              return (
                <Tab
                  isOpen={isActiveTab}
                  steps={tab?.steps}
                  key={`${String(index)}-${queryParams.businessId}`}
                  setActiveStep={setForeignBusinessActiveStep}
                  active_tab={foreign_business_active_tab}
                >
                  {isActiveTab && (
                    <>
                      {businessIsLoading ? (
                        <figure className="h-[40vh] flex items-center justify-center">
                          <Loader />
                        </figure>
                      ) : (
                        <>
                          {activeStepName === "company_details" && (
                            <CompanyDetails
                              businessId={queryParams?.businessId}
                            />
                          )}
                          {activeStepName === "company_address" && (
                            <CompanyAddress
                              businessId={queryParams?.businessId}
                              applicationStatus={business?.applicationStatus}
                            />
                          )}
                          {activeStepName === "business_activity_vat" && (
                            <BusinessActivity
                              businessId={queryParams?.businessId}
                              applicationStatus={business?.applicationStatus}
                            />
                          )}
                          {activeStepName === "board_of_directors" && (
                            <BoardDirectors
                              businessId={queryParams?.businessId}
                              applicationStatus={business?.applicationStatus}
                            />
                          )}
                          {activeStepName === "executive_management" && (
                            <ExecutiveManagement
                              businessId={queryParams?.businessId}
                              applicationStatus={business.applicationStatus}
                            />
                          )}
                          {activeStepName === "employment_info" && (
                            <EmploymentInfo
                              businessId={queryParams?.businessId}
                              applicationStatus={business.applicationStatus}
                            />
                          )}
                          {/* {activeStepName === "foreign_beneficial_owners" && (
                            <BeneficialOwners
                              businessId={queryParams?.businessId}
                            />
                          )} */}
                          {activeStepName === "foreign_attachments" && (
                            <CompanyAttachments
                              businessId={queryParams?.businessId}
                            />
                          )}
                          {activeStepName === "preview_submission" && (
                            <PreviewSubmission
                              businessId={queryParams?.businessId}
                              applicationStatus={business.applicationStatus}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Tab>
              );
            }
          )}
        </menu>
        <UserReviewTabComments active_tab={foreign_business_active_tab} />
        {/* TODO: Add ReviewComments */}
        {/* {RDBAdminEmailPattern.test(user?.email) && (
          <>
            <ReviewNavigation
              businessId={queryParams?.businessId}
              setActiveStep={setForeignBusinessActiveStep}
              setActiveTab={setForeignBusinessActiveTab}
              tabs={foreign_business_registration_tabs}
              activeStep={foreign_business_active_step}
              first_step="company_details"
              last_step="preview_submission"
              redirectUrl="/admin/review-applications"
              setApplication={setUserApplications}
            />
            <AddReviewComments
              businessId={queryParams?.businessId}
              activeStep={foreign_business_active_step}
              activeTab={foreign_business_active_tab}
            />
            <ListReviewComments
              businessId={queryParams?.businessId}
              setActiveStep={setForeignBusinessActiveStep}
              setActiveTab={setForeignBusinessActiveTab}
              title="Branch of Foreign Company Registration Review Comments"
            />
          </>
        )} */}
      </main>
    </UserLayout>
  );
};

export default ForeignBranchRegistration;
