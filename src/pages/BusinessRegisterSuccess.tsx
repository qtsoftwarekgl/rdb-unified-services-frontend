import { useLocation } from "react-router-dom";
import Button from "../components/inputs/Button";
import success_logo from '/success_logo.jpeg';

const BusinessRegisterSuccess = () => {
  const redirectUrl = useLocation()?.state?.redirectUrl;

  return (
    <section className="flex flex-col items-center gap-12 p-12">
      <h1 className="text-2xl font-semibold text-center">Success!!</h1>
      <h3 className="text-lg">Successfully completed all steps to register</h3>
      <img src={success_logo} />

      <Button
        primary
        value="OK"
        route={redirectUrl ? redirectUrl : "/services"}
        className="w-40"
      />
    </section>
  );
};

export default BusinessRegisterSuccess;
