import { useDispatch } from "react-redux";
import { generateUUID } from "../../helpers/strings";
import {
  resetToInitialState,
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import { NewRegistration } from "../business-applications/business-registration/NewBusinessRegistration";
import { useEffect } from "react";

const NewEnterpriseRegistration = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetToInitialState());
  }, []);
  return (
    <NewRegistration
      description="You are going to start a new enterprise business registration process which
    involves 3 steps. You may be required to provide documents that you
    do not have at this moment. Feel free to pause the process and
    resume whenever is convenient for you. Your progress will be saved."
      path={`/enterprise-registration?entryId=${generateUUID()}`}
      setActiveStep={setEnterpriseActiveStep}
      setActiveTab={setEnterpriseActiveTab}
    />
  );
};

export default NewEnterpriseRegistration;
