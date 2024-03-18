import { useEffect } from "react";
import { generateUUID } from "../../helpers/Strings";
import { NewRegistration } from "../business-registration/NewBusinessRegistration";

const ForeignBranchSplashPage = () => {
  useEffect(() => {}, []);

  return (
    <NewRegistration
      description="You are going to start a branch of foreign company process which
    involves 6 steps. You may be required to provide documents that you
    do not have at this moment. Feel free to pause the process and
    resume whenever is convenient for you. Your progress will be saved."
      path={`/business-registration?entry_id=${generateUUID()}`}
    />
  );
};

export default ForeignBranchSplashPage;