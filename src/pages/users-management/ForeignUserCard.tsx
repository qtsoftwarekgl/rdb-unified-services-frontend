import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "../../components/Divider";
import Modal from "../../components/Modal";
import Button from "../../components/inputs/Button";
import Table from "../../components/table/Table";
import { faEye } from "@fortawesome/free-regular-svg-icons";
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
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer text-primary"
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
    <Modal isOpen={user !== null} onClose={() => setUserToView(null)}>
      <main className="flex flex-col w-full gap-6 p-4 ">
        <h1 className="pb-2 text-2xl font-medium border-b text-secondary w-fit">
          User Profile
        </h1>
        {/* User Info */}
        <div className="flex justify-between">
          <div className="flex">
            <figure className="overflow-hidden inline w-[7rem] h-[7rem] relative rounded-full mr-4">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="object-cover w-full h-full"
              />
            </figure>

            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-secondary">
                {user.first_name + " " + user.last_name}
              </h1>
              <p className="text-lg font-light text-gray-500">Verifier</p>
              <p className="text-base font-light text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
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
                Document Number
              </h1>
              <p className="w-1/2 text-gray-300">11918191819</p>
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
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">Country</h1>
              <p className="w-1/2 text-gray-300">{user.country}</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">City</h1>
              <p className="w-1/2 text-gray-300">{user.city}</p>
            </div>
            <div className="flex text-base font-semibold ">
              <h1 className="w-1/2 text-secondary ">Phone</h1>
              <p className="w-1/2 text-gray-300">{user.phone}</p>
            </div>
          </div>
        </div>
        <label className="flex flex-col gap-4">Attachments</label>
        <Table
          columns={attachmentColumns}
          data={user?.attachments}
          showFilter={false}
          showPagination={false}
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
