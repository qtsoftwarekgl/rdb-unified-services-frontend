import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Input from "../../components/inputs/Input";
import Divider from "../../components/Divider";
import Button from "../../components/inputs/Button";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UpdatePassword = () => {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();
  const [showPassword, setShowPassword] = useState({
    password: false,
    currentPassword: false,
    confirmPassword: false,
  });

  const onSubmit: SubmitHandler<FieldValues | UpdatePasswordPayload> = (
    data
  ) => {
    console.log(data);
  };

  return (
    <section className="mb-8">
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
                      type={showPassword?.currentPassword ? "text" : "password"}
                      {...field}
                      placeholder="Enter current password"
                      suffixIcon={
                        showPassword?.currentPassword ? faEyeSlash : faEye
                      }
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        setShowPassword({
                          ...showPassword,
                          currentPassword: !showPassword?.currentPassword,
                        });
                      }}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600">
                        {String(errors.currentPassword.message)}
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
                      type={showPassword?.password ? "text" : "password"}
                      {...field}
                      placeholder="Enter new password"
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        setShowPassword({
                          ...showPassword,
                          password: !showPassword?.password,
                        });
                      }}
                      suffixIcon={showPassword?.password ? faEyeSlash : faEye}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">
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
                      type={showPassword?.confirmPassword ? "text" : "password"}
                      {...field}
                      placeholder="Re-Type new password"
                      suffixIcon={
                        showPassword?.confirmPassword ? faEyeSlash : faEye
                      }
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        setShowPassword({
                          ...showPassword,
                          confirmPassword: !showPassword?.confirmPassword,
                        });
                      }}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {String(errors.confirmPassword.message)}
                      </p>
                    )}
                  </label>
                );
              }}
              name="confirmPassword"
              control={control}
              rules={{
                required: "Re-enter your new password to confirm it",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
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
    </section>
  );
};

export default UpdatePassword;
