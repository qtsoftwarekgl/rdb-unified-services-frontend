import { Controller, FieldValues, useForm } from 'react-hook-form';
import UserLayout from '../../containers/UserLayout';
import { RootState } from '../../states/store';
import { useSelector } from 'react-redux';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import { dormancyReasons } from '../../constants/businessRegistration';
import TextArea from '../../components/inputs/TextArea';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import Table from '../../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CompanyDormancy = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch
  } = useForm();

  // STATE VARIABLES
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File> | unknown | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Company dormancy request submitted successfully');
      navigate('/services');
    }, 1000);
    return data;
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: 'File size',
      accessorKey: 'size',
    },
    {
      header: 'File name',
      accessorKey: 'name',
    },
    {
      header: 'File type',
      accessorKey: 'type',
    },
    {
      header: 'Action',
      accessorKey: 'action',
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
                setAttachmentFiles((prevFiles) => {
                  return prevFiles?.filter(
                    (file: File) => file?.name !== row?.original?.name
                  );
                });
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="bg-white p-6 rounded-md w-full flex flex-col gap-5">
        <h1 className="uppercase text-lg font-semibold text-center">
          Request company dormancy
        </h1>
        <form
          className="w-[90%] mx-auto flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="company"
            control={control}
            rules={{ required: 'Select a company to close' }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-2">
                  <Select
                    label="Select company"
                    required
                    options={user_applications?.map((application) => {
                      return {
                        ...application,
                        value: application?.entry_id,
                        label: `${application?.entry_id
                          ?.split('-')[0]
                          ?.toUpperCase()} - ${
                          application?.company_details?.name
                        }`,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {errors?.company && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.company?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu
            className={`${
              watch('company') ? 'flex' : 'hidden'
            } w-full items-start gap-5 flex-wrap`}
          >
            <Controller
              name="dormancy_date"
              rules={{ required: 'Date of dormant resolution is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      type="date"
                      required
                      label="Date of dormant resolution"
                      {...field}
                    />
                    {errors?.dormancy_date && (
                      <p className="text-[13px] text-red-500">
                        {String(errors?.dormancy_date?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="start_date"
              rules={{ required: 'Start date of dormancy is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      type="date"
                      required
                      label="Start date of dormancy"
                      {...field}
                    />
                    {errors?.start_date && (
                      <p className="text-[13px] text-red-500">
                        {String(errors?.start_date?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="dormancy_reason"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Select
                      label="Dormancy reason"
                      options={dormancyReasons}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <TextArea
                      resize
                      label="Remarks/Comments"
                      placeholder="Use this space to add more context to your request"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <section
            className={`${
              watch('company') ? 'flex' : 'hidden'
            } w-full flex flex-col gap-3`}
          >
            <h1 className="text-md uppercase font-semibold flex items-center gap-1">
              Attachment <span className="text-red-600">*</span>
            </h1>
            <Controller
              control={control}
              name="attachments"
              rules={{ required: 'Attach at least one document' }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      type="file"
                      required
                      multiple
                      onChange={(e) => {
                        field.onChange(e?.target?.files);
                        setAttachmentFiles(
                          e.target.files &&
                            Array.from(e?.target?.files)?.map((file: File) => {
                              return {
                                name: file?.name,
                                size: file?.size,
                                type: file?.type,
                              };
                            })
                        );
                      }}
                    />
                    {errors?.attachments && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.attachments.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {attachmentFiles?.length > 0 && (
              <Table
                data={attachmentFiles || []}
                columns={columns}
                showFilter={false}
                showPagination={false}
              />
            )}
          </section>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                navigate('/services');
              }}
            />
            <Button value={isLoading ? <Loader /> : 'Submit'} primary submit />
          </menu>
        </form>
      </main>
    </UserLayout>
  );
};

export default CompanyDormancy;
