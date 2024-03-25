import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import Loader from "../../../components/Loader";
import Input from "../../../components/inputs/Input";
import { faSearch, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { userData } from "../../../constants/authentication";
import { countriesList } from "../../../constants/countries";
import Button from "../../../components/inputs/Button";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from "../../../states/features/businessRegistrationSlice";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { capitalizeString } from "../../../helpers/Strings";
import { setUserApplications } from "../../../states/features/userApplicationSlice";

export interface business_board_of_directors {
  first_name: string;
  middle_name: string;
  last_name: string;
}

interface BoardDirectorsProps {
  isOpen: boolean;
  board_of_directors: business_board_of_directors[];
  entry_id: string | null;
}

const BoardDirectors: FC<BoardDirectorsProps> = ({
  isOpen,
  board_of_directors = [],
  entry_id,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    trigger,
    setValue,
    clearErrors,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    if (watch("document_type") === "passport") {
      setValue("country", "");
      setValue("phone", "");
      setValue("street_name", "");
      setValue("first_name", "");
      setValue("middle_name", "");
      setValue("last_name", "");
    }
  }, [setValue, watch("document_type")]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          active_step: "senior_management",
          active_tab: "management",
          board_of_directors: [
            {
              ...data,
              attachment: attachmentFile?.name,
              step: "board_of_directors",
            },
            ...board_of_directors,
          ],
        })
      );
    }, 1000);
    return data;
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setUserApplications({
                    entry_id,
                    board_of_directors: board_of_directors?.filter(
                      (_: unknown, index: number) => {
                        return index !== row?.original?.no;
                      }
                    ),
                  })
                );
              }}
            />
          </menu>
        );
      },
    },
  ];

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setAttachmentFile(null);
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
    }
  }, [isSubmitSuccessful, reset]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={user?.email?.includes("info@rdb")}
        >
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
            <Controller
              name="position"
              rules={{ required: "Select member's position" }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Select
                      label="Select position"
                      required
                      options={[
                        {
                          value: "chairman",
                          label: "Chairman",
                        },
                        {
                          value: "member",
                          label: "Member",
                        },
                      ]}
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.position && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.position?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <ul className="flex items-start w-full gap-6">
              <Controller
                name="document_type"
                rules={{ required: "Select document type" }}
                control={control}
                render={({ field }) => {
                  const options = [
                    { value: "nid", label: "National ID" },
                    { label: "Passport", value: "passport" },
                  ];
                  return (
                    <label
                      className={`flex flex-col gap-1 w-full items-start ${
                        watch("document_type") !== "nid" && "!w-[49%]"
                      }`}
                    >
                      <Select
                        options={options}
                        label="Document Type"
                        required
                        onChange={(e) => {
                          field.onChange(e?.value);
                        }}
                      />
                    </label>
                  );
                }}
              />
              {watch("document_type") === "nid" && (
                <Controller
                  control={control}
                  name="document_no"
                  rules={{
                    required: watch("document_type")
                      ? "Document number is required"
                      : false,
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-2">
                        <Input
                          required
                          suffixIcon={faSearch}
                          suffixIconHandler={async (e) => {
                            e.preventDefault();
                            if (!field.value) {
                              setError("document_no", {
                                type: "manual",
                                message: "Document number is required",
                              });
                              return;
                            }
                            setSearchMember({
                              ...searchMember,
                              loading: true,
                              error: false,
                            });
                            setTimeout(() => {
                              const randomNumber = Math.floor(
                                Math.random() * 16
                              );
                              const userDetails = userData[randomNumber];

                              if (!userDetails) {
                                setSearchMember({
                                  ...searchMember,
                                  data: null,
                                  loading: false,
                                  error: true,
                                });
                              }

                              if (userDetails) {
                                setSearchMember({
                                  ...searchMember,
                                  data: userDetails,
                                  loading: false,
                                  error: false,
                                });
                                setValue("first_name", userDetails?.first_name);
                                setValue(
                                  "middle_name",
                                  userDetails?.middle_name
                                );
                                setValue("last_name", userDetails?.last_name);
                                setValue("gender", userDetails?.data?.gender);
                                setValue("phone", userDetails?.data?.phone);
                              }
                            }, 700);
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger("document_no");
                          }}
                        />
                        {searchMember?.loading &&
                          !errors?.document_no &&
                          !searchMember?.error && (
                            <span className="flex items-center gap-[2px] text-[13px]">
                              <Loader size={4} /> Validating document
                            </span>
                          )}
                        {searchMember?.error && !searchMember?.loading && (
                          <span className="text-red-600 text-[13px]">
                            Invalid document number
                          </span>
                        )}
                        {errors?.document_no && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.document_no?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            </ul>
          </menu>
          <section
            className={`${
              (watch("document_type") === "nid" && searchMember?.data) ||
              watch("document_type") === "passport"
                ? "flex"
                : "hidden"
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="first_name"
              control={control}
              defaultValue={searchMember?.data?.first_name}
              rules={{ required: "First name is required" }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      readOnly={watch("document_type") === "nid"}
                      defaultValue={searchMember?.data?.first_name}
                      placeholder="First name"
                      label="First name"
                      {...field}
                    />
                    {errors?.first_name && (
                      <span className="text-sm text-red-500">
                        {String(errors?.first_name?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="middle_name"
              control={control}
              defaultValue={searchMember?.data?.middle_name}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch("document_type") === "nid"}
                      defaultValue={searchMember?.data?.middle_name}
                      placeholder="Middle name"
                      label="Middle name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="last_name"
              control={control}
              defaultValue={searchMember?.data?.last_name}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch("document_type") === "nid"}
                      defaultValue={searchMember?.last_name}
                      placeholder="Last name"
                      label="Last name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="gender"
              control={control}
              defaultValue={searchMember?.data?.gender}
              rules={{
                required:
                  watch("document_type") === "passport"
                    ? "Select gender"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-2 items-start w-[49%]">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch("document_type") === "nid" ? (
                      <p className="px-2 py-1 rounded-md bg-background">
                        {searchMember?.data?.gender || watch("gender")}
                      </p>
                    ) : (
                      <menu className="flex items-center gap-4 mt-2">
                        <Input
                          type="radio"
                          label="Male"
                          name={field?.name}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            if (e.target.checked) {
                              setValue("gender", "Male");
                            }
                          }}
                        />
                        <Input
                          type="radio"
                          label="Female"
                          name={field?.name}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            if (e.target.checked) {
                              setValue("gender", "Female");
                            }
                          }}
                        />
                      </menu>
                    )}

                    {errors?.gender && (
                      <span className="text-red-500 text-[13px]">
                        {String(errors?.gender?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue={userData?.[0]?.phone}
              rules={{
                required: "Phone number is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    {watch("document_type") === "passport" ? (
                      <Input
                        label="Phone number"
                        required
                        type="tel"
                        {...field}
                      />
                    ) : (
                      <Select
                        label="Phone number"
                        required
                        defaultValue={{
                          label: `(+250) ${userData?.[0]?.phone}`,
                          value: userData?.[0]?.phone,
                        }}
                        options={userData?.slice(0, 3)?.map((user) => {
                          return {
                            ...user,
                            label: `(+250) ${user?.phone}`,
                            value: user?.phone,
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e?.value);
                        }}
                      />
                    )}
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch("document_type") !== "nid" ? (
              <Controller
                name="country"
                control={control}
                rules={{ required: "Nationality is required" }}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1 items-start">
                      <Select
                        isSearchable
                        label="Country"
                        options={countriesList?.map((country) => {
                          return {
                            ...country,
                            label: country.name,
                            value: country?.code,
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e?.value);
                        }}
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
            ) : (
              <Controller
                control={control}
                name="street_name"
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input
                        label="Street Name"
                        placeholder="Street name"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            )}
            <menu
              className={`${
                watch("document_type") === "passport" ? "flex" : "hidden"
              } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
            >
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Attachment <span className="text-red-600">*</span>
              </h3>
              <Controller
                defaultValue={attachmentFile?.name}
                name="attachment"
                rules={{
                  required:
                    watch("document_type") === "passport"
                      ? "Document attachment is required"
                      : false,
                }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                      <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                        <Input
                          type="file"
                          accept="application/pdf,image/*"
                          className="!w-fit max-sm:!w-full"
                          onChange={(e) => {
                            field.onChange(e?.target?.files?.[0]);
                            setAttachmentFile(e?.target?.files?.[0]);
                            setValue("attachment", e?.target?.files?.[0]?.name);
                            clearErrors("attachment");
                          }}
                        />
                        {(attachmentFile || board_of_directors?.attachment) && (
                          <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                            {board_of_directors?.attachment ||
                              attachmentFile?.name}
                            <FontAwesomeIcon
                              icon={faX}
                              className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                              onClick={(e) => {
                                e.preventDefault();
                                setAttachmentFile(null);
                                setValue("attachment", null);
                              }}
                            />
                          </p>
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
          </section>
          <section className="flex items-center justify-end w-full">
            <Button
              value={isLoading ? <Loader /> : "Add board member"}
              submit
              primary
            />
          </section>
          <section className={`flex members-table flex-col w-full`}>
            <Table
              data={
                board_of_directors?.length > 0
                  ? board_of_directors?.map((member, index) => {
                      return {
                        ...member,
                        no: index + 1,
                        name: `${member?.first_name || ""} ${
                          member?.middle_name || ""
                        } ${member?.last_name || ""}`,
                        position:
                          member?.position &&
                          capitalizeString(member?.position),
                      };
                    })
                  : []
              }
              columns={columns}
              showFilter={false}
              showPagination={false}
              tableTitle="Board members"
            />
          </section>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep("business_activity_vat"));
                dispatch(setBusinessActiveTab("general_information"));
              }}
            />
            {isAmending && (
              <Button
                value={"Complete Amendment"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setBusinessActiveTab("preview_submission")
                  );
                }}
              />
            )}
            <Button
              value="Continue"
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessCompletedStep("board_of_directors"));
                dispatch(setBusinessActiveStep("senior_management"));
              }}
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default BoardDirectors;
