import { Controller, useForm, FieldValues } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import Select from "../../components/inputs/Select";
import { cessationCompanies } from "../../constants/BusinessRegistration";
import Input from "../../components/inputs/Input";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";

type Attachment = {
  file_name: string;
  file_size: string;
};

const CessationToDormant = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [attachedFIles, setAttachedFiles] = useState<Attachment[]>([]);
  const navigate = useNavigate();

  const handleAttachFile = () => {
    if (attachmentFile) {
      setAttachedFiles((prev) => [
        ...prev,
        {
          file_name: attachmentFile.name,
          file_size: `${attachmentFile.size} bytes`,
        },
      ]);
      setAttachmentFile(null);
      setValue("attachment", null);
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
                return row;
              }}
              icon={faEdit}
              className="text-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
            />
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
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
    console.log(">>>>>>>>>>>>>>>>", data);
    navigate("/success");
  };

  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md w-72 bg-primary">
          Cessation to be Dormant
        </menu>
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <h1 className="text-xl text-center">Cessation to be Dormant</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-[0.5px] w-[80%] mx-auto p-20 flex flex-col gap-12 rounded-md border-secondary"
          >
            <menu className="w-80">
              <Controller
                name="company"
                control={control}
                rules={{ required: "Select a Company" }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Select
                      label="Company"
                      options={cessationCompanies.map((company) => {
                        return {
                          value: company.name,
                          label: company.tin + "          " + company.name,
                        };
                      })}
                      required
                      onChange={(e) => {
                        field.onChange(e?.value);
                        setValue(
                          "cessation_date",
                          cessationCompanies.find(
                            (company) => company.name === e?.value
                          )?.cessation_date
                        );
                      }}
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
            <menu className="w-80">
              <Controller
                control={control}
                name="cessation_date"
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Input
                      type="date"
                      placeholder="Cessation Date"
                      className="border-[0.5px] border-secondary rounded-md p-2"
                      {...field}
                    />
                  </label>
                )}
              />
            </menu>
            <menu className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center">
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Attachment <span className="text-red-600">*</span>
              </h3>
              <Controller
                name="attachment"
                rules={{ required: "Document attachment is required" }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                      <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                        <Input
                          type="file"
                          accept="application/pdf,image/*"
                          className="!w-fit max-sm:!w-full"
                          onChange={(e) => {
                            field.onChange(e?.target?.files?.[0]);
                            setAttachmentFile(e?.target?.files?.[0]);
                          }}
                        />
                        {attachmentFile && (
                          <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                            {attachmentFile?.name}
                            <FontAwesomeIcon
                              icon={faX}
                              className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                              onClick={(e) => {
                                e.preventDefault();
                                setAttachmentFile(null);
                                setValue("attachment", null);
                              }}
                            />
                          </p>
                        )}
                        {attachmentFile && (
                          <Button
                            primary
                            value="Attach"
                            onClick={handleAttachFile}
                          />
                        )}
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
              />
            )}
            <menu className="flex items-center justify-center w-full p-8">
              <Button value={"Submit"} primary submit />
            </menu>
          </form>
        </section>
      </section>
    </UserLayout>
  );
};

export default CessationToDormant;
