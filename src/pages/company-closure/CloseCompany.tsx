import { useSelector } from 'react-redux';
import UserLayout from '../../containers/UserLayout';
import { RootState } from '../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import TextArea from '../../components/inputs/TextArea';
import Table from '../../components/table/Table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Button from '../../components/inputs/Button';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const CloseCompany = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // STATE VARIABLES
  const { user_applications } = useSelector(
    (state: RootState) => state.businessRegistration
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
          <menu className="w-full flex items-start gap-5 flex-wrap">
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
                          label: application?.company_details?.name,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e?.value);
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
            <Controller
              name="dissolution_date"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input type="date" label="Date of dissolution" {...field} />
                  </label>
                );
              }}
            />
          </menu>
          <Controller
            name="dissolution_reason"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    label="Dissolution reason"
                    placeholder="Use this space to add more context to your request"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <section className="w-full flex flex-col gap-3">
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

export default CloseCompany;
