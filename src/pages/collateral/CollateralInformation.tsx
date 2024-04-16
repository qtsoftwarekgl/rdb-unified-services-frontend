import Loader from "@/components/Loader";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import { validTinNumber, validUPI } from "@/constants/Users";
import { propertyData } from "@/constants/authentication";
import validateInputs from "@/helpers/validations";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  entry_id: string | null;
  collateral_info: any;
  debtor_info: any;
  collateral_type: string;
};

const CollateralInformation = ({
  entry_id,
  collateral_info,
  debtor_info,
  collateral_type,
}: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm();
  const [searchInfo, setSearchInfo] = useState({
    error: false,
    loading: false,
    data: {},
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  console.log(">>>>>>>>>>>>>>>", errors);
  return (
    <section className="flex flex-col gap-8 max-md:w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <menu className="flex items-start w-full gap-6">
          {collateral_type === "immovable" ? (
            <Controller
              name="upi_number"
              control={control}
              defaultValue={watch("upi_number") || ""}
              rules={{
                required: watch("upi_number")
                  ? "UPI number is required"
                  : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      label="UPI number"
                      required
                      suffixIcon={faSearch}
                      defaultValue={
                        watch("upi_number") || collateral_info?.id_number || ""
                      }
                      suffixIconPrimary
                      placeholder="XX/XX/XX/XXXX"
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        clearErrors("upi_number");
                        await trigger("upi_number");
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
              name="property_tin_number"
              control={control}
              defaultValue={
                watch("property_tin_number") ||
                collateral_info?.tin_number ||
                ""
              }
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
                      defaultValue={
                        watch("property_tin_number") ||
                        collateral_info?.tin_number ||
                        ""
                      }
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
                          const randomNumber = Math.floor(Math.random() * 10);
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
            defaultValue={
              debtor_info?.id_number || debtor_info.tin_number || ""
            }
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
                defaultValue={
                  searchInfo?.data?.property_nature ||
                  collateral_info?.property_nature ||
                  ""
                }
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
                defaultValue={
                  searchInfo?.data?.property_description ||
                  collateral_info?.property_description ||
                  ""
                }
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
                    searchInfo?.data?.evaluator_certificate_number ||
                    collateral_info?.evaluator_certificate_number ||
                    ""
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
                  defaultValue={searchInfo.data?.evaluation_date || ""}
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
                  defaultValue={searchInfo.data?.valuer_name || ""}
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
        <section className="border border-[#ebebeb] rounded-md p-6 flex flex-col gap-2">
          <menu className="flex items-start w-full gap-3">
            <Controller
              name="secured_amount"
              control={control}
              rules={{
                required: !watch("secured_amount")
                  ? "Secured amount is required"
                  : false,
              }}
              defaultValue={watch("secured_amount") || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input required label="Secured amount" {...field} />
                    {errors?.secured_amount && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.secured_amount?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="value_in_words"
              control={control}
              rules={{
                required: !watch("value_in_words")
                  ? "Value in words is required"
                  : false,
              }}
              defaultValue={watch("value_in_words") || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input required label="Value in words" {...field} />
                    {errors?.value_in_words && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.value_in_words?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
        </section>
        <menu className="flex items-center justify-end w-full gap-3">
          <Button
            submit
            primary
            value={"Add Collateral"}
            disabled={Object.keys(errors).length > 0}
          />
        </menu>
      </form>
    </section>
  );
};

export default CollateralInformation;
