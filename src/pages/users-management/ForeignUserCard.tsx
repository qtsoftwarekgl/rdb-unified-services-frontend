import Divider from "../../components/Divider";
import Modal from "../../components/Modal";
import Button from "../../components/inputs/Button";
import Table from "../../components/table/Table";
import { useState } from "react";
import ViewDocument from "../user-company-details/ViewDocument";

type User = {
  first_name: string;
  last_name: string;
  email: string;
  application_status: "approved" | "rejected" | "submitted";
  created_at: string;
  country: string;
  gender: string;
  address: string;
  city: string;
  phone: string;
  passport_expiry_date: string;
  passport_number: string;
  date_of_birth: string;
  attachments: [];
};

type Props = {
  user: User;
  setUserToView: (value: null) => void;
};

const UserCard = ({ user, setUserToView }: Props) => {
  const [attachmentPreview, setAttachmentPreview] = useState("");

  const attachmentColumns = [
    {
      header: "Document Type",
      accessorKey: "document_type",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2">
            <Button
              value="Preview"
              styled={false}
              className="!bg-transparent hover:underline"
              onClick={() => {
                setAttachmentPreview(row?.original?.document_url);
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={user !== null}
      onClose={() => setUserToView(null)}
      className="!w-full !bg-[#f7f7f7]"
    >
      <main className="flex flex-col w-full gap-6 p-4 ">
        <h1 className="pb-2 text-2xl font-medium text-secondary w-fit">
          User Information
        </h1>
        <Divider />
        {/* Personal Details */}
        <h1 className=" text-tertiary w-fit">Personal Details</h1>
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <h1 className="w-1/2 text-base font-semibold text-secondary ">
                Document Type
              </h1>
              <p className="w-1/2 text-gray-300">Passport</p>
            </div>
            <div className="flex ">
              <h1 className="w-1/2 text-base font-semibold text-secondary">
                Passport Number
              </h1>
              <p className="w-1/2 text-gray-300">{user?.passport_number}</p>
            </div>
            <div className="flex ">
              <h1 className="w-1/2 text-base font-semibold text-secondary">
                Expiry Date
              </h1>
              <p className="w-1/2 text-gray-300">
                {user?.passport_expiry_date || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">First Name</h1>
              <p className="w-1/2 text-gray-300">{user.first_name}</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary">Last Name</h1>
              <p className="w-1/2 text-gray-300">{user.last_name}</p>
            </div>
            <div className="flex text-base font-semibold">
              <h1 className="w-1/2 text-secondary">Gender</h1>
              <p className="w-1/2 text-gray-300">{user.gender}</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary">Applied on</h1>
              <p className="w-1/2 text-gray-300">{user.created_at}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-8 text-base font-semibold ">
              <h1 className="w-fit text-secondary ">Country</h1>
              <p className="w-1/2 text-gray-300">{user.country}</p>
            </div>
            <div className="flex gap-8 text-base font-semibold ">
              <h1 className="w-fit text-secondary ">City</h1>
              <p className="w-1/2 text-gray-300">{user.city}</p>
            </div>
            <div className="flex gap-8 text-base font-semibold ">
              <h1 className="w-fit text-secondary ">Email</h1>
              <p className="w-1/2 text-gray-300">{user.email}</p>
            </div>
            <div className="flex gap-8 text-base font-semibold ">
              <h1 className="w-fit text-secondary ">Phone</h1>
              <p className="w-1/2 text-gray-300">{user.phone}</p>
            </div>
          </div>
        </div>
        <label className="flex flex-col text-tertiary w-fit">Attachments</label>
        <Table
          columns={attachmentColumns}
          data={user?.attachments}
          showFilter={false}
          showPagination={false}
          className="!bg-white rounded-md"
        />
        {attachmentPreview && (
          <ViewDocument
            documentUrl={attachmentPreview}
            setDocumentUrl={setAttachmentPreview}
          />
        )}
        <menu className="flex items-center justify-end gap-12 mt-12">
          <Button
            onClick={() => setUserToView(null)}
            value="Reject User"
            className=" bg-red-600 text-red-600 bg-opacity-[0.07]  border border-red-600 hover:!bg-red-700 shadow-none"
          />
          <Button
            primary
            value="Approve User"
            onClick={() => setUserToView(null)}
          />
        </menu>
      </main>
    </Modal>
  );
};

export default UserCard;
