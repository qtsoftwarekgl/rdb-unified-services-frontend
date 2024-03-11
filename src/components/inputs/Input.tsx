import { FC, MouseEventHandler, ReactNode, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
import DatePicker from "./DatePicker";

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number;
  submit?: boolean;
  type?: string;
  value?: string | number;
  suffixIcon?: IconProp;
  prefixIcon?: IconProp;
  suffixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
  name?: string;
  suffixIconPrimary?: boolean;
  prefixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
  prefixIconPrimary?: boolean;
  prefixText?: string | ReactNode;
  checked?: boolean;
  accept?: string;
  min?: string | number;
  readOnly?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  label = null,
  placeholder,
  className,
  required = false,
  value,
  onChange,
  defaultValue,
  suffixIcon = null,
  suffixIconHandler,
  suffixIconPrimary = false,
  prefixIcon = null,
  prefixIconHandler,
  prefixText = null,
  checked = null,
  name,
  accept = "*",
  min,
  readOnly = false,
}) => {
  const hiddenFileInput = useRef(null);

  if (["checkbox", "radio"].includes(type)) {
    return (
      <label className="flex items-center gap-2">
        <input
          type={type}
          name={name}
          checked={checked}
          onChange={onChange}
          className={`w-5 h-5 border-[1.5px] rounded-xl cursor-pointer border-secondary outline-none focus:outline-none accent-primary focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
        <span className={`${label ? "text-[13px]" : "hidden"}`}>{label}</span>
      </label>
    );
  }

  if (type === "file") {
    const handleClick = () => {
      hiddenFileInput?.current?.click();
    };
    return (
      <menu className="text-[12px] w-full">
        <button
          type="button"
          onClick={handleClick}
          className={`!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm py-2 w-full text-[12px] text-center max-[800px]:!text-[14px] px-6 rounded-md cursor-pointer ease-in-out duration-400 hover:scale-[1.005] ${className}`}
        >
          Choose file
        </button>
        <input
          ref={hiddenFileInput}
          type={type}
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </menu>
    );
  }

  if (["date"].includes(type)) {
    return (
      <label className="flex flex-col gap-[5px] w-full">
        <p
          className={`${
            label ? "flex items-center gap-[5px] text-[14px]" : "hidden"
          }`}
        >
          {label}{" "}
          <span className={required ? "text-[14px] text-red-600" : "hidden"}>
            *
          </span>
        </p>
        <DatePicker onChange={onChange} />
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-[5px] w-full">
      <p
        className={`${
          label ? "flex items-center gap-[5px] text-[14px]" : "hidden"
        }`}
      >
        {label}{" "}
        <span className={required ? "text-[14px] text-red-600" : "hidden"}>
          *
        </span>
      </p>
      {!prefixIcon && !prefixText && !suffixIcon && (
        <input
          defaultValue={defaultValue}
          min={min}
          value={value && value}
          type={type || 'text'}
          readOnly={readOnly}
          onChange={onChange}
          placeholder={placeholder}
          className={`py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
      )}
      <section className="relative w-full">
        {(prefixIcon || prefixText) && (
          <menu className="relative w-full">
            <label className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <Link to={"#"} onClick={prefixIconHandler} className="">
                {prefixIcon && (
                  <FontAwesomeIcon className="text-current" icon={prefixIcon} />
                )}
                {prefixText && <p className="text-[14px]">{prefixText}</p>}
              </Link>
            </label>
            <input
              defaultValue={defaultValue}
              value={value && value}
              type={type || 'text'}
              readOnly={readOnly}
              onChange={onChange}
              placeholder={placeholder}
              className={`py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}
              ${prefixIcon ? `ps-10` : ""} ${prefixText ? "ps-[3.6rem]" : ""} `}
            />
          </menu>
        )}
        {suffixIcon && (
          <menu className="flex items-center">
            <Link
              to={"#"}
              onClick={suffixIconHandler}
              className={`${
                !suffixIcon && "hidden"
              } absolute top-0 end-0 p-2.5 px-3.5 text-sm font-medium h-full rounded-e-lg border focus:outline-none ${
                suffixIconPrimary
                  ? "bg-primary text-white border-primary border-l-none"
                  : "border-secondary border-opacity-50 bg-white text-primary border-l-none"
              }`}
            >
              <FontAwesomeIcon icon={suffixIcon || faSearch} />
            </Link>
            <input
              defaultValue={defaultValue}
              value={value && value}
              type={type || "text"}
              onChange={onChange}
              readOnly={readOnly}
              placeholder={placeholder}
              className={`${
                prefixText && "!ml-16 !w-[85%]"
              } py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className} ${
                prefixIcon &&
                "!ml-[45px] !w-[90%] !border-l-none !rounded-l-none !ps-3.5"
              }`}
            />
          </menu>
        )}
      </section>
    </label>
  );
};

export default Input;
