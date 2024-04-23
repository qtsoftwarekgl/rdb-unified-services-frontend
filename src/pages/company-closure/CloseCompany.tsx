import { useSelector } from 'react-redux';
import UserLayout from '../../containers/UserLayout';
import { RootState } from '../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import Table from '../../components/table/Table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Button from '../../components/inputs/Button';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { dissolutionReasons } from '../../constants/businessRegistration';

const CloseCompany = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
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
      toast.success('Company closure request submitted successfully');
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
      <main className="w-full flex flex-col gap-5 p-6 rounded-md bg-white">
        <h1 className="uppercase text-lg font-semibold text-center">
          Request company closure
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
                    options={user_applications
                      ?.filter((app) => app.status !== 'in_progress')
                      ?.map((application) => {
                        return {
                          ...application,
                          value: application?.entry_id,
                          label:
                            `${application?.entry_id
                              ?.split('-')[0]
                              ?.toUpperCase()} - ${
                              application?.company_details?.name || 'N/A'
                            }`,
                        };
                      })}
                      {...field}
                      placeholder='Select company to close'
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
              name="dissolution_date"
              rules={{ required: 'Dissolution date is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input type="date" label="Date of dissolution" {...field} />
                    {errors?.dissolution_date && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.dissolution_date.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="dissolution_reason"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Select
                    {...field}
                    placeholder='Select dissolution reason'
                      label="Dissolution reason"
                      options={dissolutionReasons}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </label>
                );
              }}
            />
          </menu>

          <section
            className={`${
              watch('company') && watch('dissolution_reason') === 'other'
                ? 'flex'
                : 'hidden'
            } w-full flex flex-col gap-3`}
          >
            <h1 className="text-md uppercase font-semibold flex items-center gap-1">
              Attachment <span className="text-red-600">*</span>
            </h1>
            <Controller
              control={control}
              name="attachments"
              rules={{
                required:
                  watch('dissolution_reason') === 'other'
                    ? 'Attach at least one document'
                    : false,
              }}
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

export default CloseCompany;
