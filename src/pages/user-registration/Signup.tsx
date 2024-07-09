import { useSelector } from "react-redux";
import RegistrationNavbar from "./RegistrationNavbar";
import { RootState } from "../../states/store";
import SelectNationality from "./SelectNationality";
import ForeignRegistrationForm from "./ForeignRegistrationForm";

const Signup = () => {
  // STATE VARIABLES
  const { registrationStep } = useSelector((state: RootState) => state.auth);

  return (
    <main className="flex flex-col gap-3">
      <RegistrationNavbar />
      <section className="flex flex-col gap-6 bg-white rounded-md shadow-sm w-[90%] mx-auto p-8">
        <h1 className="flex items-center justify-center text-2xl font-semibold text-center uppercase">
          {registrationStep === "rwandanRegistrationForm"
            ? "Rwandese User"
            : registrationStep === "foreignRegistrationForm"
            ? "Foreign User"
            : "User"}{" "}
          Registration
        </h1>
        <menu className="flex flex-col justify-center h-full gap-2">
          <SelectNationality
            isOpen={[
              "selectNationality",
              "rwandanRegistrationForm",
            ].includes(registrationStep)}
          />
          <ForeignRegistrationForm
            isOpen={registrationStep === "foreignRegistrationForm"}
          />
        </menu>
      </section>
    </main>
  );
};

export default Signup;
