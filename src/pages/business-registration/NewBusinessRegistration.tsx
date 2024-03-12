import Button from "../../components/inputs/Button";
import UserLayout from "../../containers/UserLayout";
import { generateUUID } from "../../helpers/Strings";

interface NewRegistrationProps {
  description: string;
  path: string;
}

export const NewRegistration = ({
  description,
  path,
}: NewRegistrationProps) => {
  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-5 p-6 bg-white rounded-md shadow-sm">
        <menu className="flex flex-col items-center justify-center w-full h-full gap-6 m-auto">
          <h3 className="text-[14px] text-center max-w-[85%] mx-auto">
            {description}
          </h3>
          <Button value="Continue" primary route={path} />
        </menu>
      </main>
    </UserLayout>
  );
};

const NewBusinessRegistration = () => {
  return (
    <NewRegistration
      description="You are going to start a business registration process which
      involves 6 steps. You may be required to provide documents that you
      do not have at this moment. Feel free to pause the process and
      resume whenever is convenient for you. Your progress will be saved."
      path={`/business-registration?entry_id=${generateUUID()}`}
    />
  );
};

export default NewBusinessRegistration;
