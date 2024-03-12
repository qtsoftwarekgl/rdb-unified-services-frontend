import { Controller, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import { dummyPhones } from "../../constants/BusinessRegistration";
import Select from "../../components/inputs/Select";

interface DomesticUserDetailsProps {
  userDetails: any;
  enterprise_details: any;
}

const DomesticUserDetails = ({
  userDetails,
  enterprise_details,
}: DomesticUserDetailsProps) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useForm();

  return (
    userDetails &&
    userDetails.document_type === "nid" &&
    Object.keys(userDetails).length > 3 && (
      <section>
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
        <Controller
          control={control}
          name="gender"
          defaultValue={
            watch("gender") || userDetails?.gender || enterprise_details?.gender
          }
          rules={{ required: "Gender is required" }}
          render={({ field }) => {
            const gender = watch("gender");
            return (
              <label className="flex items-center w-full gap-2 py-4">
                <p className="flex items-center gap-1 text-[15px]">
                  Gender<span className="text-red-500">*</span>
                </p>
                <menu className="flex items-center gap-4">
                  {gender === "Male" && (
                    <Input
                      type="radio"
                      label="Male"
                      checked={watch("gender") === "Male"}
                      {...field}
                    />
                  )}
                  {gender === "Female" && (
                    <Input
                      type="radio"
                      label="Female"
                      {...field}
                      checked={watch("gender") === "Female"}
                    />
                  )}
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
                    readOnly
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
            name="phone"
            control={control}
            defaultValue={
              watch("phone") || enterprise_details?.phone || userDetails?.phone
            }
            rules={{ required: "Phone is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Select
                    label="Phone"
                    required
                    options={dummyPhones}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                    defaultValue={dummyPhones.find(
                      (type) =>
                        type.value === enterprise_details?.phone ||
                        userDetails?.phone
                    )}
                  />
                  {errors?.documentType && (
                    <p className="text-xs text-red-500">
                      {String(errors?.documentType?.message)}
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
                    readOnly
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
          <Controller
            control={control}
            name="province"
            defaultValue={
              watch("province") ||
              enterprise_details?.province ||
              userDetails?.province
            }
            rules={{ required: "Province is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Province"
                    readOnly
                    required
                    defaultValue={
                      watch("province") ||
                      enterprise_details?.province ||
                      userDetails?.province
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.province && (
                    <p className="text-xs text-red-500">
                      {String(errors.province.message)}
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
            name="district"
            defaultValue={
              watch("district") ||
              enterprise_details?.district ||
              userDetails?.district
            }
            rules={{ required: "District is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="District"
                    readOnly
                    required
                    defaultValue={
                      watch("district") ||
                      enterprise_details?.district ||
                      userDetails?.district
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.district && (
                    <p className="text-xs text-red-500">
                      {String(errors.district.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="sector"
            defaultValue={
              watch("sector") ||
              enterprise_details?.sector ||
              userDetails?.sector
            }
            rules={{ required: "Sector is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Sector"
                    readOnly
                    required
                    defaultValue={
                      watch("sector") ||
                      enterprise_details?.sector ||
                      userDetails?.sector
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.sector && (
                    <p className="text-xs text-red-500">
                      {String(errors.sector.message)}
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
            name="cell"
            defaultValue={
              watch("cell") || enterprise_details?.cell || userDetails?.cell
            }
            rules={{ required: "Cell is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Cell"
                    readOnly
                    required
                    defaultValue={
                      watch("cell") ||
                      enterprise_details?.cell ||
                      userDetails?.cell
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.cell && (
                    <p className="text-xs text-red-500">
                      {String(errors.cell.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="village"
            defaultValue={
              watch("village") ||
              enterprise_details?.village ||
              userDetails?.village
            }
            rules={{ required: "Village is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-1/2 gap-2">
                  <Input
                    label="Village"
                    readOnly
                    required
                    defaultValue={
                      watch("village") ||
                      enterprise_details?.village ||
                      userDetails?.village
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                  {errors.village && (
                    <p className="text-xs text-red-500">
                      {String(errors.village.message)}
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
          />
        </menu>
      </section>
    )
  );
};

export default DomesticUserDetails;
