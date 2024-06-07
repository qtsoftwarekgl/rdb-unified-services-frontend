import { useEffect } from "react";
import { generateUUID } from "../../../helpers/strings";
import { NewRegistration } from "../business-registration/NewBusinessRegistration";
import {
  foreign_business_registration_tabs_initial_state,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessRegistrationTabs,
} from "../../../states/features/foreignCompanyRegistrationSlice";
import { useDispatch } from "react-redux";

const ForeignBranchSplashPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setForeignBusinessRegistrationTabs(
        foreign_business_registration_tabs_initial_state
      )
    );
  }, []);

  return (
    <NewRegistration
      description="You are going to start a branch of foreign company process which
    involves 6 steps. You may be required to provide documents that you
    do not have at this moment. Feel free to pause the process and
    resume whenever is convenient for you. Your progress will be saved."
      path={`/foreign-branch-registration?entryId=${generateUUID()}`}
      setActiveStep={setForeignBusinessActiveStep}
      setActiveTab={setForeignBusinessActiveTab}
    />
  );
};

export default ForeignBranchSplashPage;
