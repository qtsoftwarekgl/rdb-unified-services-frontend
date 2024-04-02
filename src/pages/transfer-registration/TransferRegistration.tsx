import { Controller, FieldValues, useForm } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import Select from "../../components/inputs/Select";
import { cessationCompanies, dissolutionReasons } from "../../constants/businessRegistration";
import Input from "../../components/inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";
import Table from "../../components/table/Table";
import { useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

type Attachment = {
  file_name: string;
  file_size: string;
};

const TransferRegistration = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const [attachedFIles, setAttachedFiles] = useState<Attachment[]>([]);

  const navigate = useNavigate();

  const handleAttachFile = (files: File[]) => {
    if (files) {
      setAttachedFiles((prev) => [
        ...prev,
        ...Array.from(files).map((file) => {
          return {
            file_name: file.name,
            file_size: `${file.size} bytes`,
          };
        }),
      ]);
    }
  };

  const columns = [
    {
      header: "File Name",
      accessorKey: "file_name",
    },
    {
      header: "File Size",
      accessorKey: "file_size",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: { row: unknown }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                setAttachedFiles((prev) => {
                  return prev.filter(
                    (file) => file.file_name !== row?.original?.file_name
                  );
                });
              }}
              icon={faTrash}
              className="text-red-500 cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
            />
          </menu>
        );
      },
    },
  ];

  const onSubmit = (data: FieldValues) => {
    navigate("/success");
  };
  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
          Transfer of Registarion
        </menu>
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border max-sm:w-full w-[80%] mx-auto max-sm:p-4 p-20 flex flex-col gap-12 rounded-md border-[#e1e1e6]"
          >
            <menu className="w-1/2 max-sm:w-full">
              <Controller
                name="company"
                control={control}
                rules={{ required: 'Select a Company' }}
                render={({ field }) => (
                  <label className="flex flex-col">
                    <Select
                      label="Company"
                      options={cessationCompanies.map((company) => {
                        return {
                          value: company.name,
                          label: company.tin + '          ' + company.name,
                        };
                      })}
                      required
                      {...field}
                    />
                    {errors.company && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors.company.message)}
                      </p>
                    )}
                  </label>
                )}
              />
            </menu>
            <menu className="flex items-start w-full gap-8 max-sm:flex-col ">
              <Controller
                control={control}
                name="transfer_date"
                rules={{
                  required: 'Transfer Date is required',
                  validate: (value) => {
                    if (moment(value).format() < moment(new Date()).format()) {
                      return 'Select a valid Date';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <label className="flex flex-col w-1/2 gap-1 max-sm:w-full">
                    <Input
                      type="date"
                      label="Date of Transfer"
                      placeholder="Cessation Date"
                      onChange={field.onChange}
                      className="border-[0.5px] border-secondary rounded-md p-2"
                    />
                    {errors?.transfer_date && (
                      <p className="text-[13px] text-red-500">
                        {String(errors?.transfer_date?.message)}
                      </p>
                    )}
                  </label>
                )}
              />
              <Controller
                control={control}
                name="transfer_reason"
                rules={{ required: 'Transfer reason is required' }}
                render={({ field }) => (
                  <label className="flex flex-col w-1/2 gap-1 max-sm:w-full">
                    <Select
                      options={dissolutionReasons}
                      label="Transfer reason"
                      required
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors.transfer_reason && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors.transfer_reason.message)}
                      </p>
                    )}
                  </label>
                )}
              />
            </menu>
            <menu
              className={`${
                watch('transfer_reason') === 'other' ? 'flex' : 'hidden'
              } flex-col items-start w-full gap-3 my-3 max-md:items-center`}
            >
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Attachments <span className="text-red-600">*</span>
              </h3>
              <Controller
                name="attachment"
                rules={{
                  required:
                    watch('transfer_reason') === 'other'
                      ? 'Attach at least one document'
                      : false,
                }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                      <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                        <Input
                          type="file"
                          accept="application/pdf,image/*"
                          multiple
                          className="!w-fit max-sm:!w-full"
                          onChange={(e) => {
                            field.onChange(e?.target?.files);
                            handleAttachFile(e?.target?.files);
                          }}
                        />
                      </ul>
                      {errors?.attachment && (
                        <p className="text-sm text-red-500">
                          {String(errors?.attachment?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            {attachedFIles?.length > 0 && (
              <Table
                columns={columns}
                data={attachedFIles}
                showFilter={false}
                showPagination={false}
                headerClassName="bg-primary text-white"
              />
            )}
            <menu className="flex items-center justify-center w-full p-8">
              <Button value={'Submit'} primary submit />
            </menu>
          </form>
        </section>
      </section>
    </UserLayout>
  );
};

export default TransferRegistration;
