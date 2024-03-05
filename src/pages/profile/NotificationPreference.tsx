import {
  Controller,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import Input from "../../components/inputs/Input";

const NotificationPreference = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  interface UserPreferencePayload {
    email: string;
    phoneNumber: string;
  }

  const onSubmit: SubmitHandler<FieldValues | UserPreferencePayload> = (
    data
  ) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="mb-2 text-primary">Update Notification Preference</h3>
      <div className="flex items-center gap-12">
        <div className="w-1/2">
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    label="Email Address"
                    {...field}
                    placeholder="sandra@gmail.com"
                  />
                </label>
              );
            }}
            name="email"
            control={control}
          />
        </div>
        <div className="w-1/2">
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    label="Phone Number"
                    {...field}
                    placeholder="+25074656765"
                  />
                </label>
              );
            }}
            name="phoneNumber"
            control={control}
          />
        </div>
      </div>
    </form>
  );
};

export default NotificationPreference;
