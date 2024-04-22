import { FC, useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "../../../components/table/Table";
import { capitalizeString, generateUUID } from "../../../helpers/strings";
import {
  removeBusinessCompletedStep,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setCapitalDetailsModal,
} from "../../../states/features/businessRegistrationSlice";
import CapitalDetailsModal from "./CapitalDetailsModal";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import { useForm } from "react-hook-form";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { business_share_details } from "./ShareDetails";
import { business_shareholders } from "./ShareHolders";
import { RDBAdminEmailPattern } from "../../../constants/Users";

export interface business_capital_details {
  no: number;
  first_name?: string;
  id: string;
  shareholder_id: string;
  last_name?: string;
  company_name?: string;
  shareholder_type?: string;
  shares: {
    total_shares?: number;
    total_value?: number;
  };
}

interface CapitalDetailsProps {
  isOpen: boolean;
  capital_details: business_capital_details[];
  entry_id: string | null;
  share_details: business_share_details;
  shareholders: business_shareholders[];
  status: string;
}

const CapitalDetails: FC<CapitalDetailsProps> = ({
  isOpen,
  capital_details = [],
  entry_id,
  share_details,
  shareholders = [],
  status,
}) => {
  // REACT HOOK FORM
  const {
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    preview: false,
    submit: false,
    amend: false,
  });
  const [shareholderShareDetails, setShareholderShareDetails] = useState(null);
  const [assignedShares, setAssignedShares] = useState<object>({
    number: 0,
    value: 0,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  useEffect(() => {
    setAssignedShares({
      ...assignedShares,
      number: capital_details
        ?.filter(
          (shareholder) => shareholder?.shares?.total_shares !== undefined
        )
        ?.reduce(
          (acc, curr) => Number(acc) + Number(curr?.shares?.total_shares),
          0
        ),
      value: capital_details
        ?.filter(
          (shareholder) => shareholder?.shares?.total_value !== undefined
        )
        ?.reduce(
          (acc, curr) => Number(acc) + Number(curr?.shares?.total_value),
          0
        ),
    });
  }, [capital_details]);

  // TABLE COLUMNS
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Number of shares",
      accessorKey: "total_shares",
    },
    {
      header: "Total value",
      accessorKey: "total_value",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className={`cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
              icon={disableForm ? faCircleInfo : faPenToSquare}
              onClick={(e) => {
                e.preventDefault();
                setShareholderShareDetails(row?.original);
                clearErrors("total_shares");
                dispatch(setCapitalDetailsModal(true));
              }}
            />
            <FontAwesomeIcon
              className={`${
                disableForm
                  ? "text-secondary cursor-default"
                  : "text-red-600 cursor-pointer"
              } font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                if (disableForm) return;
                dispatch(
                  setUserApplications({
                    entry_id,
                    share_details,
                  })
                );
                dispatch(
                  setUserApplications({
                    entry_id,
                    capital_details: capital_details?.filter(
                      (capital) => capital?.id !== row?.original?.id
                    ),
                    share_details: {
                      ...share_details,
                      shares: share_details?.shares?.map((share) => {
                        return {
                          ...share,
                          remaining_shares:
                            share?.remaining_shares +
                              (Number(row?.original?.shares[share?.name]) ||
                                0) || undefined,
                        };
                      }),
                    },
                    shareholders: shareholders?.filter(
                      (shareholder) =>
                        shareholder?.id !== row?.original?.shareholder_id
                    ),
                  })
                );
              }}
            />
          </menu>
        );
      },
    },
  ];

  // SET CAPITAL DETAILS
  useEffect(() => {
    if (
      capital_details?.length <= 0 ||
      shareholders?.length > capital_details?.length
    ) {
      const filteredShareholders = shareholders
        ?.map((shareholder) => {
          if (
            capital_details?.find(
              (capital) => capital?.shareholder_id === shareholder?.id
            ) === undefined
          ) {
            return {
              ...shareholder,
              id: generateUUID(),
              shareholder_id: shareholder?.id,
              shares: {
                total_shares: 0,
              },
            };
          } else return null;
        })
        ?.filter((item) => item !== null);
      dispatch(
        setUserApplications({
          entry_id,
          capital_details: [
            ...filteredShareholders,
            ...capital_details,
          ]?.filter((item) => item !== null),
        })
      );
    }
  }, [dispatch]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-6">
      <menu className="flex flex-col w-full gap-2">
        {shareholders?.length > 0 ? (
          <Table
            header="Shareholders"
            data={
              capital_details?.length > 0
                ? capital_details?.map(
                    (shareholder: unknown, index: number) => {
                      return {
                        ...shareholder,
                        no: index,
                        name: shareholder?.first_name
                          ? `${shareholder?.first_name || ""} ${
                              shareholder?.last_name || ""
                            }`
                          : shareholder?.company_name,
                        type: capitalizeString(shareholder?.shareholder_type),
                        total_shares: shareholder?.shares?.total_shares || 0,
                        total_value: `RWF ${
                          shareholder?.shares?.total_value || 0
                        }`,
                      };
                    }
                  )
                : []
            }
            columns={columns}
            showFilter={false}
            showPagination={false}
          />
        ) : (
          <menu className="flex flex-col gap-2">
            <p className="text-center text-[14px] text-gray-500">
              No shareholders have been added yet.
            </p>
            <Button
              value="Click here to add shareholders"
              styled={false}
              className="hover:underline"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveTab("capital_information"));
                dispatch(removeBusinessCompletedStep("capital_details"));
                dispatch(dispatch(removeBusinessCompletedStep("shareholders")));
                dispatch(setBusinessActiveStep("shareholders"));
              }}
            />
          </menu>
        )}
        {errors?.total_shares && (
          <p className="text-red-500 text-[13px] text-center">
            {String(errors?.total_shares?.message)}
          </p>
        )}
      </menu>
      <CapitalDetailsModal
        capital_details={capital_details}
        share_details={share_details}
        entry_id={entry_id}
        shareholder={shareholderShareDetails}
      />
      <section className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg uppercase text-[16px]">
          Overall capital details
        </h1>
        <menu className="flex flex-col w-full gap-1">
          <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total number of assignable shares</h2>
            <p>{share_details?.total_shares}</p>
          </ul>
          <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total number of assigned shares</h2>
            <p>{assignedShares?.number}</p>
          </ul>
          <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Remaining number of assignable shares</h2>
            <p>
              {Number(share_details?.total_shares ?? 0) -
                Number(assignedShares?.number)}
            </p>
          </ul>
        </menu>
        <menu className="flex flex-col w-full gap-2">
          <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total value of assignable shares</h2>
            <p>RWF {share_details?.total_value}</p>
          </ul>
          <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Value of assigned shares</h2>
            <p>RWF {assignedShares?.value}</p>
          </ul>
          <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2 className="font-medium underline uppercase">
              Remaning value of assignable shares
            </h2>
            <p className="underline">
              RWF{" "}
              {Number(share_details?.total_value ?? 0) -
                Number(assignedShares?.value)}
            </p>
          </ul>
        </menu>
      </section>
      <menu
        className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          disabled={disableForm}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setBusinessActiveStep("shareholders"));
            dispatch(setBusinessActiveTab("capital_information"));
          }}
        />
        {status === "is_Amending" && (
          <Button
            disabled={disableForm || Object.keys(errors).length > 0}
            value={isLoading?.amend ? <Loader /> : "Complete Amendment"}
            onClick={(e) => {
              e.preventDefault();

              // SET ACTIVE TAB AND STEP
              const active_tab = "preview_submission";
              const active_step = "preview_submission";

              // CHECK FOR SHAREHOLDERS WITH 0 SHARES
              if (
                capital_details?.filter(
                  (shareholder) => shareholder?.shares?.total_shares === 0
                )?.length > 0
              ) {
                setError("total_shares", {
                  type: "manual",
                  message:
                    "Some shareholders have 0 shares assigned. Update their shares or remove them from the list to continue.",
                });
                return;
              }
              setIsLoading({
                ...isLoading,
                submit: false,
                preview: false,
                amend: true,
              });

              setTimeout(() => {
                setIsLoading({
                  ...isLoading,
                  submit: false,
                  preview: false,
                  amend: false,
                });
                clearErrors("total_shares");
                dispatch(setBusinessCompletedStep("capital_details"));
                dispatch(setBusinessActiveStep(active_step));
                dispatch(setBusinessActiveTab(active_tab));
                dispatch(
                  setUserApplications({
                    entry_id,
                    active_step,
                    active_tab,
                  })
                );
              }, 1000);
            }}
          />
        )}
        {status === "in_preview" && (
          <Button
            value={isLoading?.preview ? <Loader /> : "Save & Complete Preview"}
            primary
            disabled={disableForm || Object.keys(errors).length > 0}
            onClick={(e) => {
              e.preventDefault();

              // SET ACTIVE TAB AND STEP
              const active_tab = "preview_submission";
              const active_step = "preview_submission";

              // CHECK FOR SHAREHOLDERS WITH 0 SHARES
              if (
                capital_details?.filter(
                  (shareholder) => shareholder?.shares?.total_shares === 0
                )?.length > 0
              ) {
                setError("total_shares", {
                  type: "manual",
                  message:
                    "Some shareholders have 0 shares assigned. Update their shares or remove them from the list to continue.",
                });
                return;
              }
              setIsLoading({
                ...isLoading,
                amend: false,
                submit: false,
                preview: true,
              });

              setTimeout(() => {
                setIsLoading({
                  ...isLoading,
                  submit: false,
                  preview: false,
                  amend: false,
                });
                clearErrors("total_shares");
                dispatch(setBusinessCompletedStep("capital_details"));
                dispatch(setBusinessActiveStep(active_step));
                dispatch(setBusinessActiveTab(active_tab));
                dispatch(
                  setUserApplications({
                    entry_id,
                    active_step,
                    active_tab,
                  })
                );
              }, 1000);
            }}
          />
        )}
        <Button
          value={isLoading?.submit ? <Loader /> : "Save & Continue"}
          primary
          disabled={disableForm || Object.keys(errors).length > 0}
          onClick={(e) => {
            e.preventDefault();
            // CHECK FOR SHAREHOLDERS WITH 0 SHARES
            if (
              capital_details?.filter(
                (shareholder) => shareholder?.shares?.total_shares === 0
              )?.length > 0
            ) {
              setError("total_shares", {
                type: "manual",
                message:
                  "Some shareholders have 0 shares assigned. Update their shares or remove them from the list to continue.",
              });
              return;
            }
            setIsLoading({
              ...isLoading,
              amend: false,
              submit: true,
              preview: false,
            });

            setTimeout(() => {
              setIsLoading({
                ...isLoading,
                submit: false,
                preview: false,
              });
              clearErrors("total_shares");
              dispatch(setBusinessCompletedStep("capital_details"));
              dispatch(setBusinessActiveStep("beneficial_owners"));
              dispatch(setBusinessActiveTab("beneficial_owners"));
              dispatch(
                setUserApplications({
                  entry_id,
                  active_step: "beneficial_owners",
                  active_tab: "beneficial_owners",
                })
              );
            }, 1000);
          }}
        />
      </menu>
    </section>
  );
};

export default CapitalDetails;
