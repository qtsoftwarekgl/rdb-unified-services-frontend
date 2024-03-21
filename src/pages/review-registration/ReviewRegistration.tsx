import { faEye } from "@fortawesome/free-regular-svg-icons";
import ApplicatinsList from "../../components/registrations-list/ApplicationsList";
import AdminLayout from "../../containers/AdminLayout";

const ReviewRegistration = () => {
  return (
    <AdminLayout>
      <ApplicatinsList
        title="Review Registration"
        description=""
        actionIcon={faEye}
        notDataMessage="No registrations to review"
      />
    </AdminLayout>
  );
};

export default ReviewRegistration;
