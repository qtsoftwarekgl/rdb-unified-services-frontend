import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import validateInputs from "../../../helpers/validations";
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
import { provicesList } from "../../../constants/provinces";
import { districtsList } from "../../../constants/districts";
import { sectorsList } from "../../../constants/sectors";
import { cellsList } from "../../../constants/cells";
import { villagesList } from "../../../constants/villages";

interface OfficeAddressProps {
  entry_id: string | null;
  enterprise_office_address: any;
  status?: string;
}

const OfficeAddress = ({
  entry_id,
  enterprise_office_address,
  status,
}: OfficeAddressProps) => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { enterprise_registration_active_step } = useSelector(
    (state: RootState) => state?.enterpriseRegistration
  );
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);

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

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
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

      if ((['in_preview', 'action_required'].includes(status)) || isLoading?.amend) {
        dispatch(setEnterpriseActiveTab("enterprise_preview_submission"));
      } else {
        // SET ACTIVE STEP
        dispatch(setEnterpriseActiveTab("attachments"));
        dispatch(setEnterpriseActiveStep("attachments"));
      }
      // SET CURRENT STEP AS COMPLETED
      dispatch(setEnterpriseCompletedStep("office_address"));
      dispatch(setEnterpriseCompletedTab("general_information"));

      dispatch(setEnterpriseCompletedStep("office_address"));
      dispatch(setEnterpriseCompletedTab("general_information"));

      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  // RESET COMPANY ADDRESS
  const resetCompanyLocation = () => {
    dispatch(
      setUserApplications({
        entry_id,
        office_address: {
          ...enterprise_office_address,
          province: "",
          district: "",
          sector: "",
          cell: "",
          village: "",
        },
      })
    );
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col gap-4" disabled={isFormDisabled}>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="province"
              control={control}
              defaultValue={enterprise_office_address?.province}
              rules={{ required: "Select province of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    {enterprise_office_address?.province ? (
                      <menu className="flex flex-col gap-2">
                        <p className="text-[15px]">
                          Province <span className="text-red-600">*</span>
                        </p>
                        <ul className="flex items-center gap-4">
                          <p className="p-1 px-3 text-[14px] bg-background w-fit rounded-md shadow-sm">
                            {
                              provicesList?.find(
                                (province) =>
                                  province.code ===
                                  enterprise_office_address?.province
                              )?.name
                            }
                          </p>
                          <Button
                            styled={false}
                            value="Change"
                            className="!text-[12px] hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              resetCompanyLocation();
                            }}
                          />
                        </ul>
                      </menu>
                    ) : (
                      <Select
                        {...field}
                        required
                        label="Province"
                        placeholder="Select province"
                        options={provicesList?.map((province) => {
                          return {
                            label: province.name,
                            value: province.code,
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("district", "");
                          setValue("sector", "");
                          setValue("cell", "");
                          setValue("village", "");
                        }}
                      />
                    )}
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
              rules={{ required: "Select district of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    {enterprise_office_address?.district ? (
                      <menu className="flex flex-col gap-2">
                        <p className="text-[15px]">
                          District <span className="text-red-600">*</span>
                        </p>
                        <ul className="flex items-center gap-4">
                          <p className="p-1 px-3 text-[14px] bg-background w-fit rounded-md shadow-sm">
                            {
                              districtsList?.find(
                                (district) =>
                                  district?.code ===
                                  enterprise_office_address?.district
                              )?.name
                            }
                          </p>
                          <Button
                            styled={false}
                            value="Change"
                            className="!text-[12px] hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              resetCompanyLocation();
                            }}
                          />
                        </ul>
                      </menu>
                    ) : (
                      <Select
                        required
                        label="District"
                        placeholder="Select district"
                        options={districtsList
                          ?.filter(
                            (district) =>
                              district?.province_code === watch("province")
                          )
                          ?.map((district) => {
                            return {
                              label: district.name,
                              value: district.code,
                            };
                          })}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("sector", "");
                          setValue("cell", "");
                          setValue("village", "");
                        }}
                      />
                    )}
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
              rules={{ required: "Select sector of residence" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    {enterprise_office_address?.sector ? (
                      <menu className="flex flex-col gap-2">
                        <p className="text-[15px]">
                          Sector <span className="text-red-600">*</span>
                        </p>
                        <ul className="flex items-center gap-4">
                          <p className="p-1 px-3 text-[14px] bg-background w-fit rounded-md shadow-sm">
                            {
                              sectorsList?.find(
                                (sector) =>
                                  sector?.code ===
                                  enterprise_office_address?.sector
                              )?.name
                            }
                          </p>
                          <Button
                            styled={false}
                            value="Change"
                            className="!text-[12px] hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              resetCompanyLocation();
                            }}
                          />
                        </ul>
                      </menu>
                    ) : (
                      <Select
                        {...field}
                        required
                        label="Sector"
                        placeholder="Select sector"
                        options={sectorsList
                          ?.filter(
                            (sector) =>
                              sector?.district_code === watch("district")
                          )
                          ?.map((sector) => {
                            return {
                              label: sector.name,
                              value: sector.code,
                            };
                          })}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("cell", "");
                          setValue("village", "");
                        }}
                      />
                    )}
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
                    {enterprise_office_address?.cell ? (
                      <menu className="flex flex-col gap-2">
                        <p className="text-[15px]">
                          Cell <span className="text-red-600">*</span>
                        </p>
                        <ul className="flex items-center gap-4">
                          <p className="p-1 px-3 text-[14px] bg-background w-fit rounded-md shadow-sm">
                            {
                              cellsList?.find(
                                (cell) =>
                                  cell?.code === enterprise_office_address?.cell
                              )?.name
                            }
                          </p>
                          <Button
                            styled={false}
                            value="Change"
                            className="!text-[12px] hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              resetCompanyLocation();
                            }}
                          />
                        </ul>
                      </menu>
                    ) : (
                      <Select
                        {...field}
                        required
                        label="Cell"
                        placeholder="Select cell"
                        options={cellsList
                          ?.filter(
                            (cell) => cell?.sector_code === watch("sector")
                          )
                          ?.map((cell) => {
                            return {
                              label: cell.name,
                              value: cell.code,
                            };
                          })}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("village", "");
                        }}
                      />
                    )}
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
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    {enterprise_office_address?.village ? (
                      <menu className="flex flex-col gap-2">
                        <p className="text-[15px]">
                          Village <span className="text-red-600">*</span>
                        </p>
                        <ul className="flex items-center gap-4">
                          <p className="p-1 px-3 text-[14px] bg-background w-fit rounded-md shadow-sm">
                            {
                              villagesList?.find(
                                (village) =>
                                  village?.code ===
                                  enterprise_office_address?.village
                              )?.name
                            }
                          </p>
                          <Button
                            styled={false}
                            value="Change"
                            className="!text-[12px] hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              resetCompanyLocation();
                            }}
                          />
                        </ul>
                      </menu>
                    ) : (
                      <Select
                        {...field}
                        required
                        label="Village"
                        placeholder="Select village"
                        options={villagesList
                          ?.filter(
                            (village) => village?.cell_code === watch("cell")
                          )
                          ?.map((village) => {
                            return {
                              label: village.name,
                              value: village.code,
                            };
                          })}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
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
              defaultValue={watch("street_name")}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      defaultValue={watch("street_name")}
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
            {status === "is_amending" && (
              <Button
                submit
                value={isLoading?.amend ? <Loader /> : "Complete Amendment"}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors).length > 0) return;
                  setIsLoading({
                    ...isLoading,
                    preview: false,
                    submit: false,
                    amend: true,
                  });
                }}
              />
            )}
            {['in_preview', 'action_required'].includes(status) && (
              <Button
                value={
                  isLoading?.preview ? <Loader /> : "Save & Complete Review"
                }
                primary
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors)?.length) {
                    return;
                  }
                  dispatch(
                    setUserApplications({ entry_id, status: "in_preview" })
                  );

                  setIsLoading({
                    ...isLoading,
                    preview: true,
                    submit: false,
                    amend: false,
                  });
                }}
                submit
                disabled={isFormDisabled}
              />
            )}
            <Button
              value={isLoading?.submit ? <Loader /> : "Save & Continue"}
              onClick={async () => {
                await trigger();
                if (Object.keys(errors)?.length) {
                  return;
                }
                setIsLoading({
                  ...isLoading,
                  preview: false,
                  submit: true,
                  amend: false,
                });
                if ((['in_preview', 'action_required'].includes(status)))
                  dispatch(
                    setUserApplications({ entry_id, status: "in_progress" })
                  );
              }}
              primary
              submit
              disabled={isFormDisabled}
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default OfficeAddress;
