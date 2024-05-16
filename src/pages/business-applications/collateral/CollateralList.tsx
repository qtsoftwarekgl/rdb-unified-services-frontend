import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { ReviewComment } from "@/components/applications-review/AddReviewComments";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import RowSelectionCheckbox from "@/components/table/RowSelectionCheckbox";
import Table from "@/components/table/Table";
import { RDBVerifierAndApproverEmailPattern } from "@/constants/Users";
import { bankData } from "@/constants/authentication";
import AdminLayout from "@/containers/AdminLayout";
import { capitalizeString, formatDate, generateUUID } from "@/helpers/strings";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
  setCollateralApplications,
} from "@/states/features/collateralRegistrationSlice";
import { RootState } from "@/states/store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CollateralList = () => {
  const [showCollateralTypeModal, setShowCollateralTypeModal] = useState(false);
  const { collateral_applications } = useSelector(
    (state: RootState) => state.collateralRegistration
  );
  const { application_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasComments = (applicationId: string) => {
    return application_review_comments.some(
      (comment: ReviewComment) =>
        comment?.entry_id === applicationId && !comment?.checked
    );
  };

  const { user } = useSelector((state: RootState) => state.user);
  if (RDBVerifierAndApproverEmailPattern.test(user?.email)) {
    navigate("/admin/review-collaterals");
  }

  const applications = collateral_applications
    .filter((app) => app.status)
    .map((app) => {
      return {
        description: app?.description,
        loan_amount: app?.loan_amount,
        debtor: app?.debtor_info?.debtor_names,
        status: app?.status,
        createdAt: app?.createdAt,
        entry_id: app?.entry_id,
      };
    });
  const columns = [
    {
      id: "row-selector",
      accessorKey: "row-selector",
      header: ({ table }) => {
        return <RowSelectionCheckbox isHeader table={table} />;
      },
      cell: ({
        row,
      }: {
        row: Row<{
          name: string;
          image: string;
        }>;
      }) => {
        return <RowSelectionCheckbox row={row} />;
      },
    },
    {
      header: "Debtors Name",
      accessorKey: "debtor",
      id: "debtor",
      enableFiltering: true,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    { header: "Credit Amount (Rwf)", accessorKey: "loan_amount" },
    {
      header: "Status",
      accessorKey: "status",
      id: "status",
      enableFiltering: true,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        return capitalizeString(row?.original?.status);
      },
    },
    { header: "Date Added", accessorKey: "createdAt" },
    {
      header: "Action",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2 cursor-pointer">
            {hasComments(row?.original?.entry_id) ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setCollateralActiveTab("debtor_information"));
                  dispatch(setCollateralActiveStep("debtor_information"));
                  navigate(
                    `/admin/collateral?entry_id=${row?.original?.entry_id}`
                  );
                }}
                value="Resolve Comments"
                styled={false}
                className="!text-red-500  !truncate hover:underline cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
              />
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setCollateralActiveTab("debtor_information"));
                  dispatch(setCollateralActiveStep("debtor_information"));
                  navigate(
                    `/admin/collateral?entry_id=${row?.original?.entry_id}`
                  );
                }}
                value="View"
                styled={false}
                className="!text-primary !truncate hover:underline cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
              />
            )}
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
          showFilter={true}
          showPagination={true}
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
          creditor: bankData[Math.floor(Math.random() * 3)],
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
