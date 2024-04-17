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
import moment from "moment";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type PreviewSubmissionProps = {
  entry_id: string | null;
  collateral_attachments: any;
  debtor_info: any;
  collateral_infos: any;
  secured_amount: number;
  collateral_type: string;
};

const PreviewSubmission: FC<PreviewSubmissionProps> = ({
  entry_id,
  collateral_attachments,
  debtor_info,
  collateral_infos,
  secured_amount,
  collateral_type,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columns = [
    {
      header: "Collateral UPIN/TIN",
      accessorKey: "collateral_id",
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
      header: "Valuer",
      accessorKey: "valuer",
    },
  ];

  return (
    <section className="flex flex-col w-full h-full gap-6 ">
      {debtor_info && (
        <PreviewCard
          header="Debtor Information"
          entry_id={entry_id}
          tabName="debtor_information"
          stepName="debtor_information"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          {Object?.entries(filterObject(debtor_info))
            ?.filter(([key]) => key !== "step")
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-1">
                  <span className="font-semibold">
                    {capitalizeString(key)}:
                  </span>{" "}
                  {String(value) && capitalizeString(String(value))}
                </p>
              );
            })}
        </PreviewCard>
      )}
      {
        <PreviewCard
          header="Secured Amount"
          entry_id={entry_id}
          tabName="collateral_information"
          stepName="collateral_information"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          <p className="flex items-center gap-1">
            <span className="font-semibold">{secured_amount} Rwf</span>{" "}
          </p>
        </PreviewCard>
      }
      {
        <PreviewCard
          header="Collateral Information"
          entry_id={entry_id}
          tabName="collateral_information"
          stepName="collateral_information"
          setActiveStep={setCollateralActiveStep}
          setActiveTab={setCollateralActiveTab}
        >
          {collateral_infos && (
            <Table
              data={
                collateral_infos?.map(
                  (collateral_info: unknown, index: number) => {
                    return {
                      ...collateral_info,
                      no: index,
                      description: collateral_info?.property_description,
                      value: collateral_info?.property_value,
                      valuer: collateral_info?.valuer_name,
                      collateral_id:
                        collateral_type === "immovable"
                          ? collateral_info?.upi_number
                          : collateral_info?.property_tin_number,
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
          entry_id={entry_id}
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
              dispatch(
                setCollateralApplications({
                  entry_id,
                  status: "submitted",
                  created_at: moment(Date.now()).format("DD/MM/YYYY"),
                })
              );
              navigate("/admin/collaterals");
            }, 1000);
          }}
        />
      </menu>
    </section>
  );
};

export default PreviewSubmission;
