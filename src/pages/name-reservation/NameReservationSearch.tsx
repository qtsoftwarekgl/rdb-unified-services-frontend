import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Loader from "../../components/Loader";
import { institutions } from "../../constants/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/inputs/Button";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setNameReservation,
  setNameReservationActiveStep,
  setNameReservationActiveTab,
  setNameReservationOwnerDetails,
} from "../../states/features/nameReservationSlice";

type Props = {
  isOpen: boolean;
};

const NameReservationSearch = ({ isOpen }: Props) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm();

  const { name_reservation } = useSelector(
    (state: RootState) => state.nameReservation
  );

  // NAVIGATE
  const navigate = useNavigate();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    search: false,
    submit: false,
    success: false,
  });

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading({
      search: false,
      submit: true,
      success: false,
    });
    setTimeout(() => {
      setIsLoading({
        search: false,
        submit: false,
        success: false,
      });
      dispatch(setNameReservationOwnerDetails(null));
      dispatch(setNameReservation(null));
      navigate("/services");
    }, 1000);
    return data;
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[40%] mx-auto flex flex-col gap-5"
      >
        <Controller
          name="name"
          control={control}
          defaultValue={watch("name") || name_reservation}
          rules={{ required: "Company name is required" }}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-3">
                <Input
                  label="Enter the company name to reserve"
                  suffixIcon={faSearch}
                  defaultValue={watch("name") || name_reservation}
                  suffixIconPrimary
                  suffixIconHandler={(e) => {
                    e.preventDefault();
                    if (!field?.value) {
                      setError("name", {
                        type: "manual",
                        message: "Company name is required",
                      });
                      return;
                    } else {
                      clearErrors("name");
                      setIsLoading({
                        submit: false,
                        search: true,
                        success: false,
                      });
                      setTimeout(() => {
                        const randomNumber = Math.floor(Math.random() * 80);
                        const companyName = institutions[randomNumber];

                        if (!companyName) {
                          setError("name", {
                            type: "manual",
                            message: `${watch(
                              "name"
                            )} is not available. Try another name`,
                          });
                          setIsLoading({
                            submit: false,
                            search: false,
                            success: false,
                          });
                        } else {
                          clearErrors("name");

                          setIsLoading({
                            submit: false,
                            search: false,
                            success: true,
                          });
                        }
                      }, 1000);
                    }
                  }}
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("name");
                    setIsLoading({
                      submit: false,
                      search: false,
                      success: false,
                    });
                  }}
                />
                {isLoading?.search && (
                  <p className="flex text-[13px] items-center gap-1">
                    <Loader size={4} /> Looking for name availability
                  </p>
                )}
                {isLoading?.success && (
                  <p className="flex text-[13px] items-center gap-2 text-green-600">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-700"
                    />
                    {watch("name")} is available
                  </p>
                )}
                {errors?.name && (
                  <p className="text-sm text-red-500">
                    {String(errors?.name?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setNameReservationActiveStep("owner_details"));
              dispatch(setNameReservationActiveTab("owner_details"));
            }}
          />
          <Button
            value={isLoading?.submit ? <Loader /> : "Submit"}
            primary
            submit
          />
        </menu>
      </form>
    </section>
  );
};

export default NameReservationSearch;
