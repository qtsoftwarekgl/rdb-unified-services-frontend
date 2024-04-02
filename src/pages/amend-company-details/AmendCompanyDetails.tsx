import { faEdit } from "@fortawesome/free-regular-svg-icons";

import ApplicatinsList from "../../components/registrations-list/ApplicationsList";
import UserLayout from "../../containers/UserLayout";
import { setIsAmending } from "../../states/features/amendmentSlice";
import { capitalizeString, formatCompanyData } from "../../helpers/strings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";

const AmendCompanyDetails = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const dispatch = useDispatch();

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
        !(
          // capitalizeString(company.status) === "In Progress" ||
          (capitalizeString(company.status) === "In Review")
        )
    )
    .sort(sortBySubmissionDate);

  console.log(user_applications);

  const handleClickAction = () => {
    dispatch(setIsAmending(true));
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
