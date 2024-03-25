import { faEdit } from "@fortawesome/free-regular-svg-icons";

import ApplicatinsList from "../../components/registrations-list/ApplicationsList";
import UserLayout from "../../containers/UserLayout";
import { setIsAmending } from "../../states/features/amendmentSlice";
import { formatCompanyData } from "../../helpers/Strings";
import { useSelector } from "react-redux";
import { RootState } from "../../states/store";

const AmendCompanyDetails = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  const sortBySubmissionDate = (a, b) => {
    return (
      new Date(b?.submissionDate).getTime() -
      new Date(a?.submissionDate).getTime()
    );
  };

  const companies = user_applications
    .map(formatCompanyData)
    .filter(
      (company) =>
        !(company.status == "In Progress" || company.status === "In Review")
    )
    .sort(sortBySubmissionDate);

  const handleClickAction = () => {
    setIsAmending(true);
  };
  return (
    <UserLayout>
      <ApplicatinsList
        data={companies}
        title="Amend Company Details"
        description="Choose a company to amend its details"
        actionIcon={faEdit}
        notDataMessage="No companies for amendment"
        handleClickAction={handleClickAction}
      />
    </UserLayout>
  );
};

export default AmendCompanyDetails;
