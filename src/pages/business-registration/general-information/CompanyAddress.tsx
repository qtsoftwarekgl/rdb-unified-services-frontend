import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import validateInputs from "../../../helpers/Validations";
import {
  getRwandaCells,
  getRwandaDistricts,
  getRwandaProvinces,
  getRwandaSectors,
  getRwandaVillages,
} from "../../../helpers/Data";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBusinessCompletedStep,
  setBusinessActiveStep,
  setBusinessCompletedStep,
} from "../../../states/features/businessRegistrationSlice";
import { setUserApplications } from "../../../states/features/userApplicationSlice";

export interface business_company_address {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  street_name: string;
  po_box: string;
  fax: string;
  email: string;
  phone: string;
}

interface CompanyAddressProps {
  isOpen: boolean;
  company_address: business_company_address | null;
  entry_id: string | null;
}

export interface AdministrativeUnits {
  provinces: string[];
  districts: string[];
  sectors: string[];
  cells: string[];
  villages: string[];
}

const CompanyAddress: FC<CompanyAddressProps> = ({
  isOpen,
  company_address,
  entry_id,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [administrativeValues, setAdministrativeValues] =
    useState<AdministrativeUnits>({
      provinces: [],
      districts: [],
      sectors: [],
      cells: [],
      villages: [],
    });

  const { user } = useSelector((state: RootState) => state.user);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (company_address) {
      setValue("province", company_address?.province);
      setValue("district", company_address?.district);
      setValue("sector", company_address?.sector);
      setValue("cell", company_address?.cell);
      setValue("village", company_address?.village);
      setValue("street_name", company_address?.street_name);
      setValue("po_box", company_address?.po_box);
      setValue("fax", company_address?.fax);
      setValue("email", company_address?.email);
      setValue("phone", company_address?.phone);
    } else {
      dispatch(removeBusinessCompletedStep("company_address"));
    }
  }, [company_address, dispatch, setValue]);

  useEffect(() => {
    if (watch("province")) {
      setAdministrativeValues({
        ...administrativeValues,
        districts: getRwandaDistricts(watch("province")),
      });
      setValue("district", "");
      setValue("sector", "");
      setValue("cell", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("province")]);

  useEffect(() => {
    if (watch("district") && watch("province")) {
      setAdministrativeValues({
        ...administrativeValues,
        sectors: getRwandaSectors(watch("province"), watch("district")),
      });
      setValue("sector", "");
      setValue("cell", "");
      setValue("village", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, watch("district")]);

  useEffect(() => {
    if (watch("sector") && watch("district") && watch("province")) {
      setAdministrativeValues({
        ...administrativeValues,
        cells: getRwandaCells(
          watch("province"),
          watch("district"),
          watch("sector")
        ),
      });
      setValue("cell", "");
      setValue("village", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("sector")]);

  useEffect(() => {
    if (
      watch("cell") &&
      watch("sector") &&
      watch("district") &&
      watch("province")
    ) {
      setAdministrativeValues({
        ...administrativeValues,
        villages: getRwandaVillages(
          watch("province"),
          watch("district"),
          watch("sector"),
          watch("cell")
        ),
      });
      setValue("village", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("cell")]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          status: 'in_progress',
          active_tab: 'general_information',
          active_step: 'business_activity_vat',
          company_address: {
            ...data,
            step: 'company_address',
          },
        })
      );
      dispatch(setBusinessActiveStep("business_activity_vat"));
      dispatch(setBusinessCompletedStep("company_address"));
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={user?.email?.includes("info@rdb")}
        >
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="province"
              defaultValue={company_address?.province}
              control={control}
              rules={{ required: "Select province of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        company_address?.province &&
                        getRwandaProvinces()
                          ?.filter(
                            (province) => province === company_address?.province
                          )
                          ?.map((province) => {
                            return { label: province, value: province };
                          })[0]
                      }
                      required
                      label="Province"
                      options={getRwandaProvinces()?.map((province: string) => {
                        return {
                          label: province,
                          value: province,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.province && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.province.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="district"
              control={control}
              defaultValue={company_address?.district}
              rules={{ required: "Select district of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        company_address?.district &&
                        company_address?.province &&
                        getRwandaDistricts(company_address?.province)
                          ?.filter(
                            (district: string) =>
                              district === company_address?.district
                          )
                          ?.map((district: string) => {
                            return { label: district, value: district };
                          })[0]
                      }
                      required
                      label="District"
                      options={
                        watch("province")
                          ? administrativeValues?.districts?.map(
                              (district: string) => {
                                return {
                                  label: district,
                                  value: district,
                                };
                              }
                            )
                          : []
                      }
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.district && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.district.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="sector"
              control={control}
              defaultValue={
                company_address?.sector &&
                company_address?.province &&
                company_address?.district &&
                getRwandaSectors(
                  company_address?.province,
                  company_address?.district
                )?.find((sector: string) => sector === company_address?.sector)
              }
              rules={{ required: "Select sector of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        company_address?.sector &&
                        company_address?.province &&
                        company_address?.district &&
                        getRwandaSectors(
                          company_address?.province,
                          company_address?.district
                        )
                          ?.filter(
                            (sector: string) =>
                              sector === company_address?.sector
                          )
                          ?.map((sector: string) => {
                            return { label: sector, value: sector };
                          })[0]
                      }
                      required
                      label="Sector"
                      options={
                        watch("province") && watch("district")
                          ? administrativeValues?.sectors?.map(
                              (sector: string) => {
                                return {
                                  label: sector,
                                  value: sector,
                                };
                              }
                            )
                          : []
                      }
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.sector && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.sector.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="cell"
              control={control}
              rules={{ required: "Select cell of residence" }}
              defaultValue={
                company_address?.cell &&
                company_address?.province &&
                company_address?.district &&
                company_address?.sector &&
                getRwandaCells(
                  company_address?.province,
                  company_address?.district,
                  company_address?.sector
                )?.find((cell: string) => cell === company_address?.cell)
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        company_address?.cell &&
                        company_address?.province &&
                        company_address?.district &&
                        company_address?.sector &&
                        getRwandaCells(
                          company_address?.province,
                          company_address?.district,
                          company_address?.sector
                        )
                          ?.filter(
                            (cell: string) => cell === company_address?.cell
                          )
                          ?.map((cell: string) => {
                            return { label: cell, value: cell };
                          })[0]
                      }
                      required
                      label="Cell"
                      options={
                        watch("province") &&
                        watch("district") &&
                        watch("sector")
                          ? administrativeValues?.cells?.map((cell: string) => {
                              return {
                                label: cell,
                                value: cell,
                              };
                            })
                          : []
                      }
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.cell && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.cell.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="village"
              control={control}
              rules={{ required: "Select village of residence" }}
              defaultValue={
                company_address?.village &&
                company_address?.province &&
                company_address?.district &&
                company_address?.sector &&
                company_address?.cell &&
                getRwandaVillages(
                  company_address?.province,
                  company_address?.district,
                  company_address?.sector,
                  company_address?.cell
                )?.find(
                  (village: string) => village === company_address?.village
                )
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        company_address?.village &&
                        company_address?.province &&
                        company_address?.district &&
                        company_address?.sector &&
                        company_address?.cell &&
                        getRwandaVillages(
                          company_address?.province,
                          company_address?.district,
                          company_address?.sector,
                          company_address?.cell
                        )
                          ?.filter(
                            (village: string) =>
                              village === company_address?.village
                          )
                          ?.map((village: string) => {
                            return { label: village, value: village };
                          })[0]
                      }
                      required
                      label="Village"
                      options={
                        watch("province") &&
                        watch("district") &&
                        watch("sector") &&
                        watch("cell")
                          ? administrativeValues?.villages?.map(
                              (village: string) => {
                                return {
                                  label: village,
                                  value: village,
                                };
                              }
                            )
                          : []
                      }
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.village && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.village.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="street_name"
              defaultValue={
                watch("street_name") || company_address?.street_name
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      defaultValue={
                        watch("street_name") || company_address?.street_name
                      }
                      label="Street Name"
                      placeholder="Street name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              control={control}
              defaultValue={watch("po_box") || company_address?.po_box}
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="P.O Box"
                      placeholder="Postal code"
                      defaultValue={watch("po_box") || company_address?.po_box}
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="fax"
              defaultValue={watch("fax") || company_address?.fax}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="Fax"
                      defaultValue={watch("fax") || company_address?.fax}
                      placeholder="Fax"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="email"
              control={control}
              defaultValue={watch("email") || company_address?.email}
              rules={{
                required: "Email address is required",
                validate: (value) => {
                  return (
                    validateInputs(String(value), "email") ||
                    "Invalid email address"
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      label="Email"
                      defaultValue={watch("email") || company_address?.email}
                      placeholder="name@domain.com"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {String(errors?.email?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="phone"
              defaultValue={watch("phone") || company_address?.phone}
              rules={{
                required: "Phone number is required",
                validate: (value) => {
                  return (
                    validateInputs(
                      value?.length < 10 ? `0${value}` : String(value),
                      "tel"
                    ) || "Invalid phone number"
                  );
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      defaultValue={watch("phone") || company_address?.phone}
                      label="Phone"
                      prefixText="+250"
                      placeholder="Phone number"
                      {...field}
                    />
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
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep("company_details"));
              }}
            />
            <Button
              value={isLoading ? <Loader /> : "Continue"}
              primary
              submit
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default CompanyAddress;
