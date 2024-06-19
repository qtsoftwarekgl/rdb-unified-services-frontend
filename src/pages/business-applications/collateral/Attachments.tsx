import { useEffect, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import Button from "../../../components/inputs/Button";
import Input from "../../../components/inputs/Input";
import Loader from "../../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import ViewDocument from "../../user-company-details/ViewDocument";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
  setCollateralApplications,
  setCollateralCompletedStep,
  setCollateralCompletedTab,
} from "@/states/features/collateralRegistrationSlice";

type AttachmentsProps = {
  entryId: string | null;
  attachments: any;
  isAOMADownloaded: boolean;
};

type Attachment = {
  label: string;
  file: File | null;
};

const CollateralAttachments = ({
  entryId,
  attachments,
  isAOMADownloaded,
}: AttachmentsProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [attachmentFiles, setAttachmentFiles] = useState<Attachment[]>([
    { label: "Debtor Identification Document", file: null },
    { label: "Valuation report", file: null },
    { label: "Collateral owner consent", file: null },
    { label: "Power of attorney", file: null },
    { label: "Collateral Agreement", file: null },
    { label: "Board resolutions", file: null },
  ]);
  const [attachmentFilesNames, setAttachmentFilesNames] = useState<string[]>(
    []
  );

  const [previewAttachment, setPreviewAttachment] = useState<string>("");

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmitAttachments = (data: FieldValues) => {
    const fileNames: string[] = [];
    attachmentFiles.forEach(
      (file) => file.file?.name && fileNames.push(file.file?.name)
    );

    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setCollateralApplications({
          entryId,
          attachments: {
            fileNames: [...fileNames, ...attachments],
          },
        })
      );

      setIsLoading(false);

      // SET CURRENT STEP AS COMPLETED
      dispatch(setCollateralCompletedStep("attachments"));
      dispatch(setCollateralCompletedTab("attachments"));

      dispatch(setCollateralActiveStep("preview"));

      // SET ACTIVE STEP TO NEXT TAB
      dispatch(setCollateralActiveTab("preview"));
    }, 1000);
  };

  useEffect(() => {
    // SET ATTACHMENTS FROM PERSISTED STATE
    if (attachments?.length > 0) {
      setAttachmentFilesNames(attachments);
    }
    if (isAOMADownloaded) {
      setAttachmentFiles([
        ...attachmentFiles,
        { label: "Notarized AOMA", file: null },
      ]);
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
        <fieldset>
          {attachmentFiles.map((file, index) => (
            <menu
              key={index}
              className="flex flex-col items-start w-full gap-3 mb-4 max-md:items-center"
            >
              <menu className="flex items-start w-full">
                <h3 className="capitalize text-[14px] font-normal w-1/2">
                  {file.label} <span className="text-red-600">*</span>
                </h3>
                <Controller
                  name={`attachment${index + 1}`}
                  rules={{
                    required:
                      attachments?.length !== 0
                        ? false
                        : `Document attachment ${index + 1} is required`,
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
          <menu className="flex items-center justify-between w-full gap-3 mx-auto mt-10 max-sm:flex-col-reverse">
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setCollateralActiveStep("collateral_information"));
                dispatch(setCollateralActiveTab("collateral_information"));
              }}
            />
            <Button
              value={isLoading ? <Loader /> : "Save & Continue"}
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

export default CollateralAttachments;
