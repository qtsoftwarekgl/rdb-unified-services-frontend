import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import rdb_icon from "/rdb-logo.png";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";
import validateInputs from "../../helpers/validations";
import InfoPanel from "./InfoPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import Modal from "../../components/Modal";
import { setInfoModal } from "../../states/features/authSlice";
import { toast } from "react-toastify";
import { ErrorResponse, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { useLoginMutation } from "@/states/api/userManagamentApiSlice";
import { setUser } from "@/states/features/userSlice";

const Login = () => {
  // LOCALES
  const { t } = useTranslation();

  // INITIALIZE LOGIN MUTATION
  const [login, {
    data: loginData,
    error: loginError,
    isLoading: loginIsLoading,
    isError: loginIsError,
    isSuccess: loginIsSuccess
  }] = useLoginMutation();

  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { infoModal } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE SUBMIT
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    login({
      username: data.email,
      password: data.password
    })
  };

  // HANDLE LOGIN RESPONSE
  useEffect(() => {
    if (loginIsError) {
      if ((loginError as ErrorResponse)?.status === 500) {
        toast.error("Internal server error");
      } else {
        toast.error((loginError as ErrorResponse)?.data.message);
      }
    } else if (loginIsSuccess) {
      toast.success("Login successful. Redirecting...");
      dispatch(setUser(loginData?.data));
      if (loginData?.data?.roles?.includes("PUBLIC_USER")) {
        navigate("/services");
      } else if (loginData?.data?.roles?.includes("SYSTEM_ADMIN")) {
        navigate("/admin/dashboard");
      }
    }
  }, [dispatch, loginData, loginError, loginIsError, loginIsSuccess, navigate]);

  return (
    <main className="h-[100vh] flex items-center justify-between w-full !bg-white">
      <section className="login-panel !bg-white flex flex-col items-center justify-between gap-8 w-full">
        <figure className="w-[90%] mx-auto flex items-center gap-6 justify-between max-[800px]:flex-col-reverse">
          <img src={rdb_icon} alt="RDB Logo" className="mx-auto" />
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault();
              dispatch(setInfoModal(true));
            }}
            className="text-primary cursor-pointer ease-in-out duration-200 hover:scale-[1.02] lg:hidden"
            icon={faCircleInfo}
          />
        </figure>
        <h1 className="text-2xl font-semibold uppercase text-primary">
          {t("login")}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-[50%] max-[1200px]:max-w-[55%] max-[1000px]:max-w-[60%] max-[800px]:max-w-[50%] max-[650px]:max-w-[55%] max-[600px]:max-w-[60%] max-[550px]:max-w-[65%] max-[500px]:max-w-[70%] max-[450px]:max-w-[75%]"
        >
          <Controller
            rules={{
              required: "Email is required",
              validate: (value) => {
                return (
                  validateInputs(value, "email") || "Invalid email address"
                );
              },
            }}
            name="email"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    placeholder={t("email-placeholder")}
                    label={t("email-label")}
                    {...field}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.email.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            rules={{ required: "Password is required" }}
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password-placeholder")}
                    label={t("password-label")}
                    suffixIcon={showPassword ? faEyeSlash : faEye}
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    {...field}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.password.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu className="flex items-center gap-3 justify-between w-full my-1 max-[1050px]:flex-col max-[800px]:flex-row max-[450px]:flex-col">
            <Input
              label={t("remember-me")}
              type="checkbox"
              onChange={(e) => {
                return e.target.checked;
              }}
            />
            <Button
              styled={false}
              className="!text-[13px]"
              value={`${t("forgot-password")}?`}
              route="/auth/reset-password/request"
            />
          </menu>
          <menu className="flex flex-col items-center gap-4 my-4">
            <Button
              submit
              primary
              value={loginIsLoading ? <Loader /> : t("login")}
              className="w-full"
            />
            <ul className="flex items-center gap-6">
              <Button
                className="!text-[14px]"
                value={t("register")}
                styled={false}
                route="/auth/register"
              />
              <hr className="border-[.5px] border-primary h-[20px]" />
              <Button
                className="!text-[14px]"
                value="Institution registration"
                styled={false}
                route="/auth/register/institution"
              />
            </ul>
          </menu>
        </form>
      </section>
      <article className="w-full h-full max-[800px]:hidden">
        <InfoPanel />
      </article>
      <Modal
        isOpen={infoModal}
        onClose={() => {
          dispatch(setInfoModal(false));
        }}
        className="!h-full"
      >
        <InfoPanel />
      </Modal>
    </main>
  );
};

export default Login;
