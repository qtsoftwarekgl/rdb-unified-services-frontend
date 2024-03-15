import { FC, useEffect, useState } from "react";
import Select from "../../components/inputs/Select";
import Input from "../../components/inputs/Input";
import { faEllipsis, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";
import Loader from "../../components/Loader";
import { userData } from "../../constants/authentication";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import {
  setNationalIdDetails,
  setRegistrationStep,
} from "../../states/features/authSlice";
import RwandanRegistrationForm from "./RwandanRegistrationForm";

interface SelectNationalityProps {
  isOpen: boolean;
}

const SelectNationality: FC<SelectNationalityProps> = ({ isOpen }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [documentType, setDocumentType] = useState<string>("nid");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentNo, setDocumentNo] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [nationalIdError, setNationalIdError] = useState<boolean>(false);
  const { nationalIdDetails, registrationStep } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (documentType === "passport") {
      dispatch(setNationalIdDetails(null));
      dispatch(setNationalIdDetails(null));
      dispatch(setRegistrationStep("foreign-registration-form"));
    }
  }, [dispatch, documentType]);

  if (!isOpen) return null;

  return (
    <section className={`flex flex-col gap-8 items-center w-full`}>
      <form
        className={`flex flex-col items-center gap-6 w-[70%] mx-auto p-6 shadow-md rounded-md max-2xl:w-[75%] max-xl:w-[80%] max-[1000px]:w-[85%] max-[900px]:w-[90%] max-md:w-[95%] max-sm:w-[100%]`}
      >
        <menu className="flex items-start w-full gap-6 max-sm:flex-col">
          <Select
            label="Document Type"
            required
            options={[
              { value: "nid", label: "National ID" },
              { label: "Passport", value: "passport" },
            ]}
            onChange={(e) => {
              setDocumentType(e?.value);
            }}
            defaultValue={{ value: "nid", label: "National ID" }}
            labelClassName={`${
              documentType === "passport" &&
              "!w-1/2 mx-auto max-lg:!w-3/5 max-md:!w-2/3 max-sm:!w-full"
            }`}
          />
          {documentType === "nid" && (
            <label className="flex flex-col items-start w-full gap-2">
              <Input
                required
                label="ID Document No"
                suffixIconPrimary
                suffixIcon={isLoading ? faEllipsis : faSearch}
                suffixIconHandler={(e) => {
                  e.preventDefault();
                  if (documentNo.length !== 16) {
                    setIsError(true);
                    return;
                  } else {
                    setIsError(false);
                    setNationalIdError(false);
                    dispatch(setNationalIdDetails(null));
                    setIsLoading(true);
                    setTimeout(() => {
                      const randomNumber = Math.floor(Math.random() * 16);
                      const userDetails = userData[randomNumber];
                      if (!userDetails) {
                        setNationalIdError(true);
                        dispatch(setNationalIdDetails(null));
                      }
                      if (userDetails) {
                        setNationalIdError(false);
                        dispatch(setNationalIdDetails(nationalIdDetails));
                        dispatch(setNationalIdDetails(userDetails));
                        dispatch(
                          setRegistrationStep("rwandan-registration-form")
                        );
                      }
                      setIsLoading(false);
                    }, 1500);
                  }
                }}
                placeholder="1 XXXX X XXXXXXX X XX"
                onChange={(e) => {
                  e.preventDefault();
                  setDocumentNo(e.target.value);
                  if (e.target.value.length > 16) {
                    setIsError(true);
                  } else if (e.target.value.length < 16) {
                    setIsError(true);
                  } else if (e.target.value.length === 16) {
                    setIsError(false);
                  }
                }}
              />
              {isLoading && !isError && (
                <span className="flex items-center gap-[2px] text-[13px]">
                  <Loader size={4} /> Validating document
                </span>
              )}
              {isError && !isLoading && (
                <span className="text-red-600 text-[13px]">
                  Invalid document number
                </span>
              )}
            </label>
          )}
        </menu>
        <menu
          className={`${
            documentType !== "nid"
              ? "hidden"
              : "flex flex-col gap-1 w-full mx-auto px-2"
          }`}
        >
          {nationalIdError && (
            <p className="text-red-600 text-[13px] text-center max-w-[80%] mx-auto">
              A person with the provided document number is not found. Double
              check the document number and try again.
            </p>
          )}
        </menu>
        <menu
          className={`${
            registrationStep !== "rwandan-registration-form" && "mt-[-24px] h-0"
          } w-full`}
        >
          <RwandanRegistrationForm
            isOpen={registrationStep === "rwandan-registration-form"}
          />
        </menu>
        <menu
          className={`${
            registrationStep === "rwandan-registration-form" && "hidden"
          } flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button value="Back" route="/auth/login" />
          <Button
            value="Continue"
            primary
            onClick={(e) => {
              e.preventDefault();
              if (
                nationalIdDetails &&
                documentType === "nid" &&
                !nationalIdError
              ) {
                dispatch(setNationalIdDetails(nationalIdDetails));
                dispatch(setRegistrationStep("rwandan-registration-form"));
              } else if (documentType === "passport") {
                dispatch(setNationalIdDetails(null));
                dispatch(setRegistrationStep("foreign-registration-form"));
              }
            }}
          />
        </menu>
      </form>
    </section>
  );
};

export default SelectNationality;
