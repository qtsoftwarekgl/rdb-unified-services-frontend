import { Controller, FieldValues, useForm } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import Select from "../../components/inputs/Select";
import { AppDispatch, RootState } from "../../states/store";
import { useSelector } from "react-redux";
import Input from "../../components/inputs/Input";
import { useEffect, useState } from "react";
import validateInputs from "../../helpers/validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";
import { ErrorResponse, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import {
  fetchBusinessesThunk,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  uploadAmendmentAttachmentThunk,
} from "@/states/features/businessSlice";
import { attachmentColumns } from "@/constants/business.constants";
import { BusinessAttachment } from "@/types/models/attachment";
import CustomTooltip from "@/components/inputs/CustomTooltip";
import ViewDocument from "../user-company-details/ViewDocument";
import Table from "@/components/table/Table";
import { ColumnDef } from "@tanstack/react-table";
import {
  fetchCellsThunk,
  fetchDistrictsThunk,
  fetchProvincesThunk,
  fetchSectorsThunk,
  fetchVillagesThunk,
} from "@/states/features/locationSlice";
import { dayHoursArray } from "@/constants/time";
import { useCreateBusinessBranchMutation } from "@/states/api/businessRegApiSlice";
import { toast } from "react-toastify";

const BusinessNewBranch = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm();

  // STATE VARIABLES
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessesList,
    businessesIsFetching,
    uploadAmendmentAttachmentIsLoading,
    uploadAmendmentAttachmentIsSuccess,
  } = useSelector((state: RootState) => state.business);
  const {
    provincesList,
    fetchProvincesIsLoading,
    districtsList,
    fetchDistrictsIsLoading,
    fetchSectorsIsLoading,
    sectorsList,
    cellsList,
    fetchCellsIsLoading,
    villagesList,
    fetchVillagesIsLoading,
  } = useSelector((state: RootState) => state.location);
  const [attachmentFiles, setAttachmentFiles] = useState<
    {
      file: File;
      attachmentType: string;
      size: number;
      fileName: string;
      attachmentUrl: string;
    }[]
  >([]);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string>("");

  // NAVIGATE
  const navigate = useNavigate();

  // INITIALIZE CREATE BUSINESS BRANCH MUTATION
  const [
    createBusinessBranch,
    {
      data: createBusinessBranchData,
      error: createBusinessBranchError,
      isLoading: createBusinessBranchIsLoading,
      isError: createBusinessBranchIsError,
      isSuccess: createBusinessBranchIsSuccess,
      reset: resetCreateBusinessBranch,
    },
  ] = useCreateBusinessBranchMutation();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createBusinessBranch({
      businessId: data?.businessId,
      branchName: data?.branchName,
      isForeign: false,
      workingHoursFrom: data?.workingHoursFrom + ":00",
      workingHoursTo: data?.workingHoursTo + ":00",
      branchAddress: {
        villageId: Number(data?.villageId),
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        streetName: data?.streetName,
        countryOfIncorporation: "RW",
      },
    });
  };

  // HANDLE CREATE BUSINESS BRANCH RESPONSE
  useEffect(() => {
    if (createBusinessBranchIsSuccess) {
      if (attachmentFiles?.length > 0) {
        attachmentFiles?.forEach((attachmentFile) => {
          dispatch(
            uploadAmendmentAttachmentThunk({
              file: attachmentFile?.file,
              businessId: watch("businessId"),
              fileName: attachmentFile?.fileName,
              attachmentType: "Branch resolution",
              amendmentId: createBusinessBranchData?.data?.id,
            })
          );
        });
      }
    } else if (createBusinessBranchIsError) {
      toast.error(
        (createBusinessBranchError as ErrorResponse)?.data?.message ||
          "An error occurred while creating business branch. Refresh and try again"
      );
    }
  }, [
    attachmentFiles,
    createBusinessBranchData,
    createBusinessBranchError,
    createBusinessBranchIsError,
    createBusinessBranchIsSuccess,
    dispatch,
    watch,
  ]);

  // HANDLE UPLOAD AMENDMENT ATTACHMENT RESPONSE
  useEffect(() => {
    if (
      uploadAmendmentAttachmentIsSuccess &&
      createBusinessBranchIsSuccess &&
      attachmentFiles?.length > 0
    ) {
      dispatch(setUploadAmendmentAttachmentIsLoading(false));
      dispatch(setUploadAmendmentAttachmentIsSuccess(false));
      resetCreateBusinessBranch();
      setAttachmentFiles([]);
      toast.success("New branch creation request submitted successfully");
      navigate("/services");
    }
  }, [
    uploadAmendmentAttachmentIsSuccess,
    uploadAmendmentAttachmentIsLoading,
    navigate,
    dispatch,
    createBusinessBranchIsSuccess,
    attachmentFiles?.length,
    resetCreateBusinessBranch,
  ]);

  // FETCH BUSINESSES
  useEffect(() => {
    dispatch(
      fetchBusinessesThunk({
        page: 1,
        size: 100,
        applicationStatus: "APPROVED",
      })
    );
  }, [dispatch]);

  // FETCH PROVINCES
  useEffect(() => {
    dispatch(fetchProvincesThunk());
  }, [dispatch]);

  // FETCH DISTRICTS
  useEffect(() => {
    if (watch("provinceId")) {
      dispatch(fetchDistrictsThunk(Number(watch("provinceId"))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, watch("provinceId"), watch]);

  // FETCH SECTORS
  useEffect(() => {
    if (watch("districtId")) {
      dispatch(fetchSectorsThunk(Number(watch("districtId"))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, watch("districtId"), watch]);

  // FETCH CELLS
  useEffect(() => {
    if (watch("sectorId")) {
      dispatch(fetchCellsThunk(Number(watch("sectorId"))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, watch("sectorId"), watch]);

  // FETCH VILLAGES
  useEffect(() => {
    if (watch("cellId")) {
      dispatch(fetchVillagesThunk(Number(watch("cellId"))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, watch("cellId"), watch]);

  // TABLE COLUMNS
  const attachmentExtendedColumns = [
    ...attachmentColumns,
    {
      header: "Action",
      accessorKey: "action",
      cell: ({
        row,
      }: {
        row: {
          original: BusinessAttachment;
        };
      }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
                setPreviewAttachmentUrl(row?.original?.attachmentUrl);
              }}
            />
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                setAttachmentFiles(
                  Array.from(attachmentFiles)?.filter(
                    (attachmentFile) =>
                      attachmentFile?.fileName !== row?.original?.fileName
                  )
                );
              }}
            />
          </menu>
        );
      },
    },
  ];

  const businessNewBranchAttachments = [
    {
      label: "Branch resolution",
      name: "branchResolution",
      required: true,
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-4 p-6 bg-white rounded-md">
        <h1 className="text-lg font-semibold text-center uppercase">
          New business branch
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3 flex flex-col gap-4 w-[90%] mx-auto"
        >
          <fieldset className="grid w-full grid-cols-2 gap-5">
            <Controller
              control={control}
              name="businessId"
              rules={{ required: "Select business to open new branch" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      label="Select business"
                      required
                      options={businessesList?.map((business) => {
                        return {
                          label: businessesIsFetching
                            ? "...."
                            : (
                                business?.companyName ||
                                business?.enterpriseName ||
                                business?.enterpriseBusinessName ||
                                business?.branchName
                              )?.toUpperCase(),
                          value: business?.id,
                        };
                      })}
                      {...field}
                      placeholder="Select business"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.businessId && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.businessId?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch("businessId") && (
              <>
                <Controller
                  name="branchName"
                  control={control}
                  rules={{ required: "Branch name is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Input
                          placeholder="Branch name"
                          label="Branch name"
                          required
                          {...field}
                        />
                        {errors?.branchName && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.branchName?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="provinceId"
                  control={control}
                  rules={{ required: "Select province of residence" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          required
                          label="Province"
                          options={provincesList
                            ?.filter((province) => province?.id !== 6)
                            ?.map((province) => {
                              return {
                                label: fetchProvincesIsLoading
                                  ? "..."
                                  : province?.name,
                                value: String(province?.id),
                              };
                            })}
                          {...field}
                          placeholder="Select province"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.provinceId && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.provinceId.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="districtId"
                  control={control}
                  rules={{ required: "Select district of residence" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          required
                          label="District"
                          options={districtsList?.map((district) => {
                            return {
                              label: fetchDistrictsIsLoading
                                ? "..."
                                : district?.name,
                              value: String(district?.id),
                            };
                          })}
                          {...field}
                          placeholder="Select district"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.districtId && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.districtId?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="sectorId"
                  control={control}
                  rules={{ required: "Select sector of residence" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          required
                          label="Sector"
                          options={sectorsList?.map((sector) => {
                            return {
                              label: fetchSectorsIsLoading
                                ? "..."
                                : sector?.name,
                              value: String(sector?.id),
                            };
                          })}
                          {...field}
                          placeholder="Select sector"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.sectorId && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.sectorId?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="cellId"
                  control={control}
                  rules={{ required: "Select cell of residence" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          required
                          label="Cell"
                          options={cellsList?.map((cell) => {
                            return {
                              label: fetchCellsIsLoading ? "..." : cell?.name,
                              value: String(cell?.id),
                            };
                          })}
                          {...field}
                          placeholder="Select cell"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.cellId && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.cellId?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="villageId"
                  control={control}
                  rules={{ required: "Select village of residence" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          required
                          label="Village"
                          options={villagesList?.map((village) => {
                            return {
                              label: fetchVillagesIsLoading
                                ? "..."
                                : village?.name,
                              value: String(village?.id),
                            };
                          })}
                          {...field}
                          placeholder="Select village"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.villageId && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.villageId?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="streetName"
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Input
                          label="Street Name"
                          placeholder="Street name"
                          {...field}
                        />
                      </label>
                    );
                  }}
                />
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Input
                          label="Phone number"
                          required
                          type="tel"
                          {...field}
                        />
                        {errors?.phoneNumber && (
                          <p className="text-sm text-red-500">
                            {String(errors?.phoneNumber?.message)}
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
                    required: "Email address is required",
                    validate: (value) => {
                      return (
                        validateInputs(String(value), "email") ||
                        "Invalid email address"
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
                <Controller
                  name="workingHoursFrom"
                  rules={{
                    validate: (value) => {
                      if (
                        value &&
                        Number(value) >= Number(watch("workingHoursTo"))
                      )
                        return "Working Start Time must be less than Working End Time";
                    },
                    required: "Select working start time",
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          options={dayHoursArray}
                          label="Working Start Time"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger("workingHoursFrom");
                            await trigger("workingHoursTo");
                          }}
                        />
                        {errors?.workingHoursFrom && (
                          <p className="text-red-600 text-[13px]">
                            {String(errors?.workingHoursFrom?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="workingHoursTo"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (
                        value &&
                        Number(value) <= Number(watch("workingHoursFrom"))
                      )
                        return "Working End Time must be greater than Working Start Time";
                    },
                    required: "Select working end time",
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Select
                          options={dayHoursArray}
                          label="Working End Time"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger("workingHoursTo");
                            await trigger("workingHoursFrom");
                          }}
                        />
                        {errors?.workingHoursTo && (
                          <p className="text-red-600 text-[13px]">
                            {String(errors?.workingHoursTo?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <section className={`w-full flex flex-col gap-3`}>
                  <h1 className="flex items-center gap-2 font-medium uppercase text-md">
                    Attachments <span className="text-red-600">*</span>
                  </h1>
                  <menu className="grid w-full grid-cols-2 gap-5">
                    {businessNewBranchAttachments.map((attachment, index) => {
                      return (
                        <Controller
                          key={index}
                          name={attachment?.name}
                          control={control}
                          rules={{
                            required: attachment?.required
                              ? `${attachment?.label} is required`
                              : false,
                          }}
                          render={({ field }) => {
                            return (
                              <label className="flex flex-col w-full gap-1">
                                <p className="flex items-center gap-2">
                                  {attachment?.label}{" "}
                                  {!attachment?.required ? (
                                    "(optional)"
                                  ) : (
                                    <span className="text-red-600">*</span>
                                  )}
                                  {attachmentFiles?.find(
                                    (file) =>
                                      file?.attachmentType === attachment?.label
                                  ) && (
                                    <CustomTooltip label="File has been added successfully">
                                      <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="cursor-pointer text-primary"
                                      />
                                    </CustomTooltip>
                                  )}
                                </p>
                                <Input
                                  type="file"
                                  label={attachment.label}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (
                                      e?.target?.files != null &&
                                      e?.target?.files?.length > 0
                                    ) {
                                      const file = e?.target?.files[0];
                                      if (file != null) {
                                        setAttachmentFiles((prev) => [
                                          ...prev,
                                          {
                                            file: file,
                                            attachmentType: attachment?.label,
                                            size: file?.size,
                                            fileName: file?.name,
                                            attachmentUrl:
                                              URL.createObjectURL(file),
                                          },
                                        ]);
                                      }
                                    }
                                  }}
                                />
                                {errors?.[attachment?.name] && (
                                  <p className="text-red-500 text-[13px]">
                                    {String(
                                      errors?.[attachment?.name]?.message
                                    )}
                                  </p>
                                )}
                              </label>
                            );
                          }}
                        />
                      );
                    })}
                  </menu>
                </section>
              </>
            )}
          </fieldset>
          {attachmentFiles?.length > 0 && (
            <menu className="flex flex-col w-full gap-4">
              <Table
                showFilter={false}
                columns={
                  attachmentExtendedColumns as ColumnDef<{
                    file: File;
                    attachmentType: string;
                    size: number;
                    fileName: string;
                    attachmentUrl: string;
                  }>[]
                }
                data={(Array.from(attachmentFiles) ?? [])?.map(
                  (attachmentFile) => {
                    return {
                      file: attachmentFile?.file as File,
                      attachmentType: attachmentFile?.attachmentType,
                      size: attachmentFile?.size,
                      fileName: attachmentFile?.fileName,
                      attachmentUrl: (
                        attachmentFile as unknown as BusinessAttachment
                      )?.attachmentUrl,
                    };
                  }
                )}
              />
              {uploadAmendmentAttachmentIsLoading && (
                <figure className="flex items-center justify-center w-full gap-2">
                  <Loader className="text-primary" />
                  <p className="text-[14px]">Uploading attachment(s)...</p>
                </figure>
              )}
            </menu>
          )}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                navigate("/services");
              }}
            />
            <Button
              disabled={
                createBusinessBranchIsLoading ||
                uploadAmendmentAttachmentIsLoading
              }
              value={
                createBusinessBranchIsLoading ||
                uploadAmendmentAttachmentIsLoading ? (
                  <Loader />
                ) : (
                  "Submit"
                )
              }
              primary
              submit
            />
          </menu>
        </form>
      </main>
      {previewAttachmentUrl && (
        <ViewDocument
          documentUrl={previewAttachmentUrl}
          setDocumentUrl={setPreviewAttachmentUrl}
        />
      )}
    </UserLayout>
  );
};

export default BusinessNewBranch;
