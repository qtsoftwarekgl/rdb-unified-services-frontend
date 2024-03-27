import { useEffect, useState } from "react";
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
} from "../../../helpers/data";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
  setEnterpriseCompletedTab,
} from "../../../states/features/enterpriseRegistrationSlice";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../../constants/Users";

interface AdministrativeUnits {
  provinces: string[];
  districts: string[];
  sectors: string[];
  cells: string[];
  villages: string[];
}
interface OfficeAddressProps {
  entry_id: string | null;
}

const OfficeAddress = ({ entry_id }: OfficeAddressProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { enterprise_registration_active_step } = useSelector(
    (state: RootState) => state?.enterpriseRegistration
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [administrativeValues, setAdministrativeValues] =
    useState<AdministrativeUnits>({
      provinces: [],
      districts: [],
      sectors: [],
      cells: [],
      villages: [],
    });

  const { user_applications } = useSelector(
    (state: RootState) => state?.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email)
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const enterprise_office_address =
    user_applications?.find((app) => app?.entry_id === entry_id)
      ?.office_address || null;

  // SET DEFAULT VALUES
  useEffect(() => {
    if (enterprise_office_address) {
      setValue("province", enterprise_office_address?.province);
      setValue("district", enterprise_office_address?.district);
      setValue("sector", enterprise_office_address?.sector);
      setValue("cell", enterprise_office_address?.cell);
      setValue("village", enterprise_office_address?.village);
      setValue("street_name", enterprise_office_address?.street_name);
      setValue("po_box", enterprise_office_address?.po_box);
      setValue("fax", enterprise_office_address?.fax);
      setValue("email", enterprise_office_address?.email);
      setValue("phone", enterprise_office_address?.phone);
    }
  }, [enterprise_office_address, setValue]);

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
      dispatch(
        setUserApplications({
          entry_id,
          office_address: {
            ...data,
            step: { ...enterprise_registration_active_step },
          },
        })
      );

      dispatch(setEnterpriseCompletedStep("office_address"));
      dispatch(setEnterpriseCompletedTab("enterprise_details"));

      dispatch(setEnterpriseActiveTab("attachments"));
      dispatch(setEnterpriseActiveStep("attachments"));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col gap-4"
          disabled={isFormDisabled}
        >
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="province"
              defaultValue={
                watch("province") || enterprise_office_address?.province
              }
              control={control}
              rules={{ required: "Select province of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        enterprise_office_address?.province &&
                        getRwandaProvinces()
                          ?.filter(
                            (province) =>
                              province === enterprise_office_address?.province
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
              defaultValue={
                watch("district") || enterprise_office_address?.district
              }
              rules={{ required: "Select district of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        enterprise_office_address?.district &&
                        enterprise_office_address?.province &&
                        getRwandaDistricts(enterprise_office_address?.province)
                          ?.filter(
                            (district: string) =>
                              district === enterprise_office_address?.district
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
                watch("sector") || enterprise_office_address?.sector
              }
              rules={{ required: "Select sector of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        enterprise_office_address?.sector &&
                        enterprise_office_address?.province &&
                        enterprise_office_address?.district &&
                        getRwandaSectors(
                          enterprise_office_address?.province,
                          enterprise_office_address?.district
                        )
                          ?.filter(
                            (sector: string) =>
                              sector === enterprise_office_address?.sector
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
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        enterprise_office_address?.cell &&
                        enterprise_office_address?.province &&
                        enterprise_office_address?.district &&
                        enterprise_office_address?.sector &&
                        getRwandaCells(
                          enterprise_office_address?.province,
                          enterprise_office_address?.district,
                          enterprise_office_address?.sector
                        )
                          ?.filter(
                            (cell: string) =>
                              cell === enterprise_office_address?.cell
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
                watch("village") || enterprise_office_address?.village
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={
                        enterprise_office_address?.village &&
                        enterprise_office_address?.province &&
                        enterprise_office_address?.district &&
                        enterprise_office_address?.sector &&
                        enterprise_office_address?.cell &&
                        getRwandaVillages(
                          enterprise_office_address?.province,
                          enterprise_office_address?.district,
                          enterprise_office_address?.sector,
                          enterprise_office_address?.cell
                        )
                          ?.filter(
                            (village: string) =>
                              village === enterprise_office_address?.village
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
                watch("street_name") || enterprise_office_address?.street_name
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      defaultValue={
                        watch("street_name") ||
                        enterprise_office_address?.street_name
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
              defaultValue={
                watch("po_box") || enterprise_office_address?.po_box
              }
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="P.O Box"
                      placeholder="Postal code"
                      defaultValue={
                        watch("po_box") || enterprise_office_address?.po_box
                      }
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="fax"
              defaultValue={watch("fax") || enterprise_office_address?.fax}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="Fax"
                      defaultValue={
                        watch("fax") || enterprise_office_address?.fax
                      }
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
              defaultValue={watch("email") || enterprise_office_address?.email}
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
                      defaultValue={
                        watch("email") || enterprise_office_address?.email
                      }
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
              defaultValue={watch("phone") || enterprise_office_address?.phone}
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
                      defaultValue={
                        watch("phone") || enterprise_office_address?.phone
                      }
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
                dispatch(setEnterpriseActiveStep("business_activity_vat"));
              }}
            />
            {isAmending && (
              <Button
                value={"Complete Amendment"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setEnterpriseActiveTab("enterprise_preview_submission")
                  );
                }}
              />
            )}
            <Button
              value={isLoading ? <Loader /> : "Continue"}
              disabled={isFormDisabled}
              primary
              submit
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default OfficeAddress;
