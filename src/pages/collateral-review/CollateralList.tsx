import Button from "@/components/inputs/Button";
import RowSelectionCheckbox from "@/components/table/RowSelectionCheckbox";
import Table from "@/components/table/Table";
import AdminLayout from "@/containers/AdminLayout";
import { capitalizeString } from "@/helpers/strings";
import {
  setCollateralReviewActiveStep,
  setCollateralReviewActiveTab,
} from "@/states/features/collateralReviewSlice";
import { RootState } from "@/states/store";
import { Row } from "@tanstack/react-table";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CollateralList = () => {
  const { collateral_applications } = useSelector(
    (state: RootState) => state.collateralRegistration
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allCollateral = collateral_applications
    .filter((app) => app.status)
    .flatMap((loan) =>
      loan?.collateral_infos?.map((collateral) => ({
        ...collateral,
        creditor_name: loan?.creditor?.name,
        loan_amount: loan?.loan_amount,
        status: capitalizeString(collateral?.status),
      }))
    );

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
      header: "Bank Name",
      accessorKey: "creditor_name",
      id: "creditor_name",
      enableFiltering: true,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    { header: "Credit Amount (Rwf)", accessorKey: "loan_amount" },
    {
      header: "Collateral Nature",
      accessorKey: "property_nature",
      id: "property_nature",
      enableFiltering: true,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    { header: "Secured Value", accessorKey: "secured_amount" },
    { header: "Status", accessorKey: "status" },
    {
      header: "Action",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                dispatch(setCollateralReviewActiveTab("property"));
                dispatch(setCollateralReviewActiveStep("property"));
                navigate(
                  `/admin/collateral-review?entryId=${row?.original?.loan_id}&collateral_id=${row?.original?.collateral_id}`
                );
              }}
              value="Review"
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
        </menu>
        <Table
          columns={columns}
          data={allCollateral || []}
          showFilter={true}
          showPagination={true}
        />
      </section>
    </AdminLayout>
  );
};

export default CollateralList;
