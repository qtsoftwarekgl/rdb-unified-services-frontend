import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../components/inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../states/features/foreignBranchRegistrationSlice";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../../constants/Users";

interface CompanyAttachmentsProps {
  entry_id: string | null;
  foreign_company_attachments: any;
  foreign_company_details: any;
}

const CompanyAttachments = ({
  entry_id,
  foreign_company_attachments,
  foreign_company_details,
}: CompanyAttachmentsProps) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File>
  >([]);

  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          foreign_company_attachments: {
            attachments: Array.from(attachmentFiles)?.map((file: File) => {
              return {
                name: file.name,
                size: file.size,
                type: file.type,
              };
            }),
            step: "foreign_attachments",
          },
        })
      );
      dispatch(setForeignBusinessCompletedStep("foreign_attachments"));
      dispatch(setForeignBusinessActiveStep("foreign_preview_submission"));
      dispatch(setForeignBusinessActiveTab("foreign_preview_submission"));
    }, 1000);
    return data;
  };

  return (
    <main className="flex flex-col w-full gap-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <section
            className={`${
              foreign_company_details?.articles_of_association === "yes"
                ? "flex"
                : "hidden"
            } w-full flex flex-col gap-3`}
          >
            <h1 className="text-lg font-medium uppercase">Company Details</h1>
            <Controller
              name="articles_of_association"
              rules={{
                required:
                  foreign_company_details?.articles_of_association === "yes" &&
                  !watch("articles_of_association") &&
                  !foreign_company_attachments?.attachments?.length
                    ? "Upload company articles of association"
                    : false,
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-2">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="flex items-center w-full gap-1">
                        Article of association{" "}
                        <span className="text-red-600">*</span>
                      </p>
                      {watch("articles_of_association") ? (
                        <menu className="flex items-center w-full gap-5">
                          <p>{watch("articles_of_association")?.name}</p>
                          <FontAwesomeIcon
                            icon={faX}
                            className="text-red-600 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentFiles(
                                Array.from(attachmentFiles).filter(
                                  (file: File) =>
                                    file !== watch("articles_of_association")
                                )
                              );
                              setValue("articles_of_association", null);
                            }}
                          />
                        </menu>
                      ) : (
                        <Input
                          label="Articles of association"
                          type="file"
                          required
                          className="!w-fit"
                          name={field?.name}
                          onChange={(e) => {
                            e.preventDefault();
                            setValue(
                              "articles_of_association",
                              e?.target?.files && e.target.files[0]
                            );
                            e.target.files &&
                              Object.values(e.target.files)?.forEach(
                                (file: File) => {
                                  setAttachmentFiles([
                                    file,
                                    ...attachmentFiles,
                                  ]);
                                }
                              );
                          }}
                        />
                      )}
                    </ul>
                    {errors?.articles_of_association && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.articles_of_association?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </section>
          <section className="flex flex-col w-full gap-3">
            <h1 className="text-lg font-medium uppercase">Others</h1>
            <Controller
              name="attachments"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="w-full">Other attachments</p>
                      <Input
                        type="file"
                        multiple
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e);
                          const files =
                            e.target.files &&
                            Object.values(e.target.files)?.concat();
                          files &&
                            files.forEach((file: File) => {
                              setAttachmentFiles([file, ...attachmentFiles]);
                            });
                        }}
                      />
                    </ul>
                  </label>
                );
              }}
            />
          </section>
          <menu className="flex items-center w-full gap-6">
            {(attachmentFiles?.length > 0 ||
              foreign_company_attachments?.attachments.length > 0) && (
              <menu className="flex items-center w-full gap-5">
                <p>
                  {attachmentFiles?.length ||
                    foreign_company_attachments?.attachments?.length}{" "}
                  files attached
                </p>
                <FontAwesomeIcon
                  icon={faX}
                  className="text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setAttachmentFiles([]);
                    dispatch(
                      setUserApplications({
                        entry_id,
                        foreign_company_attachments: {
                          attachments: [],
                          ...foreign_company_attachments,
                        },
                      })
                    );
                  }}
                />
              </menu>
            )}
          </menu>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setForeignBusinessActiveStep("foreign_beneficial_owners")
                );
                dispatch(
                  setForeignBusinessActiveTab("foreign_beneficial_owners")
                );
              }}
            />
            {isAmending && (
              <Button
                value={"Complete Amendment"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setForeignBusinessActiveTab("foreign_preview_submission")
                  );
                }}
              />
            )}
            <Button
              value={isLoading ? <Loader /> : "Continue"}
              primary
              submit
              disabled={isFormDisabled}
            />
          </menu>
        </fieldset>
      </form>
    </main>
  );
};

export default CompanyAttachments;
