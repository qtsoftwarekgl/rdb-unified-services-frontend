import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import Table from "@/components/table/Table";
import AdminLayout from "@/containers/AdminLayout";
import { generateUUID } from "@/helpers/strings";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
  setCollateralApplications,
} from "@/states/features/collateralRegistrationSlice";
import { RootState } from "@/states/store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CollateralList = () => {
  const [showCollateralTypeModal, setShowCollateralTypeModal] = useState(false);
  const { collateral_applications } = useSelector(
    (state: RootState) => state.collateralRegistration
  );

  const applications = collateral_applications
    .filter((app) => app.status)
    .map((app) => {
      return {
        description: app?.description,
        secured_amount: app?.secured_amount,
        debtor: app?.debtor_info?.debtor_names,
        status: app?.status,
        submission_date: app?.created_at,
      };
    });
  const columns = [
    { header: "Debtors Name", accessorKey: "debtor" },
    { header: "Credit Amount (Rwf)", accessorKey: "secured_amount" },
    { header: "Status", accessorKey: "status" },
    { header: "Submission Date", accessorKey: "submission_date" },
    {
      header: "Action",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                console.log("view", e);
              }}
              value="View"
              styled={false}
              className="cursor-pointer text-primary"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <section className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#fff] rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            Collateral List
          </h1>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              setShowCollateralTypeModal(true);
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                New Collateral
              </menu>
            }
          />
        </menu>
        <Table
          columns={columns}
          data={applications || []}
          showFilters={false}
          showPagination={false}
        />

        <NewCollateralType
          isOpen={showCollateralTypeModal}
          onClose={() => setShowCollateralTypeModal(false)}
        />
      </section>
    </AdminLayout>
  );
};

const NewCollateralType = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { control, watch, handleSubmit, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const entry_id = generateUUID();
      dispatch(
        setCollateralApplications({
          collateral_type: data.collateral_type,
          entry_id,
        })
      );
      dispatch(setCollateralActiveTab("debtor_information"));
      dispatch(setCollateralActiveStep("debtor_information"));
      navigate(`/admin/collateral?entry_id=${entry_id}`);
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setValue("collateral_type", "");
        onClose();
      }}
    >
      <menu className="flex flex-col gap-8 p-8">
        <p>What is the type of collateral you want to register?</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <Controller
            name="collateral_type"
            control={control}
            render={({ field }) => {
              return (
                <ul className="flex items-center gap-3">
                  <Input
                    type="radio"
                    label="Movable"
                    checked={watch("collateral_type") === "movable"}
                    {...field}
                    value={"movable"}
                  />
                  <Input
                    type="radio"
                    label="Immovable"
                    checked={watch("collateral_type") === "immovable"}
                    {...field}
                    value={"immovable"}
                  />
                </ul>
              );
            }}
          />
          <Button
            value={isLoading ? <Loader /> : "Continue"}
            primary
            submit
            disabled={!watch("collateral_type")}
          />
        </form>
      </menu>
    </Modal>
  );
};

export default CollateralList;
