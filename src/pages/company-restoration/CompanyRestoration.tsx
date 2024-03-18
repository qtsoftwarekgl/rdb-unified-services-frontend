import { Controller, FieldValues, useForm } from 'react-hook-form';
import UserLayout from '../../containers/UserLayout';
import Select from '../../components/inputs/Select';
import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';
import Table from '../../components/table/Table';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const CompanyRestoration = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // NAVIGATION
  const navigate = useNavigate();

  // STATE VARIABLES
  const { user_applications } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File> | unknown | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Company restoration request submitted successfully');
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
      <main className="p-6 bg-white rounded-md flex flex-col gap-6">
        <h1 className="uppercase text-lg font-semibold text-center">
          Company restoration
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <Controller
            name="company"
            control={control}
            rules={{ required: 'Select company to restore' }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-2">
                  <Select
                    required
                    label="Select Company"
                    options={user_applications?.map((app) => {
                      return {
                        label: app?.company_details?.name,
                        value: app?.entry_id,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.company && (
                    <p className="text-red-500">
                      {String(errors?.company?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <section className="w-full flex flex-col gap-3">
            <h1 className="text-md uppercase font-medium flex items-center gap-1">
              Attachments <span className="text-red-600">*</span>
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

export default CompanyRestoration;
