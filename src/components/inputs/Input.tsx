import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
  search?: boolean;
  icon?: React.ReactNode;
}

const Input: FC<InputProps> = ({
  type = "text",
  label = null,
  placeholder,
  className,
  required = false,
  search = false,
  icon = null,
  value,
  onChange,
  defaultValue,
}) => {
  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2">
        <input
          type={type}
          onChange={onChange}
          className={`w-5 h-5 border-[1.5px] rounded-xl cursor-pointer border-secondary outline-none focus:outline-none accent-primary focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
        <span className={`${label ? "text-[13px]" : "hidden"}`}>{label}</span>
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
      {!search && !icon && (
        <input
          defaultValue={defaultValue}
          value={value && value}
          type={type || "text"}
          onChange={onChange}
          placeholder={placeholder}
          className={`py-[10px] px-4 font-normal placeholder:!font-light placeholder:italic flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
      )}
      {(search || icon) && (
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            {icon && icon}
          </div>
          <input
            defaultValue={defaultValue}
            value={value && value}
            type={type || "text"}
            onChange={onChange}
            placeholder={placeholder}
            className={`py-[10px] px-4 font-normal placeholder:!font-light placeholder:italic flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className} ${
              icon ? "ps-10" : ""
            }`}
          />
          {search && (
            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-primary rounded-e-lg border border-primary focus:outline-none "
            >
              <FontAwesomeIcon icon={faSearch} />
              <span className="sr-only">Search</span>
            </button>
          )}
        </div>
      )}
    </label>
  );
};

export default Input;
