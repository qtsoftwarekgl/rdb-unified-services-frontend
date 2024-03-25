import { faEye } from "@fortawesome/free-regular-svg-icons";
import ApplicatinsList from "../../components/registrations-list/ApplicationsList";
import AdminLayout from "../../containers/AdminLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { formatCompanyData } from "../../helpers/Strings";

const ReviewRegistration = () => {
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
    .filter((company) => company.status == "Submitted")
    .sort(sortBySubmissionDate);
  return (
    <AdminLayout>
      <ApplicatinsList
        title="Review Registration"
        data={companies}
        description=""
        actionIcon={faEye}
        notDataMessage="No registrations to review"
        handleClickAction={() => {}}
      />
    </AdminLayout>
  );
};

export default ReviewRegistration;
