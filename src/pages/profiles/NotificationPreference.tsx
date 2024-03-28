import {
  Controller,
  useForm,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import Input from "../../components/inputs/Input";
import validateInputs from "../../helpers/validations";
import Divider from "../../components/Divider";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";

interface UserPreferencePayload {
  email: string;
  phoneNumber: string;
}

const NotificationPreference = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues | UserPreferencePayload> = (
    data
  ) => {
    return data;
  };

  return (
    <section>
      <Divider />
      <h3 className="mb-4 text-tertiary w-fit">
        Update Notification Preference
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
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
                      prefixIcon={faEnvelope}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">
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
                      placeholder="+25078656765"
                      prefixIcon={faPhone}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600">
                        {String(errors.phoneNumber.message)}
                      </p>
                    )}
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
        <menu className="flex items-center justify-end gap-12">
          <Button
            value="Cancel"
            className="bg-white border border-primary text-primary hover:!bg-primary hover:!text-white"
          />
          <Button
            submit
            primary
            value="Save Changes"
            className="text-white !bg-primary hover:!bg-primary"
          />
        </menu>
      </form>
    </section>
  );
};

export default NotificationPreference;
