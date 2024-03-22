import { faEdit } from "@fortawesome/free-regular-svg-icons";

import ApplicatinsList from "../../components/registrations-list/ApplicationsList";
import UserLayout from "../../containers/UserLayout";
import { setIsAmending } from "../../states/features/amendmentSlice";

const AmendCompanyDetails = () => {
  const handleClickAction = () => {
    setIsAmending(true);
  };
  return (
    <UserLayout>
      <ApplicatinsList
        title="Amend Company Details"
        description="You can amend your company details by clicking on the edit icon below."
        actionIcon={faEdit}
        notDataMessage="No applications yet"
        handleClickAction={handleClickAction}
      />
    </UserLayout>
  );
};

export default AmendCompanyDetails;
