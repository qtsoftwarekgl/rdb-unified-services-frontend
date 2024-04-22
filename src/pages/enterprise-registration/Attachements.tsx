import { useEffect, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import Button from "../../components/inputs/Button";
import Input from "../../components/inputs/Input";
import Loader from "../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
  setEnterpriseCompletedTab,
} from "../../states/features/enterpriseRegistrationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../constants/Users";
import ViewDocument from "../user-company-details/ViewDocument";
import { faEye } from "@fortawesome/free-regular-svg-icons";

type AttachmentsProps = {
  entry_id: string | null;
  enterprise_attachments: any;
};

type Attachment = {
  label: string;
  file: File | null;
};

const Attachments = ({
  entry_id,
  enterprise_attachments,
}: AttachmentsProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [attachmentFiles, setAttachmentFiles] = useState<Attachment[]>([
    { label: "Memorandum of Association ", file: null },
    { label: "Article of Association", file: null },
    { label: "Article of ownership ", file: null },
  ]);
  const [attachmentFilesNames, setAttachmentFilesNames] = useState<string[]>(
    []
  );

  const { enterprise_registration_active_step } = useSelector(
    (state: RootState) => state.enterpriseRegistration
  );

  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [previewAttachment, setPreviewAttachment] = useState<string>("");

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmitAttachments = (data: FieldValues) => {
    const fileNames = attachmentFiles.map((file) => file.file?.name);
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entry_id,
          enterprise_attachments: {
            fileNames,
            step: { ...enterprise_registration_active_step },
          },
        })
      );

      setIsLoading(false);

      // SET CURRENT STEP AS COMPLETED
      dispatch(setEnterpriseCompletedStep("attachments"));
      dispatch(setEnterpriseCompletedTab("attachments"));

      dispatch(setEnterpriseActiveTab("enterprise_preview_submission"));

      // SET ACTIVE STEP TO NEXT TAB
      dispatch(setEnterpriseActiveStep("enterprise_preview_submission"));
    }, 1000);
  };

  useEffect(() => {
    // SET ATTACHMENTS FROM PERSISTED STATE
    if (enterprise_attachments?.length > 0) {
      setAttachmentFilesNames(enterprise_attachments);
    }
  }, []);

  const handleFileChange = (index: number, file: File | null) => {
    const newAttachments = [...attachmentFiles];
    newAttachments[index].file = file;
    setAttachmentFiles(newAttachments);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachmentFiles];
    newAttachments[index].file = null;
    setAttachmentFiles(newAttachments);
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmitAttachments)}>
        <fieldset disabled={isFormDisabled}>
          {attachmentFiles.map((file, index) => (
            <menu
              key={index}
              className="flex flex-col items-start w-full gap-3 mb-4 max-md:items-center"
            >
              <menu className="flex items-start w-full gap-12">
                <h3 className="capitalize text-[14px] font-normal w-1/2">
                  {file.label} <span className="text-red-600">*</span>
                </h3>
                <Controller
                  name={`attachment${index + 1}`}
                  rules={{
                    required: `Document attachment ${index + 1} is required`,
                  }}
                  control={control}
                  render={({ field }) => (
                    <menu className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                      <label className="flex flex-col items-start gap-2 max-sm:!w-full">
                        <ul>
                          <Input
                            type="file"
                            accept="application/pdf"
                            className="!w-fit max-sm:!w-full"
                            onChange={(e) => {
                              field.onChange(e?.target?.files?.[0]);
                              handleFileChange(index, e?.target?.files?.[0]);
                            }}
                          />
                        </ul>
                        {errors[`attachment${index + 1}`] && (
                          <p className="text-sm text-red-500">
                            {errors[`attachment${index + 1}`].message}
                          </p>
                        )}
                      </label>
                      {file.file && (
                        <FontAwesomeIcon
                          icon={faEye}
                          onClick={() => {
                            if (!file.file) return;
                            const url = URL.createObjectURL(file.file);
                            setPreviewAttachment(url);
                          }}
                          className="text-primary text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                        />
                      )}
                      {(file?.file || attachmentFilesNames?.length > 0) && (
                        <p className="flex  items-center gap-2 text-[14px] text-black font-normal">
                          <span className="w-32 truncate">
                            {file.file?.name || attachmentFilesNames[index]}
                          </span>

                          <FontAwesomeIcon
                            icon={faTimes}
                            className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                            onClick={() => {
                              if (isFormDisabled) return;
                              removeAttachment(index);
                              setValue(`attachment${index + 1}`, null);
                            }}
                          />
                        </p>
                      )}
                    </menu>
                  )}
                />
              </menu>
            </menu>
          ))}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setEnterpriseActiveTab("general_information"));
                dispatch(setEnterpriseActiveStep("office_address"));
              }}
            />
            <Button
              value={isLoading ? <Loader /> : "Save & Continue"}
              disabled={isFormDisabled}
              primary
              submit
            />
          </menu>
        </fieldset>
      </form>
      {previewAttachment && (
        <ViewDocument
          documentUrl={previewAttachment}
          setDocumentUrl={setPreviewAttachment}
        />
      )}
    </section>
  );
};

export default Attachments;
