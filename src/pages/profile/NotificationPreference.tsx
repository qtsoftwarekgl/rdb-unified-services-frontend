import { Controller, useForm, FieldValues, Control } from "react-hook-form";
import Input from "../../components/inputs/Input";
import validateInputs from "../../helpers/Validations";
import Divider from "../../components/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

interface NotificationPreferenceProps {
  control: Control<FieldValues, unknown, FieldValues>;
}

const NotificationPreference = ({ control }: NotificationPreferenceProps) => {
  const {
    formState: { errors },
  } = useForm();

  return (
    <form>
      <Divider />
      <h3 className="mb-4 text-tertiary w-fit">
        Update Notification Preference
      </h3>
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="w-full md:w-1/2">
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 font-semibold text-secondary">
                  <Input
                    label="Email Address"
                    {...field}
                    placeholder="sandra@gmail.com"
                    icon={<FontAwesomeIcon icon={faEnvelope} />}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.email.message)}
                    </p>
                  )}
                </label>
              );
            }}
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              validate: (value) => {
                return (
                  validateInputs(value, "email") || "Invalid email address"
                );
              },
            }}
          />
        </div>
        <div className="w-full md:w-1/2">
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 font-semibold text-secondary">
                  <Input
                    label="Phone Number"
                    {...field}
                    placeholder="+25074656765"
                    icon={<FontAwesomeIcon icon={faPhone} />}
                  />
                </label>
              );
            }}
            name="phoneNumber"
            control={control}
            rules={{
              required: "Phone number is required",
              validate: (value) => {
                return validateInputs(value, "tel") || "Invalid phone number";
              },
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default NotificationPreference;
