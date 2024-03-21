import { faEdit } from "@fortawesome/free-regular-svg-icons";

import ApplicatinsList from "../../components/registrations-list/ApplicationsList";
import UserLayout from "../../containers/UserLayout";

const AmendCompanyDetails = () => {
  return (
    <UserLayout>
      <ApplicatinsList
        title="Amend Company Details"
        description="You can amend your company details by clicking on the edit icon below."
        actionIcon={faEdit}
        notDataMessage="No applications yet"
      />
    </UserLayout>
  );
};

export default AmendCompanyDetails;
