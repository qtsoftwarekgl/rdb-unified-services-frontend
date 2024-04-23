import { FC, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";
import Loader from "../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AppDispatch } from "../../states/store";
import { useDispatch } from "react-redux";
import { setRegistrationStep } from "../../states/features/authSlice";
import moment from "moment";
import Select from "../../components/inputs/Select";
import { countriesList } from "../../constants/countries";
import validateInputs from "../../helpers/validations";
import { useNavigate } from "react-router-dom";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import Table from "../../components/table/Table";
import { attachmentFileColumns } from "../../constants/businessRegistration";
import ViewDocument from "../user-company-details/ViewDocument";

interface ForeignRegistrationFormProps {
  isOpen: boolean;
}

const ForeignRegistrationForm: FC<ForeignRegistrationFormProps> = ({
  isOpen,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  // NAVIGATE
  const navigate = useNavigate();

  // HANDLE FORM SUBMIT
  interface Payload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }

  const onSubmit = (data: Payload | FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/auth/register/verify");
    }, 1000);
    return data;
  };

  const attachmentColumns = [
    ...attachmentFileColumns,
    {
      header: 'action',
      accesorKey: 'action',
      cell: () => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEye}
              className="bg-primary text-[12px] rounded-full text-white p-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary-dark"
              onClick={(e) => {
                e.preventDefault();
                setAttachmentPreview(URL.createObjectURL(attachmentFile));
              }}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="bg-red-600 text-[12px] rounded-full text-white p-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary-dark"
              onClick={(e) => {
                e.preventDefault();
                setAttachmentFile(null);
                setValue('attachment', null);
              }}
            />
          </menu>
        );
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-5 bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex-col gap-6 w-[70%] mx-auto flex max-[1200px]:w-[75%] max-[1100px]:w-[80%] max-[1000px]:w-[85%] max-lg:w-[90%] max-md:w-[95%] max-sm:w-[80%]`}
      >
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="documentNo"
            rules={{
              required: 'Document No is required',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    label="Document No"
                    required
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e?.target?.value.toUpperCase());
                      await trigger('documentNo');
                    }}
                  />
                  {errors?.documentNo && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.documentNo?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="expiryDate"
            rules={{
              required: 'Select expiry date',
              validate: (value) => {
                if (moment(value).format() < moment(new Date()).format()) {
                  return 'Expiry date cannot be in the past';
                }
                return true;
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    range
                    label="Expiry Date"
                    type="date"
                    required
                    {...field}
                  />
                  {errors?.expiryDate && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.expiryDate?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <span className="text-sm text-red-500">
                      {String(errors?.firstName?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    placeholder="Middle name"
                    label="Middle name"
                    {...field}
                  />
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input placeholder="Last name" label="Last name" {...field} />
                </label>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Select gender' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-2">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<span className="text-red-500">*</span>
                  </p>
                  <menu className="flex items-center gap-4 mt-2">
                    <Input type="radio" label="Male" {...field} value="Male" />
                    <Input
                      type="radio"
                      label="Female"
                      {...field}
                      value="Female"
                    />
                  </menu>
                  {errors?.gender && (
                    <span className="text-red-500 text-[13px]">
                      {String(errors?.gender?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="nationality"
            control={control}
            rules={{ required: 'Nationality is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Select
                    label="Country"
                    placeholder="Select country"
                    options={countriesList
                      ?.filter((country) => country?.code !== 'RW')
                      ?.map((country) => {
                        return {
                          ...country,
                          label: country.name,
                          value: country?.code,
                        };
                      })}
                    {...field}
                  />
                  {errors?.country && (
                    <p className="text-sm text-red-500">
                      {String(errors?.country?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              required: 'Select date of birth',
              validate: (value) => {
                if (moment(value).format() > moment(new Date()).format()) {
                  return 'Select a valid date of birth';
                }
                return true;
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    type="date"
                    label="Date of birth"
                    {...field}
                  />
                  {errors?.dateOfBirth && (
                    <p className="text-sm text-red-500">
                      {String(errors?.dateOfBirth?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input label="Phone number" required type="tel" {...field} />
                  {errors?.phone && (
                    <p className="text-sm text-red-500">
                      {String(errors?.phone?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email address is required',
              validate: (value) => {
                return (
                  validateInputs(String(value), 'email') ||
                  'Invalid email address'
                );
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    label="Email"
                    placeholder="name@domain.com"
                    {...field}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {String(errors?.email?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center">
          <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
            Attachment <span className="text-red-600">*</span>
          </h3>
          <Controller
            name="attachment"
            rules={{ required: 'Document attachment is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full items-start gap-2 max-sm:!w-full">
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="!w-fit max-sm:!w-full"
                    onChange={(e) => {
                      field.onChange(e?.target?.files?.[0]);
                      setAttachmentFile(e?.target?.files?.[0]);
                    }}
                  />
                  <ul className="flex items-center gap-3 w-full">
                    {attachmentFile && (
                      <ul className="flex flex-col items-center gap-3 w-full">
                        {attachmentFile && (
                          <Table
                            columns={attachmentColumns}
                            data={[attachmentFile]}
                            showPagination={false}
                            showFilter={false}
                          />
                        )}
                      </ul>
                    )}
                  </ul>
                  {errors?.attachment && (
                    <p className="text-sm text-red-500">
                      {String(errors?.attachment?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex flex-col items-center w-full gap-4 mt-4">
          <Button
            value={isLoading ? <Loader /> : 'Submit'}
            primary
            submit
            className="!py-3 !min-w-[40%] max-sm:!min-w-full"
          />
          <Button
            styled={false}
            value={
              <menu className="flex items-center gap-2 duration-300 ease-in-out hover:gap-3">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRegistrationStep('select-nationality'));
            }}
          />
        </menu>
      </form>
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
    </section>
  );
};

export default ForeignRegistrationForm;
