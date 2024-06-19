import Loader from "@/components/Loader";
import PreviewCard from "@/components/business-registration/PreviewCard";
import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import { capitalizeString, filterObject } from "@/helpers/strings";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
  setCollateralApplications,
} from "@/states/features/collateralRegistrationSlice";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApplicationSuccess from "./ApplicationSuccess";

type PreviewSubmissionProps = {
  entryId: string | null;
  collateral_attachments: any;
  debtor_info: any;
  collateral_infos: any;
  loan_amount: number;
  collateral_type: string;
  isAOMADownloaded: boolean;
};

const PreviewSubmission: FC<PreviewSubmissionProps> = ({
  entryId,
  collateral_attachments,
  debtor_info,
  collateral_infos,
  loan_amount,
  collateral_type,
  isAOMADownloaded,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const columns = [
    {
      header: "Collateral UPIN/TIN",
      accessorKey: "collateral_id_number",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Value",
      accessorKey: "value",
    },
    {
      header: "Secured Amount",
      accessorKey: "secured_amount",
    },
    {
      header: "Valuer",
      accessorKey: "valuer",
    },
  ];

  return (
    <section className="flex flex-col w-full h-full gap-6 ">
      {debtor_info && (
        <PreviewCard
          header="Debtor Information"
          entryId={entryId}
          tabName="debtor_information"
          stepName="debtor_information"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          {Object?.entries(filterObject(debtor_info))
            ?.filter(([key]) => key !== "step")
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-2">
                  <span className="">{capitalizeString(key)}:</span>{" "}
                  <span className="font-bold">
                    {String(value) && capitalizeString(String(value))}
                  </span>
                </p>
              );
            })}
        </PreviewCard>
      )}
      {
        <PreviewCard
          header="Loan Amount"
          entryId={entryId}
          tabName="collateral_information"
          stepName="collateral_information"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          {loan_amount && (
            <p className="flex items-center gap-1">
              <span className="font-semibold">{loan_amount} Rwf</span>{" "}
            </p>
          )}
        </PreviewCard>
      }
      {
        <PreviewCard
          header="Collateral Information"
          entryId={entryId}
          tabName="collateral_information"
          stepName="collateral_information"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          {collateral_infos && (
            <Table
              showFilter={false}
              rowClickHandler={undefined}
              showPagination={false}
              data={
                collateral_infos?.map(
                  (collateral_info: unknown, index: number) => {
                    return {
                      ...collateral_info,
                      no: index,
                      description: collateral_info?.property_description,
                      value: collateral_info?.property_value,
                      valuer: collateral_info?.valuer_name,
                      collateral_id_number:
                        collateral_type === "immovable"
                          ? collateral_info?.upi_number
                          : collateral_info?.vehicle_plate_number || "N/A",
                    };
                  }
                ) || []
              }
              columns={columns}
            />
          )}
        </PreviewCard>
      }
      {
        <PreviewCard
          header="Attachments"
          entryId={entryId}
          tabName="attachments"
          stepName="attachments"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          <menu className="flex flex-col gap-2">
            {collateral_attachments?.fileNames?.map(
              (attachment: string, index: number) => {
                return (
                  <p key={index} className="flex items-center gap-1">
                    <span className="font-semibold">{attachment}</span>
                  </p>
                );
              }
            )}
          </menu>
        </PreviewCard>
      }
      <menu className="flex items-center justify-between w-full gap-3 mx-auto max-sm:flex-col-reverse">
        <Button
          value={"Back"}
          onClick={(e) => {
            e.preventDefault();
            setCollateralActiveTab("attachments");
            setCollateralActiveStep("attachments");
          }}
        />
        <Button
          primary
          value={isLoading ? <Loader /> : "Submit"}
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setOpenSuccessModal(true);
              if (isAOMADownloaded) {
                dispatch(
                  setCollateralApplications({
                    entryId,
                    status: "Pending for approval",
                  })
                );
              }
            }, 1000);
          }}
        />
      </menu>
      <ApplicationSuccess
        isOpen={openSuccessModal}
        onClose={() => {
          setOpenSuccessModal(false);
          if (isAOMADownloaded) navigate("/admin/collaterals");
        }}
        entryId={entryId}
        isAOMADownloaded={isAOMADownloaded}
      />
    </section>
  );
};

export default PreviewSubmission;
