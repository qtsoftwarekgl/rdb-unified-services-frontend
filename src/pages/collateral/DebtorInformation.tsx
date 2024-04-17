import Loader from "@/components/Loader";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import { validNationalID, validTinNumber } from "@/constants/Users";
import { userData } from "@/constants/authentication";
import { searchedCompanies } from "@/constants/businessRegistration";
import validateInputs from "@/helpers/validations";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
  setCollateralApplications,
  setCollateralCompletedStep,
  setCollateralCompletedTab,
} from "@/states/features/collateralRegistrationSlice";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  entry_id: string | null;
  debtor_info: any;
};

const DebtorInformation: FC<Props> = ({ entry_id, debtor_info }) => {
  const {
    control,
    handleSubmit,
    clearErrors,
    watch,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [searchInfo, setSearchInfo] = useState({
    error: false,
    loading: false,
    data: null,
  });
  const [searchedCompany, setSearchedCompany] = useState({
    error: false,
    loading: false,
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setCollateralApplications({
          entry_id,
          debtor_info: {
            ...data,
          },
        })
      );
      dispatch(setCollateralCompletedStep("debtor_information"));
      dispatch(setCollateralCompletedTab("debtor_information"));
      dispatch(setCollateralActiveTab("collateral_information"));
      dispatch(setCollateralActiveStep("collateral_information"));
      reset();
      setSearchInfo({
        ...searchInfo,
        data: null,
      });
      setSearchedCompany({
        ...searchedCompany,
        data: null,
      });
    }, 1000);
  };

  useEffect(() => {
    if (debtor_info) {
      if (debtor_info.debtor_category === "individual") {
        setSearchInfo({
          error: false,
          loading: false,
          data: { ...debtor_info },
        });
      } else {
        setSearchedCompany({
          error: false,
          loading: false,
          data: { ...debtor_info },
        });
      }
    }
  }, [debtor_info, setValue]);

  useEffect(() => {
    if (searchInfo?.data) {
      setValue(
        "debtor_names",
        `${searchInfo?.data?.debtor_names ?? ""} ${
          searchInfo?.data?.first_name ?? ""
        } ${searchInfo?.data?.middle_name ?? ""} ${
          searchInfo?.data?.last_name ?? ""
        }`
      );
      setValue("debtor_dob", searchInfo?.data?.date_of_birth);
      setValue("debtor_dob", searchInfo?.data?.date_of_birth);
      setValue("spouse_names", searchInfo?.data?.spouse_name);
      setValue("spouse_id_number", searchInfo?.data?.spouse_id_number);
      setValue("spouse_dob", searchInfo?.data?.spouse_date_of_birth);
      setValue("phone", searchInfo?.data?.phone);
      setValue("spouse_phone", searchInfo?.data?.spouse_phone);
      setValue("marital_status", searchInfo?.data?.marital_status);
      setValue("gender", searchInfo?.data?.gender);
      setValue("company_name", "");
      setValue("date_of_incorporation", "");
      setValue("company_type", "");
      setValue("company_address", "");
    }
    if (searchedCompany?.data) {
      setValue("company_name", searchedCompany?.data?.company_name);
      setValue(
        "date_of_incorporation",
        searchedCompany?.data?.date_of_incorporation
      );
      setValue("company_type", searchedCompany?.data?.company_type);
      setValue("company_address", searchedCompany?.data?.company_address);
      setValue("marital_status", "");
      setValue("gender", "");
      setValue("debtor_names", "");
      setValue("debtor_dob", "");
      setValue("debtor_dob", "");
      setValue("spouse_names", "");
      setValue("spouse_id_number", "");
      setValue("spouse_dob", "");
      setValue("phone", "");
      setValue("spouse_phone", "");
    }
  }, [searchInfo, searchedCompany, setValue]);

  return (
    <section className="flex flex-col gap-8 max-md:w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <menu className="flex items-start w-full gap-6">
          <Controller
            control={control}
            name="debtor_category"
            rules={{ required: "Select debtor category" }}
            defaultValue={debtor_info?.debtor_category || ""}
            render={({ field }) => (
              <label
                className={`flex flex-col w-full gap-2 ${
                  watch("debtor_category") ? "" : "!w-1/2"
                }`}
              >
                <Select
                  label="Debtor Category"
                  defaultValue={debtor_info?.debtor_category || ""}
                  required
                  options={[
                    { label: "Individual", value: "individual" },
                    { label: "Institution", value: "institution" },
                  ]}
                  onChange={(e) => {
                    field.onChange(e);
                    setSearchInfo({
                      error: false,
                      loading: false,
                      data: null,
                    });
                    setSearchedCompany({
                      error: false,
                      loading: false,
                      data: null,
                    });
                    setValue("id_number", "");
                    setValue("tin_number", "");
                    clearErrors("");
                  }}
                />
                {errors?.debtor_category && (
                  <p className="text-red-500 text-[13px]">
                    {String(errors?.debtor_category.message)}
                  </p>
                )}
              </label>
            )}
          />
          {watch("debtor_category") && (
            <>
              {watch("debtor_category") === "individual" ? (
                <Controller
                  name="id_number"
                  control={control}
                  defaultValue={
                    watch("id_number") || debtor_info?.id_number || ""
                  }
                  rules={{
                    required: watch("id_number")
                      ? "Debtor's ID number is required"
                      : false,
                    validate: (value) => {
                      return (
                        validateInputs(value, "nid") ||
                        "National ID must be 16 characters long"
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          label="ID Document Number"
                          required
                          suffixIcon={faSearch}
                          defaultValue={
                            watch("id_number") || debtor_info?.id_number || ""
                          }
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            clearErrors("id_number");
                            await trigger("id_number");
                          }}
                          suffixIconHandler={(e) => {
                            e.preventDefault();
                            if (!field?.value) {
                              return;
                            }
                            setSearchInfo({
                              ...searchInfo,
                              loading: true,
                              error: false,
                            });
                            setTimeout(() => {
                              const randomNumber = Math.floor(
                                Math.random() * 10
                              );
                              const userDetails = userData[randomNumber];
                              if (field?.value === String(validNationalID)) {
                                setSearchInfo({
                                  ...searchInfo,
                                  loading: false,
                                  error: false,
                                  data: userDetails,
                                });
                              } else {
                                setSearchInfo({
                                  ...searchInfo,
                                  loading: false,
                                  error: true,
                                });
                              }
                            }, 1000);
                          }}
                        />
                        {searchInfo?.loading &&
                          !errors?.id_number &&
                          !searchInfo?.error && (
                            <span className="flex items-center gap-[2px] text-[13px]">
                              <Loader size={4} /> Validating document
                            </span>
                          )}
                        {searchInfo?.error && !searchInfo?.loading && (
                          <span className="text-red-600 text-[13px]">
                            Invalid document number
                          </span>
                        )}
                        {errors?.id_number && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.id_number?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              ) : (
                <Controller
                  name="tin_number"
                  control={control}
                  defaultValue={
                    watch("tin_number") || debtor_info?.tin_number || ""
                  }
                  rules={{
                    required: watch("tin_number)")
                      ? "Institution's TIN number is required"
                      : false,
                    validate: (value) => {
                      return (
                        validateInputs(value, "tin") ||
                        "TIN number must be 9 characters long"
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          label="TIN number"
                          required
                          suffixIcon={faSearch}
                          defaultValue={
                            watch("tin_number") || debtor_info?.tin_number || ""
                          }
                          suffixIconPrimary
                          placeholder="XXXXXXXXX"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            clearErrors("tin_number");
                            await trigger("tin_number");
                          }}
                          suffixIconHandler={(e) => {
                            e.preventDefault();
                            if (!field?.value) {
                              return;
                            }
                            setSearchedCompany({
                              ...searchedCompany,
                              loading: true,
                              error: false,
                            });
                            setTimeout(() => {
                              const randomNumber = Math.floor(
                                Math.random() * 10
                              );
                              const company_details =
                                searchedCompanies[randomNumber];
                              if (field?.value === String(validTinNumber)) {
                                setSearchedCompany({
                                  ...searchedCompany,
                                  loading: false,
                                  error: false,
                                  data: company_details,
                                });
                              } else {
                                setSearchedCompany({
                                  ...searchedCompany,
                                  loading: false,
                                  error: true,
                                });
                              }
                            }, 1000);
                          }}
                        />
                        {searchedCompany?.loading &&
                          !errors?.tin_number &&
                          !searchedCompany?.error && (
                            <span className="flex items-center gap-[2px] text-[13px]">
                              <Loader size={4} /> Searching for Institution...
                            </span>
                          )}
                        {searchedCompany?.error &&
                          !searchedCompany?.loading && (
                            <span className="text-red-600 text-[13px]">
                              Invalid TIN number
                            </span>
                          )}
                        {errors?.tin_number && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.tin_number?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            </>
          )}
        </menu>
        {watch("debtor_category") === "individual" &&
          searchInfo?.data &&
          Object.keys(searchInfo?.data).length !== 0 && (
            <>
              <menu className="flex items-start w-full gap-3">
                <Controller
                  name="debtor_names"
                  control={control}
                  defaultValue={
                    `${searchInfo?.data?.first_name || ""} ${
                      searchInfo?.data?.middle_name || ""
                    } ${
                      searchInfo?.data?.last_name ||
                      debtor_info?.debtor_names ||
                      ""
                    }` ||
                    searchInfo?.data?.debtor_names ||
                    ""
                  }
                  rules={{ required: "Debtor's name is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          required
                          readOnly
                          placeholder="Debtor's name"
                          label="Names"
                          {...field}
                        />
                        {errors?.debtor_names && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.debtor_names?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="debtor_dob"
                  control={control}
                  defaultValue={
                    searchInfo?.data?.date_of_birth ||
                    debtor_info?.debtor_dob ||
                    ""
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          readOnly
                          placeholder="Debtor's DOB"
                          label="DOB"
                          {...field}
                        />
                      </label>
                    );
                  }}
                />
              </menu>
              <menu className="flex items-start w-full gap-3">
                <menu className="flex items-start w-[48%] gap-12">
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={
                      searchInfo?.data?.gender || debtor_info?.gender || ""
                    }
                    render={() => {
                      return (
                        <label className="flex flex-col items-start gap-2 ">
                          <p className="flex items-center gap-1 text-[15px]">
                            Gender
                          </p>

                          <p className="px-2 py-1 rounded-md bg-background">
                            {searchInfo?.data?.gender ||
                              watch("gender") ||
                              debtor_info?.gender ||
                              ""}
                          </p>
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="marital_status"
                    control={control}
                    defaultValue={
                      searchInfo?.data?.marital_status ||
                      debtor_info?.marital_status ||
                      ""
                    }
                    render={() => {
                      return (
                        <label className="flex flex-col items-start gap-2 ">
                          <p className="flex items-center gap-1 text-[15px]">
                            Marital Status
                          </p>

                          <p className="px-2 py-1 rounded-md bg-background">
                            {searchInfo?.data?.marital_status ||
                              debtor_info?.marital_status ||
                              watch("marital_status") ||
                              ""}
                          </p>
                        </label>
                      );
                    }}
                  />
                </menu>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue={debtor_info?.phone || ""}
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-[48%] gap-1">
                        {watch("debtor_category") === "institution" ? (
                          <Input
                            label="Phone number"
                            required
                            type="tel"
                            {...field}
                          />
                        ) : (
                          <Select
                            label="Phone number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                            defaultValue={
                              searchInfo?.data?.phone ||
                              debtor_info?.phone ||
                              ""
                            }
                            required
                            options={userData?.slice(0, 3)?.map((user) => {
                              return {
                                ...user,
                                label: `(+250) ${user?.phone}`,
                                value: `(+250) ${user?.phone}`,
                              };
                            })}
                          />
                        )}
                        {errors?.phone && (
                          <p className="text-sm text-red-500">
                            {String(errors?.phone?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              </menu>
              {(searchInfo.data?.marital_status === "Married" ||
                debtor_info?.marital_status === "Married") && (
                <section className="border border-[#ebebeb] p-6 flex flex-col rounded-md gap-2">
                  <h1 className="text-[15px] text-[#333333] font-semibold">
                    Spouse
                  </h1>
                  <menu className="flex items-start w-full gap-3">
                    <Controller
                      name="spouse_names"
                      control={control}
                      defaultValue={
                        searchInfo?.data?.spouse_name ||
                        debtor_info?.spouse_names ||
                        ""
                      }
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col items-start w-full gap-1">
                            <Input
                              readOnly
                              placeholder="Spouse's name"
                              label="Names"
                              {...field}
                            />
                          </label>
                        );
                      }}
                    />
                    <Controller
                      name="spouse_id_number"
                      control={control}
                      defaultValue={
                        searchInfo?.data?.spouse_id_number ||
                        debtor_info?.spouse_id_number ||
                        ""
                      }
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col items-start w-full gap-1">
                            <Input
                              readOnly
                              placeholder="Spouse's ID Document Number"
                              label="ID Document Number"
                              {...field}
                            />
                            {errors?.spouse_id_number && (
                              <p className="text-red-500 text-[13px]">
                                {String(errors?.spouse_id_number.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                  </menu>
                  <menu className="flex items-start w-full gap-3">
                    <Controller
                      name="spouse_dob"
                      control={control}
                      defaultValue={
                        searchInfo?.data?.spouse_date_of_birth ||
                        debtor_info?.spouse_dob ||
                        ""
                      }
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col items-start w-full gap-1">
                            <Input
                              readOnly
                              placeholder="DOB"
                              label="DOB"
                              {...field}
                            />
                          </label>
                        );
                      }}
                    />
                    <Controller
                      name="spouse_phone"
                      defaultValue={
                        searchInfo?.data?.spouse_phone ||
                        debtor_info?.spouse_phone ||
                        ""
                      }
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col w-full gap-1">
                            <Input
                              label="Phone number"
                              readOnly
                              required
                              {...field}
                            />
                            {errors?.spouse_phone && (
                              <p className="text-sm text-red-500">
                                {String(errors?.spouse_phone?.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                  </menu>
                </section>
              )}
            </>
          )}
        {(watch("debtor_category") === "institution" ||
          debtor_info?.debtor_category === "institution") &&
          searchedCompany?.data &&
          Object.keys(searchedCompany?.data).length !== 0 && (
            <>
              <menu className="flex items-start w-full gap-3">
                <Controller
                  name="company_name"
                  control={control}
                  defaultValue={
                    searchedCompany?.data?.company_name ||
                    debtor_info?.company_name ||
                    ""
                  }
                  rules={{ required: "Institution name is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          required
                          readOnly
                          placeholder="Institution name"
                          label="Institution Name"
                          {...field}
                        />
                        {errors?.company_name && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.company_name.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="date_of_incorporation"
                  control={control}
                  defaultValue={
                    searchedCompany?.data?.date_of_incorporation ||
                    debtor_info?.date_of_incorporation ||
                    ""
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          readOnly
                          placeholder="Date of Incorporation"
                          label="Date of Incorporation"
                          {...field}
                        />
                      </label>
                    );
                  }}
                />
              </menu>
              <menu className="flex items-start w-full gap-3">
                <Controller
                  name="company_type"
                  control={control}
                  defaultValue={
                    searchedCompany?.data?.company_type ||
                    debtor_info?.company_type ||
                    ""
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          readOnly
                          placeholder="Institution Type"
                          label="Institution Type"
                          {...field}
                        />
                      </label>
                    );
                  }}
                />
                <Controller
                  name="company_address"
                  control={control}
                  defaultValue={
                    searchedCompany?.data?.company_address ||
                    debtor_info?.company_address ||
                    ""
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          readOnly
                          placeholder="Institution Address"
                          label="Institution Address"
                          {...field}
                        />
                      </label>
                    );
                  }}
                />
              </menu>
            </>
          )}
        <menu className="flex items-end justify-end w-full">
          <Button
            value={isLoading ? <Loader /> : "Save & Continue"}
            primary
            submit
            className="w-[180px]"
          />
        </menu>
      </form>
    </section>
  );
};

export default DebtorInformation;
