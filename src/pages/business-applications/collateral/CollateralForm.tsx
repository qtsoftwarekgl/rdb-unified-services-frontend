import Loader from "@/components/Loader";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { validPlateNumber, validUPI } from "@/constants/Users";
import { propertyData, vehicleData } from "@/constants/authentication";
import { integerToWords } from "@/constants/integerToWords";
import { filterObject, generateUUID } from "@/helpers/strings";
import validateInputs from "@/helpers/validations";
import { setCollateralApplications } from "@/states/features/collateralRegistrationSlice";
import { RootState } from "@/states/store";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  entryId: string | null;
  collateral_infos: any;
  debtor_info: any;
  collateral_type: string;
};
const CollateralForm = ({
  entryId,
  collateral_infos,
  debtor_info,
  collateral_type,
}: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    clearErrors,
    setValue,
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

  useEffect(() => {
    if (Object.keys(searchInfo.data).length) {
      setValue("owner_names", searchInfo.data.property_owner);
      setValue("property_nature", searchInfo.data.property_nature);
      setValue("property_location", searchInfo.data.property_location);
      setValue("property_description", searchInfo.data.property_description);
      setValue("property_value", searchInfo.data.property_value);
      setValue(
        "evaluator_certificate_number",
        searchInfo.data.evaluator_certificate_number
      );
      setValue("evaluation_date", searchInfo.data.date_of_evaluation);
      setValue("valuer_name", searchInfo.data.evaluator_name);
    } else {
      setValue("owner_names", "");
      setValue("property_nature", "");
      setValue("property_location", "");
      setValue("property_description", "");
      setValue("property_value", "");
      setValue("evaluator_certificate_number", "");
      setValue("evaluation_date", "");
      setValue("valuer_name", "");
    }
  }, [searchInfo.data]);

  const onSubmit = (data: any) => {
    setSubmitSuccessful(true);
    setTimeout(() => {
      if (
        Object.keys(searchInfo?.data).length ||
        watch("movable_collateral_type") === "other"
      )
        dispatch(
          setCollateralApplications({
            entryId,
            collateral_infos: [
              {
                ...filterObject(data),
                debtor_id_number:
                  debtor_info?.id_number || debtor_info?.tin_number,
                collateral_id: generateUUID(),
                loan_id: entryId,
                secured_amount: data.secured_amount,
                secured_amount_in_words: data.value_in_words,
                owners:
                  [
                    ...searchInfo?.data?.other_owners,
                    {
                      name: data.owner_names,
                      id_number: data.property_owner_id_number,
                    },
                  ] || [],
              },
              ...collateral_infos,
            ],
          })
        );
      else
        dispatch(
          setCollateralApplications({
            entryId,
            secured_amount: data.secured_amount,
            secured_amount_in_words: data.value_in_words,
          })
        );
      if (watch("movable_collateral_type") === "other") {
        setValue("owner_names", "");
        setValue("property_nature", "");
        setValue("property_location", "");
        setValue("property_description", "");
        setValue("property_value", "");
        setValue("evaluator_certificate_number", "");
        setValue("evaluation_date", "");
        setValue("valuer_name", "");
      }
      setSubmitSuccessful(false);
      clearErrors();
      setValue("secured_amount", "");
      setValue("value_in_words", "");
      setValue("upi_number", "");
      setValue("property_owner_id_number", "");
      setValue("vehicle_plate_number", "");
      setSearchInfo({
        error: false,
        loading: false,
        data: {},
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {collateral_type === "movable" && (
        <menu className="flex flex-col gap-8 ">
          <p>What is the type of movable collateral you want to register?</p>

          <menu className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-[#ccc] hover:cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-[#ccc] font-light text-base">
                  <p className="text-sm font-light text-black">
                    Vehicles involve cars,Trucks, Vans, Boats and motor cycles
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Controller
              name="movable_collateral_type"
              control={control}
              render={({ field }) => {
                return (
                  <ul className="flex items-center gap-3">
                    <Input
                      type="radio"
                      label="Vehicle"
                      defaultChecked={watch("movable_collateral_type") === "vehicle"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setSearchInfo({
                          error: false,
                          loading: false,
                          data: {},
                        });
                        setValue("upi_number", "");
                        setValue("vehicle_plate_number", "");
                        clearErrors();
                      }}
                      value={"vehicle"}
                    />
                    <Input
                      type="radio"
                      label="Other"
                      defaultChecked={watch("movable_collateral_type") === "other"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setSearchInfo({
                          error: false,
                          loading: false,
                          data: {},
                        });
                        setValue("upi_number", "");
                        setValue("vehicle_plate_number", "");
                        clearErrors();
                      }}
                      value={"other"}
                    />
                  </ul>
                );
              }}
            />
          </menu>
        </menu>
      )}
      {(watch("movable_collateral_type") ||
        collateral_type === "immovable") && (
        <section className="flex flex-col gap-6">
          {watch("movable_collateral_type") !== "other" && (
            <menu className="flex items-start w-full gap-6 border border-[#ebebeb] rounded-md p-6 ">
              {collateral_type === "immovable" ? (
                <Controller
                  name="upi_number"
                  control={control}
                  defaultValue={watch("upi_number") || ""}
                  rules={{
                    required: !watch("upi_number")
                      ? "UPI number is required"
                      : false,
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-1">
                        <Input
                          label="UPI number"
                          required
                          defaultValue={watch("upi_number") || ""}
                          placeholder="XX/XX/XX/XXXX"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
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
                watch("movable_collateral_type") === "vehicle" && (
                  <Controller
                    name="vehicle_plate_number"
                    control={control}
                    defaultValue={watch("vehicle_plate_number") || ""}
                    rules={{
                      required: watch("vehicle_plate_number)")
                        ? "Vehicle plate number is required"
                        : false,
                      validate: (value) => {
                        return (
                          validateInputs(value, "plate_number") ||
                          "Invalid plate number! Shoulbe be seven characters long, all letters in uppercase"
                        );
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-1">
                          <Input
                            label="Plate number"
                            required
                            defaultValue={watch("vehicle_plate_number") || ""}
                            placeholder="XXXXXXXXX"
                            {...field}
                            onChange={async (e) => {
                              field.onChange(e);
                              clearErrors("vehicle_plate_number");
                              await trigger("vehicle_plate_number");
                            }}
                          />
                          {searchInfo?.loading &&
                            !errors?.tin_number &&
                            !searchInfo?.error && (
                              <span className="flex items-center gap-[2px] text-[13px]">
                                <Loader size={4} /> Searching for vehicle...
                              </span>
                            )}
                          {searchInfo?.error && !searchInfo?.loading && (
                            <span className="text-red-600 text-[13px]">
                              Invalid Plate number
                            </span>
                          )}
                          {errors?.vehicle_plate_number && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.vehicle_plate_number?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                )
              )}
              <Controller
                name="property_owner_id_number"
                control={control}
                rules={{
                  required: "Property Owner's ID number is required",
                  validate: (value) => {
                    return (
                      validateInputs(value, "nid") ||
                      "ID number must be 16 characters long"
                    );
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-1/2 gap-1">
                      <Input
                        label="Owner ID number"
                        required
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          clearErrors("property_owner_id_number");
                          await trigger("property_owner_id_number");
                        }}
                      />
                      {errors?.property_owner_id_number && (
                        <p className="text-sm text-red-500">
                          {String(errors?.property_owner_id_number?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
          )}
          {watch("movable_collateral_type") !== "other" && (
            <menu className="flex justify-end">
              <Button
                value={searchInfo.loading ? <Loader /> : "Search"}
                disabled={
                  (!watch("upi_number") &&
                    !watch("property_owner_id_number")) ||
                  (!watch("vehicle_plate_number") &&
                    !watch("property_owner_id_number")) ||
                  Object.keys(errors).length > 0
                }
                primary
                onClick={(e) => {
                  e.preventDefault();
                  setSearchInfo({
                    ...searchInfo,
                    loading: true,
                    error: false,
                  });
                  setTimeout(() => {
                    const randomNumber = Math.floor(Math.random() * 4);
                    let property_details =
                      watch("movable_collateral_type") === "vehicle" ||
                      watch("movable_collateral_type") === "other"
                        ? vehicleData[randomNumber]
                        : propertyData[randomNumber];
                    property_details = {
                      ...property_details,
                      property_nature:
                        collateral_type === "movable"
                          ? watch("movable_collateral_type")
                          : property_details.property_nature,
                    };

                    if (
                      watch("upi_number") === String(validUPI) ||
                      watch("vehicle_plate_number") === String(validPlateNumber)
                    ) {
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
            </menu>
          )}
          {(Object.keys(searchInfo?.data).length > 0 ||
            (collateral_type === "movable" &&
              watch("movable_collateral_type") === "other")) && (
            <>
              <menu className="flex items-start w-full gap-3">
                <Controller
                  name="owner_names"
                  rules={{
                    required:
                      collateral_type === "movable"
                        ? watch("movable_collateral_type") === "vehicle"
                          ? true
                          : "Owner name is required"
                        : true,
                  }}
                  control={control}
                  defaultValue={searchInfo.data?.property_owner || ""}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-1">
                        <Input
                          readOnly={
                            collateral_type === "movable"
                              ? watch("movable_collateral_type") === "vehicle"
                                ? true
                                : false
                              : true
                          }
                          label="Owner Names"
                          placeholder="Owner names"
                          required={
                            collateral_type === "movable"
                              ? watch("movable_collateral_type") === "vehicle"
                                ? false
                                : true
                              : false
                          }
                          {...field}
                        />
                        {errors?.owner_names && (
                          <p className="text-xs text-red-500">
                            {String(errors?.owner_names.message)}
                          </p>
                        )}
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
                          readOnly={
                            collateral_type === "movable"
                              ? watch("movable_collateral_type") === "vehicle"
                                ? true
                                : false
                              : true
                          }
                          placeholder={`Nature of the ${
                            watch("movable_collateral_type") === "other"
                              ? "collateral"
                              : "property"
                          } `}
                          label="Nature of the property"
                          {...field}
                        />
                        {errors?.property_nature && (
                          <p className="text-xs text-red-500">
                            {String(errors?.property_nature.message)}
                          </p>
                        )}
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
                        <Input
                          readOnly={
                            collateral_type === "movable"
                              ? watch("movable_collateral_type") === "vehicle"
                                ? true
                                : false
                              : true
                          }
                          label="Location"
                          placeholder={`Location of the ${
                            watch("movable_collateral_type") === "other"
                              ? "collateral"
                              : "property"
                          } `}
                          {...field}
                        />
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
                          readOnly={
                            collateral_type === "movable"
                              ? watch("movable_collateral_type") === "vehicle"
                                ? true
                                : false
                              : true
                          }
                          placeholder={`Description of the ${
                            watch("movable_collateral_type") === "other"
                              ? "collateral"
                              : "property"
                          } `}
                          label="Description"
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
                    rules={{
                      required:
                        collateral_type === "movable"
                          ? watch("movable_collateral_type") === "vehicle"
                            ? true
                            : "Value of collateral is required"
                          : true,
                    }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-full gap-1">
                          <Input
                            readOnly={
                              collateral_type === "movable"
                                ? watch("movable_collateral_type") === "vehicle"
                                  ? true
                                  : false
                                : true
                            }
                            required={
                              collateral_type === "movable"
                                ? watch("movable_collateral_type") === "vehicle"
                                  ? false
                                  : true
                                : false
                            }
                            label="Value"
                            placeholder={`Value of the ${
                              watch("movable_collateral_type") === "other"
                                ? "collateral"
                                : "property"
                            } `}
                            {...field}
                          />
                          {errors?.property_value && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.property_value?.message)}
                            </p>
                          )}
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
                            readOnly={
                              collateral_type === "movable"
                                ? watch("movable_collateral_type") === "vehicle"
                                  ? true
                                  : false
                                : true
                            }
                            label="Evaluator's certification No."
                            placeholder="Evaluator's certification No."
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
                          <Input
                            type="date"
                            readOnly={
                              collateral_type === "movable"
                                ? watch("movable_collateral_type") === "vehicle"
                                  ? true
                                  : false
                                : true
                            }
                            label="Date of evaluation"
                            {...field}
                          />
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="valuer_name"
                    control={control}
                    defaultValue={searchInfo.data?.evaluator_name || ""}
                    rules={{
                      required:
                        collateral_type === "movable"
                          ? watch("movable_collateral_type") === "vehicle"
                            ? true
                            : "Valuer name is required"
                          : true,
                    }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-full gap-1">
                          <Input
                            required={
                              collateral_type === "movable"
                                ? watch("movable_collateral_type") === "vehicle"
                                  ? false
                                  : true
                                : false
                            }
                            readOnly={
                              collateral_type === "movable"
                                ? watch("movable_collateral_type") === "vehicle"
                                  ? true
                                  : false
                                : true
                            }
                            label="Valuer"
                            placeholder="Valuer Names"
                            {...field}
                          />
                          {errors?.valuer_name && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.valuer_name?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
              </section>
              {watch("movable_collateral_type") !== "other" && (
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
              )}
            </>
          )}
        </section>
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
              validate: (value) => {
                if (value <= 0) return "Secured amount must be greater than 0";
                return true;
              },
            }}
            defaultValue={watch("secured_amount") || ""}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    label="Secured amount in Rwf"
                    {...field}
                    placeholder="Secured amount"
                    onChange={(e) => {
                      field.onChange(e);
                      const words = integerToWords(+e.target.value);
                      setValue("value_in_words", words);
                      clearErrors("value_in_words");
                    }}
                    type="number"
                  />
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
            defaultValue={
              watch("value_in_words") ||
              (watch("secured_amount") &&
                integerToWords(watch("secured_amount"))) ||
              ""
            }
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <span className="text-[13px]">Amount in words (Rwf)</span>
                  <textarea
                    className="w-full capitalize p-2 border rounded-md resize-none placeholder:!font-light  placeholder:text-[13px]"
                    placeholder="Amount in words..."
                    {...field}
                    readOnly
                  />

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
          value={isSubmitSuccessful ? <Loader /> : "Add"}
          disabled={
            Object.keys(errors).length > 0 ||
            (Object.keys(searchInfo.data).length === 0 &&
              watch("movable_collateral_type") !== "other")
          }
        />
      </menu>
    </form>
  );
};

export default CollateralForm;
