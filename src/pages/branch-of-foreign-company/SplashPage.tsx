import { useEffect } from "react";
import { generateUUID } from "../../helpers/strings";
import { NewRegistration } from "../business-registration/NewBusinessRegistration";
import { setForeignCompanyDetails } from "../../states/features/foreignBranchRegistrationSlice";

const ForeignBranchSplashPage = () => {
  useEffect(() => {}, []);

  return (
    <NewRegistration
      description="You are going to start a branch of foreign company process which
    involves 6 steps. You may be required to provide documents that you
    do not have at this moment. Feel free to pause the process and
    resume whenever is convenient for you. Your progress will be saved."
      path={`/foreign-branch-registration?entry_id=${generateUUID()}`}
      setDetails={setForeignCompanyDetails}
    />
  );
};

export default ForeignBranchSplashPage;
