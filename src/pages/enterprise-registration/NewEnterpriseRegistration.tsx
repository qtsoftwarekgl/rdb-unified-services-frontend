import { generateUUID } from "../../helpers/strings";
import { NewRegistration } from "../business-registration/NewBusinessRegistration";

const NewEnterpriseRegistration = () => {
  return (
    <NewRegistration
      description="You are going to start a new enterprise business registration process which
    involves 3 steps. You may be required to provide documents that you
    do not have at this moment. Feel free to pause the process and
    resume whenever is convenient for you. Your progress will be saved."
      path={`/enterprise-registration?entry_id=${generateUUID()}`}
    />
  );
};

export default NewEnterpriseRegistration;
