import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setCompanyAttachments,
} from '../../../states/features/businessRegistrationSlice';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';

interface CompanyAttachmentsProps {
  isOpen: boolean;
}

const CompanyAttachments: FC<CompanyAttachmentsProps> = ({ isOpen }) => {
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
  const { company_details, company_attachments } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File>
  >([]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setCompanyAttachments(
          Array.from(attachmentFiles)?.map((file: File) => {
            return {
              name: file.name,
              size: file.size,
              type: file.type,
            };
          })
        )
      );
      dispatch(setBusinessCompletedStep('attachments'));
      dispatch(setBusinessActiveStep('preview_submission'));
      dispatch(setBusinessActiveTab('preview_submission'));
    }, 1000);
    return data;
  };

  if (!isOpen) return null;

  return (
    <main className="w-full flex flex-col gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5"
      >
        <section
          className={`${
            company_details?.articles_of_association === 'yes'
              ? 'flex'
              : 'hidden'
          } w-full flex flex-col gap-3`}
        >
          <h1 className="uppercase text-lg font-medium">Company Details</h1>
          <Controller
            name="articles_of_association"
            rules={{
              required:
                company_details?.articles_of_association === 'yes' &&
                !watch('articles_of_association') &&
                !company_attachments?.length
                  ? 'Upload company articles of association'
                  : false,
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex w-full flex-col gap-2">
                  <ul className="w-full flex items-center gap-3 justify-between">
                    <p className="flex items-center gap-1 w-full">
                      Article of association{' '}
                      <span className="text-red-600">*</span>
                    </p>
                    {watch('articles_of_association') ? (
                      <menu className="w-full flex items-center gap-5">
                        <p>{watch('articles_of_association')?.name}</p>
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentFiles(
                              Array.from(attachmentFiles).filter(
                                (file: File) =>
                                  file !== watch('articles_of_association')
                              )
                            );
                            setValue('articles_of_association', null);
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
                            'articles_of_association',
                            e?.target?.files && e.target.files[0]
                          );
                          e.target.files &&
                            Object.values(e.target.files)?.forEach(
                              (file: File) => {
                                setAttachmentFiles([file, ...attachmentFiles]);
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
        <section className="flex flex-col gap-3 w-full">
          <h1 className="uppercase text-lg font-medium">Others</h1>
          <Controller
            name="attachments"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-3 w-full">
                  <ul className="w-full flex items-center gap-3 justify-between">
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
        <menu className="w-full flex items-center gap-6">
          {(attachmentFiles?.length > 0 || company_attachments?.length > 0) && (
            <menu className="w-full flex items-center gap-5">
              <p>
                {attachmentFiles?.length || company_attachments?.length} files
                attached
              </p>
              <FontAwesomeIcon
                icon={faX}
                className="text-red-600 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setAttachmentFiles([]);
                  dispatch(setCompanyAttachments([]));
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
              dispatch(setBusinessActiveStep('beneficial_owners'));
              dispatch(setBusinessActiveTab('beneficial_owners'));
            }}
          />
          <Button value={isLoading ? <Loader /> : 'Continue'} primary submit />
        </menu>
      </form>
    </main>
  );
};

export default CompanyAttachments;
