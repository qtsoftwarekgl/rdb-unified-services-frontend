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
import { useNavigate } from "react-router-dom";
import {
  setToken,
  setUser,
  setUserAuthenticated,
} from "../../states/features/userSlice";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { RDBVerifierAndApproverEmailPattern } from "../../constants/Users";
import { useLoginMutation } from "@/states/api/auth";

const Login = () => {
  // LOCALES
  const { t } = useTranslation();

  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { infoModal } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // LOGIN PAYLOAD OBJECT
  interface LoginPayload {
    email: string;
    password: string;
  }
  const [
    login,
    {
      isLoading: isLoginLoading,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
      data: loginData,
    },
  ] = useLoginMutation();

  // HANDLE SUBMIT
  const onSubmit: SubmitHandler<FieldValues | LoginPayload> = async (data) => {
    if (data?.email?.includes("admin")) {
      await login({
        email: data.email,
        password: data.password,
      });
      console.log(">>>>>>>>>>>>>>>>>>>>>@@@@@@@@@@@@>", loginData);
      // return navigate("/super-admin/dashboard");
      return;
    } else {
      toast.success("Login successful. Redirecting...");
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        dispatch(setUser(data));
        dispatch(setUserAuthenticated(true));
        if (RDBVerifierAndApproverEmailPattern.test(data.email)) {
          return navigate("/back-office/dashboard");
        }
        if (data?.email?.includes("info")) {
          return navigate("/admin/dashboard");
        }
        return navigate("/services");
      }, 1000);
    }
  };

  console.log(
    ">>>>>>>>>>>>>>>>",
    loginData,
    isLoading,
    isLoginSuccess,
    isLoginError,
    loginError
  );

  useEffect(() => {
    if (isLoginSuccess) {
      toast.success("Login successful. Redirecting to Dashboard");
      dispatch(setUser(loginData?.data?.user || ""));
      dispatch(setToken(loginData?.data?.token) || "");
    } else if (isLoginError) {
      if (loginError?.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(loginError?.data?.message);
      }
    }
  }, [isLoginSuccess, isLoginError, loginData, dispatch, navigate]);

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
              value={isLoginLoading || isLoading ? <Loader /> : t("login")}
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
