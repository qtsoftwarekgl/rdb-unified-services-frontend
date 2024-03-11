import Button from '../../components/inputs/Button';
import UserLayout from '../../containers/UserLayout';
import { generateUUID } from '../../helpers/Strings';

const NewBusinessRegistration = () => {
  return (
    <UserLayout>
      <main className="flex flex-col gap-5 w-full bg-white p-6 rounded-md shadow-sm">
        <menu className="w-full flex flex-col h-full items-center justify-center gap-6 m-auto">
          <h3 className="text-[14px] text-center max-w-[85%] mx-auto">
            You are going to start a business registration process which
            involves 6 steps. You may be required to provide documents that you
            do not have at this moment. Feel free to pause the process and
            resume whenever is convenient for you. Your progress will be saved.
          </h3>
          <Button
            value="Continue"
            primary
            route={`/business-registration?entry_id=${generateUUID()}`}
          />
        </menu>
      </main>
    </UserLayout>
  );
};

export default NewBusinessRegistration;
