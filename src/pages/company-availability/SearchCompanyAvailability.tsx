import { Controller, FieldValues, useForm } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import Button from "../../components/inputs/Button";
import Input from "../../components/inputs/Input";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Loader from "../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  setNameReservation,
  setNameReservationActiveTab,
} from "../../states/features/nameReservationSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../states/store";

const SearchCompanyAvailability = () => {
  const {
    control,
    watch,
    setError,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    search: false,
    submit: false,
    success: false,
  });
  const dispatch: AppDispatch = useDispatch();

  const onSubmit = (data: FieldValues) => {
    dispatch(setNameReservation(data.name));
    dispatch(setNameReservationActiveTab("owner_details"));
    navigate("/name-reservation");
  };

  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-fit bg-primary">
          Name Availability
        </menu>
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-sm:w-full w-[80%] mx-auto max-sm:p-4 py-4 flex flex-col items-center gap-12 rounded-md border-[#e1e1e6]"
          >
            <section className="w-1/2 max-sm:w-full">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Company name is required" }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-3">
                      <Input
                        required
                        label="Enter the company name to check availability"
                        suffixIcon={faSearch}
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
                              if (field?.value.trim().toLowerCase() !== "xyz") {
                                setError("name", {
                                  type: "manual",
                                  message: `${watch(
                                    'name'
                                  )} is not available. Try another name`,
                                });
                                setIsLoading({
                                  submit: false,
                                  search: false,
                                  success: false,
                                });
                              } else {
                                clearErrors('name');

                                setIsLoading({
                                  submit: false,
                                  search: false,
                                  success: true,
                                });
                              }
                            }, 1000);
                          }
                        }}
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
            </section>
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value={"Back"}
                route="/services"
                className="w-20 border border-primary"
              />
              <Button
                value={"Reserve Name"}
                primary
                submit
                disabled={watch("name") && !isLoading.success}
              />
            </menu>
          </form>
        </section>
      </section>
    </UserLayout>
  );
};

export default SearchCompanyAvailability;
