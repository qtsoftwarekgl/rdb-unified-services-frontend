import { Controller, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import moment from "moment";
import { countriesList } from "../../constants/Countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface IForeignUserDetails {
  userDetails: any;
  enterprise_details: any;
}

const ForeignUserDetails = ({
  userDetails,
  enterprise_details,
}: IForeignUserDetails) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );

  return (
    userDetails &&
    userDetails.document_type === "passport" && (
      <section>
        <menu className="flex items-start gap-6 max-sm:flex-col">
          <Controller
            name="passport_no"
            control={control}
            rules={{ required: "Passport No is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    label="Passport No"
                    required
                    {...field}
                    defaultValue={
                      userDetails?.passport_no ||
                      enterprise_details?.passport_no
                    }
                  />
                  {errors?.documentNo && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.passport_no?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="passport_expiry_date"
            rules={{
              required: "Select Passport Expiry Date",
              validate: (value) => {
                if (moment(value).format() < moment(new Date()).format()) {
                  return "Select a Passport Expiry Date";
                }
                return true;
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    label="Passport Expiry Date"
                    type="date"
                    required
                    {...field}
                    defaultValue={
                      userDetails?.passport_expiry_date ||
                      enterprise_details?.passport_expiry_date
                    }
                  />
                  {errors?.passport_expiry_date && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.passport_expiry_date?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start gap-6 max-sm:flex-col">
          <Controller
            control={control}
            name="first_name"
            defaultValue={
              watch("firstName") ||
              userDetails?.first_name ||
              enterprise_details?.first_name
            }
            rules={{ required: "First name is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="First Name"
                    required
                    defaultValue={
                      watch("first_name") ||
                      userDetails?.first_name ||
                      enterprise_details?.first_name
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-500">
                      {String(errors.first_name.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="middle_name"
            defaultValue={
              watch("middle_name") ||
              userDetails?.middle_name ||
              enterprise_details?.middle_name
            }
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Middle Name"
                    defaultValue={
                      watch("middle_name") ||
                      userDetails?.middle_name ||
                      enterprise_details?.middle_name
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start gap-6 max-sm:flex-col">
          <Controller
            control={control}
            name="last_name"
            defaultValue={
              watch("last_name") ||
              userDetails?.last_name ||
              enterprise_details?.last_name
            }
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Last Name"
                    defaultValue={
                      watch("last_name") ||
                      userDetails?.last_name ||
                      enterprise_details?.last_name
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-500">
                      {String(errors.last_name.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="date_of_birth"
            defaultValue={
              watch("date_of_birth") ||
              userDetails?.date_of_birth ||
              enterprise_details?.date_of_birth
            }
            rules={{ required: "Date of birth is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Date of Birth"
                    required
                    defaultValue={
                      watch("date_of_birth") ||
                      userDetails?.date_of_birth ||
                      enterprise_details?.date_of_birth
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.date_of_birth && (
                    <p className="text-xs text-red-500">
                      {String(errors.date_of_birth.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start gap-6 max-sm:flex-col ">
          <Controller
            control={control}
            name="nationality"
            defaultValue={
              watch("nationality") ||
              userDetails?.nationality ||
              enterprise_details?.national
            }
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-1">
                  <Input
                    defaultValue={
                      watch("nationality") ||
                      userDetails?.nationality ||
                      enterprise_details?.national
                    }
                    label="Nationality"
                    {...field}
                  />
                  {errors?.nationality && (
                    <p className="text-sm text-red-500">
                      {String(errors?.nationality?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="country"
            defaultValue={
              watch("country") ||
              enterprise_details?.country ||
              userDetails?.country
            }
            rules={{ required: "Country is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Country"
                    required
                    defaultValue={
                      watch("country") ||
                      enterprise_details?.country ||
                      userDetails?.country
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.country && (
                    <p className="text-xs text-red-500">
                      {String(errors.country.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start gap-6 max-sm:flex-col ">
          <Controller
            control={control}
            name="gender"
            defaultValue={
              watch("gender") ||
              userDetails?.gender ||
              enterprise_details?.gender
            }
            rules={{ required: "Gender is required" }}
            render={({ field }) => {
              return (
                <label className="flex items-center w-full gap-2 py-4">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<span className="text-red-500">*</span>
                  </p>
                  <menu className="flex items-center gap-4">
                    <Input
                      type="radio"
                      label="Male"
                      checked={
                        watch("gender") === "Male" ||
                        userDetails?.gender === "Male"
                      }
                      {...field}
                    />

                    <Input
                      type="radio"
                      label="Female"
                      {...field}
                      checked={
                        watch("gender") === "Female" ||
                        userDetails?.gender === "Female"
                      }
                    />
                  </menu>
                  {errors?.gender && (
                    <span className="text-sm text-red-500">
                      {String(errors?.gender?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          {/* <Controller
            control={control}
            name="pob"
            defaultValue={
              watch("pob") || enterprise_details?.pob || userDetails?.pob
            }
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="P O Box"
                    defaultValue={
                      watch("pob") ||
                      enterprise_details?.pob ||
                      userDetails?.pob
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                </label>
              );
            }}
          /> */}
        </menu>
        <menu className="flex items-start gap-6 max-sm:flex-col">
          <Controller
            control={control}
            name="email"
            defaultValue={
              watch("email") || enterprise_details?.email || userDetails?.email
            }
            rules={{ required: "Email is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Email"
                    required
                    defaultValue={
                      watch("email") ||
                      enterprise_details?.email ||
                      userDetails?.email
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {String(errors.email.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone number is required",
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-1/2 gap-1">
                  <p className="flex items-center gap-1">
                    Phone number <span className="text-red-600">*</span>
                  </p>
                  <menu className="relative flex items-center gap-0">
                    <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                      <select
                        className="w-full !text-[12px]"
                        defaultValue={
                          userDetails?.phone || enterprise_details?.phone
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {countriesList?.map((country) => {
                          return (
                            <option
                              key={country?.dial_code}
                              value={country?.dial_code}
                            >
                              {`${country?.code} ${country?.dial_code}`}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                    <input
                      onChange={field.onChange}
                      className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                      type="text"
                    />
                  </menu>
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
        <menu className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center">
          <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
            Attachment <span className="text-red-600">*</span>
          </h3>
          <Controller
            name="attachment"
            rules={{ required: "Document attachment is required" }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                  <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                    <Input
                      type="file"
                      accept="application/pdf,image/*"
                      className="!w-fit max-sm:!w-full"
                      onChange={(e) => {
                        field.onChange(e?.target?.files?.[0]);
                        setAttachmentFile(e?.target?.files?.[0]);
                      }}
                    />
                    {attachmentFile && (
                      <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                        {attachmentFile?.name}
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentFile(null);
                            setValue("attachment", null);
                          }}
                        />
                      </p>
                    )}
                  </ul>
                  {errors?.attachment && (
                    <p className="text-sm text-red-500">
                      {String(errors?.attachment?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
      </section>
    )
  );
};

export default ForeignUserDetails;
