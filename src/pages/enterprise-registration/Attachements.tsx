import React, { useEffect, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import Button from "../../components/inputs/Button";
import Input from "../../components/inputs/Input";
import Loader from "../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseAttachments,
  setEnterpriseCompletedStep,
  setEnterpriseCompletedTab,
} from "../../states/features/enterpriseRegistrationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";

type AttachmentsProps = {
  isOpen: boolean;
};

type Attachment = {
  label: string;
  file: File | null;
};

const Attachments = ({ isOpen }: AttachmentsProps) => {
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

  const { enterprise_attachments, enterprise_registration_active_step } =
    useSelector((state: RootState) => state.enterpriseRegistration);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmitAttachments = (data: FieldValues) => {
    const fileNames = attachmentFiles.map((file) => file.file?.name);
    console.log(data);
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setEnterpriseAttachments({
          fileNames,
          step: { ...enterprise_registration_active_step },
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
    if (
      enterprise_attachments &&
      Object.keys(enterprise_attachments)?.length > 0
    ) {
      setAttachmentFilesNames(enterprise_attachments.fileNames);
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

  if (!isOpen) {
    return null;
  }

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmitAttachments)}>
        {attachmentFiles.map((file, index) => (
          <menu
            key={index}
            className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center"
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
                  <label className="flex flex-col w-1/2 items-start gap-2 max-sm:!w-full">
                    <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                      <Input
                        type="file"
                        accept="application/pdf,image/*"
                        className="!w-fit max-sm:!w-full"
                        onChange={(e) => {
                          field.onChange(e?.target?.files?.[0]);
                          handleFileChange(index, e?.target?.files?.[0]);
                        }}
                      />
                      {(file?.file || attachmentFilesNames.length > 0) && (
                        <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                          {file.file?.name || attachmentFilesNames[index]}
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                            onClick={() => {
                              removeAttachment(index);
                              setValue(`attachment${index + 1}`, null);
                            }}
                          />
                        </p>
                      )}
                    </ul>
                    {errors[`attachment${index + 1}`] && (
                      <p className="text-sm text-red-500">
                        {errors[`attachment${index + 1}`].message}
                      </p>
                    )}
                  </label>
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
            onClick={() => {
              dispatch(setEnterpriseActiveTab("enterprise_details"));
              dispatch(setEnterpriseActiveStep("office_address"));
            }}
          />
          <Button value={isLoading ? <Loader /> : "Continue"} primary submit />
        </menu>
      </form>
    </section>
  );
};

export default Attachments;
