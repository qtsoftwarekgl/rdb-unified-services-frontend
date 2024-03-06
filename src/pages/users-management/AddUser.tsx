import {
  Controller,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import Modal from "../../components/Modal";
import Select from "../../components/inputs/Select";
import validateInputs from "../../helpers/Validations";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";

interface Props {
  openUserModal: boolean;
  setOpenUserModal: (value: boolean) => void;
}

const AddUser = ({ openUserModal, setOpenUserModal }: Props) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  interface UserPayload {
    role: string;
    permissions: string[];
    documentType: string;
    documentNumber: string;
    nationality: string;
    phoneNumber: string;
    country: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  }

  const onSubmit: SubmitHandler<FieldValues | UserPayload> = (data) => {
    console.log(data);
  };

  return (
    <Modal
      isOpen={openUserModal}
      onClose={() => {
        setOpenUserModal(false);
      }}
      className="!min-w-[70%] !max-w-[1400px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="px-8">
        <h1 className="text-2xl font-normal md:my-4 2xl:my-12">Add New User</h1>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-8">
            <div className="w-1/2">
              <Controller
                name="role"
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Select
                        label="Role"
                        options={[
                          { label: "Admin", value: "admin" },
                          { label: "User", value: "user" },
                        ]}
                        {...field}
                      />
                    </label>
                  );
                }}
                control={control}
              />
            </div>
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Select
                        label="Permissions"
                        multiple={true}
                        styled
                        options={[
                          { label: "read", value: "read" },
                          { label: "write", value: "write" },
                        ]}
                        {...field}
                      />
                    </label>
                  );
                }}
                name="permissions"
                control={control}
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Select
                        label="Document Type"
                        options={[
                          { label: "NID", value: "NID" },
                          { label: "Passport", value: "passport" },
                        ]}
                        {...field}
                      />
                    </label>
                  );
                }}
                name="documentType"
                control={control}
              />
            </div>
            <div className="w-1/2">
              <Controller
                name="documentNumber"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        search
                        label="ID Document No"
                        {...field}
                        required
                      />
                      {errors.documentNumber && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors.documentNumber.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
                rules={{ required: "ID Document Number is required" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Select
                        label="Nationality"
                        options={[
                          { label: "Admin", value: "admin" },
                          { label: "User", value: "user" },
                        ]}
                        {...field}
                      />
                    </label>
                  );
                }}
                name="nationality"
                control={control}
              />
            </div>
            <div className="w-1/2">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Phone Number"
                        {...field}
                        className="h-10"
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors.phoneNumber.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
                rules={{
                  required: "Phone Number is required",
                  validate: (value) => validateInputs(value, "tel"),
                }}
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="w-1/2">
              <Controller
                name="country"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input label="Country" {...field} required />
                      {errors.country && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors.country.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
                rules={{ required: "Country is required" }}
              />
            </div>
            <div className="w-1/2">
              <Controller
                name="province"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input label="Province" {...field} required />
                      {errors.province && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors.province.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
                rules={{ required: "Province is required" }}
              />
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input label="District" {...field} required />
                      {errors.district && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors.district.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
                rules={{ required: "District is required" }}
                name="district"
                control={control}
              />
            </div>
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input label="Sector" {...field} required />
                      {errors.sector && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors.sector.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
                rules={{ required: "Sector is required" }}
                name="sector"
                control={control}
              />
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input label="Cell" {...field} />
                    </label>
                  );
                }}
                name="cell"
                control={control}
              />
            </div>
            <div className="w-1/2">
              <Controller
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input label="Village" {...field} />
                    </label>
                  );
                }}
                name="village"
                control={control}
              />
            </div>
          </div>
        </div>
        <menu className="flex items-center justify-between mt-12">
          <Button
            onClick={() => {
              setOpenUserModal(false);
            }}
            value="Cancel"
            className="uppercase border shadow-none border-primary text-primary"
          />
          <Button submit primary value="Create" className="uppercase" />
        </menu>
      </form>
    </Modal>
  );
};

export default AddUser;
