import Loader from "@/components/Loader";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import { validTinNumber, validUPI } from "@/constants/Users";
import { propertyData } from "@/constants/authentication";
import { filterObject } from "@/helpers/strings";
import validateInputs from "@/helpers/validations";
import { setCollateralApplications } from "@/states/features/collateralRegistrationSlice";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  entry_id: string | null;
  collateral_infos: any;
  debtor_info: any;
  collateral_type: string;
};
const CollateralForm = ({
  entry_id,
  collateral_infos,
  debtor_info,
  collateral_type,
}: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [searchInfo, setSearchInfo] = useState({
    error: false,
    loading: false,
    data: {},
  });
  const [isSubmitSuccessful, setSubmitSuccessful] = useState(false);

  const onSubmit = (data: any) => {
    setSubmitSuccessful(true);
    setTimeout(() => {
      if (Object.keys(searchInfo?.data).length)
        dispatch(
          setCollateralApplications({
            entry_id,
            secured_amount: data.secured_amount,
            secured_amount_in_words: data.value_in_words,
            collateral_infos: [
              {
                ...filterObject(data),
                debtor_id_number:
                  debtor_info?.id_number || debtor_info?.tin_number,
              },
              ...collateral_infos,
            ],
          })
        );
      else
        dispatch(
          setCollateralApplications({
            entry_id,
            secured_amount: data.secured_amount,
            secured_amount_in_words: data.value_in_words,
          })
        );
      setSubmitSuccessful(false);
      clearErrors();
      setSearchInfo({
        error: false,
        loading: false,
        data: {},
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <menu className="flex items-start w-full gap-6">
        {collateral_type === "immovable" ? (
          <Controller
            name="upi_number"
            control={control}
            defaultValue={watch("upi_number") || ""}
            rules={{
              required: !watch("upi_number") ? "UPI number is required" : false,
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    label="UPI number"
                    required
                    suffixIcon={faSearch}
                    defaultValue={watch("upi_number") || ""}
                    suffixIconPrimary
                    placeholder="XX/XX/XX/XXXX"
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
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
                        const randomNumber = Math.floor(Math.random() * 4);
                        const property_details = propertyData[randomNumber];

                        if (field?.value === String(validUPI)) {
                          setSearchInfo({
                            ...searchInfo,
                            loading: false,
                            error: false,
                            data: property_details,
                          });
                        } else {
                          setSearchInfo({
                            ...searchInfo,
                            loading: false,
                            error: true,
                            data: {},
                          });
                        }
                      }, 1000);
                    }}
                  />
                  {searchInfo?.loading &&
                    !errors?.id_number &&
                    !searchInfo?.error && (
                      <span className="flex items-center gap-[2px] text-[13px]">
                        <Loader size={4} /> Fetching property details...
                      </span>
                    )}
                  {searchInfo?.error && !searchInfo?.loading && (
                    <span className="text-red-600 text-[13px]">
                      Invalid UPI number
                    </span>
                  )}
                  {errors?.upi_number && (
                    <p className="text-red-500 text-[13px]">
                      {String(errors?.upi_number?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        ) : (
          <Controller
            name="property_tin_number"
            control={control}
            defaultValue={watch("property_tin_number") || ""}
            rules={{
              required: watch("property_tin_number)")
                ? "Property's TIN number is required"
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
                    defaultValue={watch("property_tin_number") || ""}
                    suffixIconPrimary
                    placeholder="XXXXXXXXX"
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      clearErrors("property_tin_number");
                      await trigger("property_tin_number");
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
                        const randomNumber = Math.floor(Math.random() * 4);
                        const company_details = propertyData[randomNumber];
                        if (field?.value === String(validTinNumber)) {
                          setSearchInfo({
                            ...searchInfo,
                            loading: false,
                            error: false,
                            data: company_details,
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
                    !errors?.tin_number &&
                    !searchInfo?.error && (
                      <span className="flex items-center gap-[2px] text-[13px]">
                        <Loader size={4} /> Searching for Institution...
                      </span>
                    )}
                  {searchInfo?.error && !searchInfo?.loading && (
                    <span className="text-red-600 text-[13px]">
                      Invalid TIN number
                    </span>
                  )}
                  {errors?.property_tin_number && (
                    <p className="text-red-500 text-[13px]">
                      {String(errors?.property_tin_number?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        )}
        <Controller
          name="debtor_id_number"
          defaultValue={debtor_info?.id_number || debtor_info?.tin_number || ""}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-1">
                <Input
                  label="ID number/TIN number"
                  readOnly
                  required
                  {...field}
                />
                {errors?.debtor_id_number && (
                  <p className="text-sm text-red-500">
                    {String(errors?.debtor_id_number?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
      </menu>
      {Object.keys(searchInfo?.data).length > 0 && (
        <>
          <menu className="flex items-start w-full gap-3">
            <Controller
              name="owner_names"
              control={control}
              defaultValue={searchInfo.data?.property_owner || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input readOnly label="Property Owner" {...field} />
                  </label>
                );
              }}
            />
            <Controller
              name="property_nature"
              control={control}
              defaultValue={searchInfo?.data?.property_nature || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      readOnly
                      placeholder="Debtor's DOB"
                      label="Nature of the property"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-3">
            <Controller
              name="property_location"
              control={control}
              defaultValue={searchInfo.data?.property_location || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input readOnly label="Property Location" {...field} />
                  </label>
                );
              }}
            />
            <Controller
              name="property_description"
              control={control}
              defaultValue={searchInfo?.data?.property_description || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      readOnly
                      placeholder="Debtor's DOB"
                      label="Description of the property"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <section className="border border-[#ebebeb] rounded-md p-6 flex flex-col gap-2">
            <menu className="flex items-start w-full gap-3">
              <Controller
                name="property_value"
                control={control}
                defaultValue={searchInfo.data?.property_value || ""}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input readOnly label="Value of property" {...field} />
                    </label>
                  );
                }}
              />
              <Controller
                name="evaluator_certificate_number"
                control={control}
                defaultValue={
                  searchInfo?.data?.evaluator_certificate_number || ""
                }
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input
                        readOnly
                        label="Evaluator's certification No."
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-3">
              <Controller
                name="evaluation_date"
                control={control}
                defaultValue={searchInfo.data?.date_of_evaluation || ""}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input readOnly label="Date of evaluation" {...field} />
                    </label>
                  );
                }}
              />
              <Controller
                name="valuer_name"
                control={control}
                defaultValue={searchInfo.data?.evaluator_name || ""}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input readOnly label="Valuer" {...field} />
                    </label>
                  );
                }}
              />
            </menu>
          </section>
          <section className="flex flex-col gap-2">
            <h1 className="font-bold">Other Owners</h1>
            <menu className="flex flex-col border p-6  border-[#ebebeb] rounded-md ">
              {searchInfo.data?.other_owners?.map(
                (owner: any, index: number) => {
                  return (
                    <menu className="flex">
                      <menu
                        className="flex items-start w-full gap-3"
                        key={index}
                      >
                        <p>{owner.name}</p>
                      </menu>
                      <menu
                        className="flex items-start w-full gap-3"
                        key={index}
                      >
                        <p>{owner.id_number}</p>
                      </menu>
                    </menu>
                  );
                }
              )}
            </menu>
          </section>
        </>
      )}
      <menu className="flex items-center justify-end w-full gap-3">
        <Button
          submit
          primary
          value={isSubmitSuccessful ? <Loader /> : "Add"}
          disabled={
            Object.keys(errors).length > 0 ||
            Object.keys(searchInfo.data).length === 0
          }
        />
      </menu>
    </form>
  );
};

export default CollateralForm;
