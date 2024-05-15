import ApplicatinsList from "../../../components/registrations-list/ApplicationsList";
import UserLayout from "../../../containers/UserLayout";
import { capitalizeString, formatCompanyData } from "../../../helpers/strings";
import { useSelector } from "react-redux";
import { RootState } from "../../../states/store";

const AmendCompanyDetails = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  const sortBySubmissionDate = (a, b) => {
    return (
      new Date(b?.submission_date).getTime() -
      new Date(a?.submission_date).getTime()
    );
  };

  const companies = user_applications
    .map(formatCompanyData)
    .filter((company) => capitalizeString(company.status) !== "Approved")
    .sort((a, b) => sortBySubmissionDate(a, b));

  return (
    <UserLayout>
      <ApplicatinsList
        data={companies}
        title="Amend Company Details"
        description="Choose a company to amend its details"
        notDataMessage="No companies for amendment"
      />
    </UserLayout>
  );
};

export default AmendCompanyDetails;
