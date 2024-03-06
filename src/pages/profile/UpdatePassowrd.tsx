import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Input from "../../components/inputs/Input";
import Divider from "../../components/Divider";
import Button from "../../components/inputs/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UpdatePassword = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues | UpdatePasswordPayload> = (
    data
  ) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Divider />
      <h3 className="mb-4 text-tertiary w-fit">Update Password</h3>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 font-semibold text-secondary">
                  <Input
                    label="Current Password"
                    type="password"
                    {...field}
                    placeholder="Enter current password"
                    icon={<FontAwesomeIcon icon={faEye} />}
                  />
                  {errors.oldPassword && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.oldPassword.message)}
                    </p>
                  )}
                </label>
              );
            }}
            name="currentPassword"
            control={control}
            rules={{
              required: "Current password is required",
            }}
          />
        </div>
        <div>
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 font-semibold text-secondary">
                  <Input
                    label="New Password"
                    type="password"
                    {...field}
                    placeholder="Enter new password"
                    icon={<FontAwesomeIcon icon={faEye} />}
                  />
                  {errors.newPassword && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.newPassword.message)}
                    </p>
                  )}
                </label>
              );
            }}
            name="newPassword"
            control={control}
            rules={{
              required: "New password is required",
            }}
          />
        </div>
        <div>
          <Controller
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 font-semibold text-secondary">
                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...field}
                    placeholder="Re-Type new password"
                    icon={<FontAwesomeIcon icon={faEye} />}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.confirmPassword.message)}
                    </p>
                  )}
                </label>
              );
            }}
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm password is required",
              validate: (value) =>
                value !== control.getFieldState("newPassword") ||
                "Passwords do not match",
            }}
          />
        </div>
      </div>
      <menu className="flex items-center justify-end gap-12">
        <Button
          submit
          primary
          value="Update"
          className="text-white !bg-primary hover:!bg-primary"
        />
      </menu>
    </form>
  );
};

export default UpdatePassword;
