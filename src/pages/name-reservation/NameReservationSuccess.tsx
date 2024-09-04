/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/inputs/Button";
import { resetReservationData, setNameReservationActiveStep, setNameReservationActiveTab, setNameReservationOwnerDetails } from "@/states/features/nameReservationSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const NameReservationSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleContinue = (e: Record<string,any>) => {
    e.preventDefault();
    dispatch(setNameReservationActiveTab('owner_details'));
    dispatch(setNameReservationActiveStep('owner_details'));
    dispatch(setNameReservationOwnerDetails({}));
    dispatch(resetReservationData());
    navigate('/services');
  }
  return (
    <section className="flex flex-col items-center gap-4">
      <h1 className="flex gap-1 text-center">
        We have received your name reservation application successfully.
      </h1>

      <p className="text-center text-[14px]">
        When the Registrar General approves such an application, the name will
        be reserved in the company register for a period of three (3) months{" "}
        renewable only once upon application
      </p>
      <menu className="my-4">
        <Button value={"Continue"} onClick={handleContinue} primary />
      </menu>
    </section>
  );
};

export default NameReservationSuccess;
