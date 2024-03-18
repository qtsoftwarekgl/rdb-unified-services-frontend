import { Controller, useForm, FieldValues } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import Select from "../../components/inputs/Select";
import { cessationCompanies } from "../../constants/businessRegistration";
import Input from "../../components/inputs/Input";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/Button";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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
                  console.log(prev, row);
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
    console.log(">>>>>>>>>>>>>>>>", data);
    navigate("/success");
  };

  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        {/* <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
          Cessation to be Dormant
        </menu> */}
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <h1 className="text-xl text-center">Cessation to be Dormant</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border max-sm:w-full w-[80%] mx-auto max-sm:p-4 p-20 flex flex-col gap-12 rounded-md border-[#e1e1e6]"
          >
            <menu className="w-1/2 max-sm:w-full">
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
                          moment(
                            cessationCompanies.find(
                              (company) => company.name === e?.value
                            )?.cessation_date
                          ).format("DD/MM/YYYY")
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
            <menu className="w-1/2 max-sm:w-full">
              <Controller
                control={control}
                name="cessation_date"
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <Input
                      label="Cessation Date"
                      placeholder="Cessation Date"
                      defaultValue={field.value}
                      value={field.value}
                      onChange={field.onChange}
                      className="border-[0.5px] border-secondary rounded-md p-2"
                    />
                  </label>
                )}
              />
            </menu>
            <menu className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center">
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Attachments <span className="text-red-600">*</span>
              </h3>
              <Controller
                name="attachment"
                rules={{
                  validate: () => {
                    if (attachedFIles?.length === 0) {
                      return "Attachments are required";
                    }
                    return true;
                  },
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
              <Button value={"Submit"} primary submit />
            </menu>
          </form>
        </section>
      </section>
    </UserLayout>
  );
};

export default CessationToDormant;
