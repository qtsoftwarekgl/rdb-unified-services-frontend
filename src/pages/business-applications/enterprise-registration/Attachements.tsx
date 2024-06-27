import { useState } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import Button from '../../../components/inputs/Button';
import Input from '../../../components/inputs/Input';
import Loader from '../../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
} from '../../../states/features/enterpriseRegistrationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../states/store';
import { RDBAdminEmailPattern } from '../../../constants/Users';
import ViewDocument from '../../user-company-details/ViewDocument';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { businessId } from '@/types/models/business';

type AttachmentsProps = {
  businessId: businessId;
  applicationStatus?: string;
};

type Attachment = {
  label: string;
  file: File | null;
};

const Attachments = ({ businessId, applicationStatus }: AttachmentsProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentFiles, setAttachmentFiles] = useState<Attachment[]>([
    { label: 'Memorandum of Association ', file: null },
    { label: 'Article of Association', file: null },
    { label: 'Article of ownership ', file: null },
  ]);
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [previewAttachment, setPreviewAttachment] = useState<string>('');

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(setEnterpriseActiveTab('enterprise_preview_submission'));
      dispatch(setEnterpriseActiveStep('enterprise_preview_submission'));
      dispatch(setEnterpriseCompletedStep('attachments'));
    }, 4000);
    return {
      ...data,
      businessId,
      applicationStatus,
    };
  };

  const handleFileChange = (index: number, file: File | undefined) => {
    const newAttachments = [...attachmentFiles];
    newAttachments[index].file = file;
    setAttachmentFiles(newAttachments);
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isFormDisabled}>
          {attachmentFiles.map((file, index) => (
            <menu
              key={index}
              className="flex flex-col items-start w-full gap-3 mb-4 max-md:items-center"
            >
              <menu className="flex items-start w-full justify-between gap-12">
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
                    <menu className="flex w-fit justify-between items-center gap-3">
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
                        {errors?.[`attachment${index + 1}`] && (
                          <p className="text-sm text-red-500">
                            {String(
                              errors?.[`attachment${index + 1}`]?.message
                            )}
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
                    </menu>
                  )}
                />
              </menu>
            </menu>
          ))}
          <menu
            className={`flex mt-6 items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setEnterpriseActiveTab('general_information'));
                dispatch(setEnterpriseActiveStep('office_address'));
              }}
            />
            <Button
              value={isLoading ? <Loader /> : 'Save & Continue'}
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
