import { useState } from "react";
import Button from "../../components/inputs/Button";
import Modal from "../../components/Modal";
import Select from "../../components/inputs/Select";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateAmendment = () => {
  const [createAmandment, setCreateAmandment] = useState<boolean>(false);
  const [amendmentType, setAmendmentType] = useState<string>("");

  const amendmentTypes = [
    {
      label: "Amend Company Details",
      value: "/amend-company-details",
      description: "Change company details such as name, address, etc.",
    },
    {
      label: "Add new Branch",
      value: "/new-branch",
      description: "This allows you to add a new branch to the company.",
    },
    {
      label: "Amalgamation",
      value: "/amalgamation",
      description: "This allows you to merge two or more companies.",
    },
    {
      label: "Declaration of company Dormancy",
      value: "/company-dormancy",
      description: "This allows you to declare the company dormant.",
    },
    {
      label: "Cessation to be Dormant",
      value: "/cessation-dormant",
      description: "This allows you to cease the company's dormancy.",
    },
    {
      label: "Cessation to be Dormant",
      value: "/cessation-dormant",
      description: "This allows you to cease the company's dormancy.",
    },
    {
      label: "Closing of Company",
      value: "/close-company",
      description: "This allows you to close the company.",
    },
    {
      label: "Transfer of Company Experience",
      value: "/transfer-company-experience",
      description: "This allows you to transfer the company's experience.",
    },
    {
      label: "Transfer of Registration",
      value: "/transfer-registration",
      description: "This allows you to transfer the company's registration.",
    },
    {
      label: "Beneficial Ownership",
      value: "/beneficial-ownership",
      description:
        "This allows you to change the company's beneficial ownership.",
    },
    {
      label: "Company Restoration",
      value: "/company-restoration",
      description: "This allows you to restore the company.",
    },
  ];

  return (
    <menu className="flex items-center justify-end gap-3">
      <Button
        primary
        onClick={() => setCreateAmandment(true)}
        value={
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} />
            Add Amendment
          </menu>
        }
      />
      {createAmandment && (
        <Modal
          isOpen={createAmandment}
          onClose={() => setCreateAmandment(false)}
        >
          <section className="flex flex-col gap-8 p-4">
            <h1 className="text-2xl">
              Are you sure, you want to create an amendment?
            </h1>
            <Select
              label="Amendment Type"
              value={amendmentType}
              onChange={(e) => {
                setAmendmentType(e);
              }}
              options={amendmentTypes}
              className="text-lg"
            />
            {amendmentType && (
              <section className="flex flex-col gap-4">
                <h1 className="text-lg">Amendment Description</h1>
                <p className="text-sm">
                  {
                    amendmentTypes.find((type) => type.value === amendmentType)
                      ?.description
                  }
                </p>
              </section>
            )}
            <menu className="flex justify-between w-full">
              <Button
                value={"Cancel"}
                onClick={() => {
                  setCreateAmandment(false);
                  setAmendmentType("");
                }}
              />
            </menu>
          </section>
        </Modal>
      )}
    </menu>
  );
};

export default CreateAmendment;
