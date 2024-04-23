import { Controller, FieldValues, useForm } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import Select from "../../components/inputs/Select";
import { cessationCompanies } from "../../constants/businessRegistration";
import { useState } from "react";
import Input from "../../components/inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";

type Attachment = {
  file_name: string;
  file_size: string;
};

const Amalgamation = () => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
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
          document_type: watch("document_type").label,
        },
      ]);
      setAttachmentFile(null);
      setValue("attachment", null);
    }
  };

  const onSubmit = (data: FieldValues) => {
    navigate("/success");
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
      header: "Document Type",
      accessorKey: "document_type",
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
              }}
              icon={faTrash}
              className="text-red-500 cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
          Amalgamation
        </menu>
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <form
            className="flex flex-col gap-8 w-[80%] max-sm:w-full mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-base font-semibold ">
              Select Company to Amalgamate{" "}
            </h1>
            <menu className="flex px-8 py-12 border items-start w-full gap-8 rounded max-sm:flex-col border-[#e1e1e6]">
              <Controller
                name="amalgamate_from"
                control={control}
                rules={{ required: "Select a Company" }}
                render={({ field }) => (
                  <label className="flex flex-col w-1/2 max-sm:w-full">
                    <Select
                    placeholder="Select Company"
                      label="Amalgamate from"
                      options={cessationCompanies.map((company) => {
                        return {
                          value: company.name,
                          label: company.tin + "          " + company.name,
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
              <Controller
                name="amalgamate_to"
                control={control}
                rules={{ required: "Select a Company" }}
                render={({ field }) => (
                  <label className="flex flex-col w-1/2 max-sm:w-full">
                    <Select
                      label="Amalgamate to"
                      options={cessationCompanies
                        .map((company) => {
                          return {
                            value: company.name,
                            label: company.tin + "          " + company.name,
                          };
                        })
                        .filter(
                          (company) =>
                            company.value !== watch("amalgamate_from")?.value
                        )}
                      required
                      placeholder="Select Company"
                      {...field}
                    />
                    {errors?.company && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.company.message)}
                      </p>
                    )}
                  </label>
                )}
              />
            </menu>
            <h1 className="text-base font-semibold">
              Please attach required documents to amalgamate with above company
            </h1>
            <menu className="flex items-start gap-8">
              <Controller
                control={control}
                name="document_type"
                rules={{ required: "Select a document type" }}
                render={({ field }) => (
                  <label className="flex flex-col w-1/2 gap-1 max-sm:w-full">
                    <Select
                      label="Document Type"
                      options={[
                        { value: "1", label: "Memorandum of Association" },
                        { value: "2", label: "Artcile of Association" },
                        { value: "3", label: "Ownership Certificate" },
                      ]}
                      required
                      placeholder="Select Document Type"
                      {...field}
                    />
                    {errors?.document_type && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.document_type.message)}
                      </p>
                    )}
                  </label>
                )}
              />
              <Controller
                name="attachment"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col  w-1/2 self-end mb-2  items-start gap-2 max-sm:!w-full">
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
                headerClassName="bg-primary text-white"
              />
            )}
            <menu className="flex items-center justify-center w-full p-8">
              <Button
                value={" Save & Submit"}
                disabled={!attachedFIles.length}
                primary
                submit
              />
            </menu>
          </form>
        </section>
      </section>
    </UserLayout>
  );
};

export default Amalgamation;
