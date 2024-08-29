import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import Input from "../inputs/Input";
import { useState } from "react";
import ViewDocument from "@/pages/user-company-details/ViewDocument";
import Button from "../inputs/Button";
import { toast } from "react-toastify";
import { setResolutionAttachment } from "@/states/features/resolutionAttachmentSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/states/store";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "../ui/tooltip";
import CustomTooltip from "../inputs/CustomTooltip";

interface Props {
  control: Control<FieldValues, any>;
  errors: FieldErrors<FieldValues>;
}

const ResolutionAttachment = ({ control, errors }: Props) => {
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string>("");
  const { file } = useSelector(
    (state: RootState) => state.resolutionAttachment
  );
  const dispatch = useDispatch();

  return (
    <section className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center">
      <h3 className=" text-[14px] font-normal flex items-center gap-1">
        Amendment Resolution <span className="text-red-600">*</span>
      </h3>
      <menu className="flex items-center gap-4">
        <Controller
          name="attachment"
          rules={{ required: "Resolution is required" }}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                <Input
                  type="file"
                  accept="application/pdf"
                  className="!w-fit max-sm:!w-full"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      field.onChange(e?.target?.files?.[0]);
                      dispatch(
                        setResolutionAttachment({
                          file: e?.target?.files?.[0],
                          fileName: e?.target?.files?.[0].name,
                          attachmentType: "resolution",
                        })
                      );
                    } else toast.info("No file selected");
                  }}
                />
                {errors?.attachment && (
                  <p className="text-sm text-red-500">
                    {String(errors?.attachment?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        {file && (
          <menu>
            <Button
              value="Preview"
              onClick={(e) => {
                e.preventDefault();
                if (file) setPreviewAttachmentUrl(URL.createObjectURL(file));
              }}
            />
          </menu>
        )}
        {file && (
          <CustomTooltip label={"Replace attachment"}>
            <FontAwesomeIcon
              icon={faRemove}
              className="text-red-600 cursor-pointer"
              onClick={() => {
                dispatch(
                  setResolutionAttachment({
                    file: null,
                    fileName: "",
                    attachmentType: "",
                  })
                );
                setPreviewAttachmentUrl("");
              }}
            />
          </CustomTooltip>
        )}
      </menu>
      {file && previewAttachmentUrl && (
        <ViewDocument
          documentUrl={previewAttachmentUrl}
          setDocumentUrl={setPreviewAttachmentUrl}
        />
      )}
    </section>
  );
};

export default ResolutionAttachment;
