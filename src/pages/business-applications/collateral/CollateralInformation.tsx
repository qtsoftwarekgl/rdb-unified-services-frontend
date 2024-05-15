import Loader from "@/components/Loader";
import ConfirmModal from "@/components/confirm-modal/ConfirmModal";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import Table from "@/components/table/Table";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
  setCollateralApplications,
  setCollateralCompletedStep,
  setCollateralCompletedTab,
} from "@/states/features/collateralRegistrationSlice";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import CollateralForm from "./CollateralForm";
import { integerToWords } from "@/constants/integerToWords";

type Props = {
  entry_id: string | null;
  collateral_infos: any;
  debtor_info: any;
  collateral_type: string;
  loan_amount: number;
  loan_amount_in_words: string;
};

const CollateralInformation = ({
  entry_id,
  collateral_infos,
  debtor_info,
  collateral_type,
  loan_amount,
  loan_amount_in_words,
}: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({});
  const [isSubmitSuccessful, setSubmitSuccessful] = useState(false);

  const columns = [
    {
      header: "Collateral UPI/Plate Number",
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
    {
      header: "Action",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                setConfirmModalData(row?.original);
                setConfirmModal(true);
              }}
            />
          </menu>
        );
      },
    },
  ];

  useEffect(() => {
    setValue("loan_amount", loan_amount);
    setValue("loan_amount_in_words", loan_amount_in_words);
  }, [loan_amount, loan_amount_in_words, setValue]);

  const onSubmitAll = (data: any) => {
    setSubmitSuccessful(true);
    setTimeout(() => {
      setSubmitSuccessful(false);
      dispatch(
        setCollateralApplications({
          entry_id,
          loan_amount: data.loan_amount,
          loan_amount_in_words: data.loan_amount_in_words,
        })
      );
      dispatch(setCollateralActiveStep("attachments"));
      dispatch(setCollateralActiveTab("attachments"));
      dispatch(setCollateralCompletedStep("collateral_information"));
      dispatch(setCollateralCompletedTab("collateral_information"));
    }, 1000);
  };

  return (
    <section className="flex flex-col gap-8 max-md:w-full">
      <CollateralForm
        entry_id={entry_id}
        collateral_infos={collateral_infos}
        debtor_info={debtor_info}
        collateral_type={collateral_type}
      />
      <section className={`flex members-table flex-col w-full`}>
        <h2 className="text-lg font-semibold uppercase text-primary">
          Collaterals
        </h2>
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
      </section>
      <form
        onSubmit={handleSubmit(onSubmitAll)}
        className="flex flex-col gap-6"
      >
        <section className="border border-[#ebebeb] rounded-md p-6 flex flex-col gap-2">
          <menu className="flex items-start w-full gap-3">
            <Controller
              name="loan_amount"
              control={control}
              rules={{
                required: !watch("loan_amount")
                  ? "Laon amount is required"
                  : false,
                validate: (value) => {
                  if (value <= 0) return "Loan amount must be greater than 0";
                  return true;
                },
              }}
              defaultValue={watch("loan_amount") || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      label="Loan amount in Rwf"
                      {...field}
                      placeholder="Loan amount"
                      type="number"
                      onChange={(e) => {
                        field.onChange(e);
                        const words = integerToWords(+e.target.value);
                        setValue("loan_amount_in_words", words);
                        clearErrors("loan_amount_in_words");
                      }}
                    />
                    {errors?.loan_amount && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.loan_amount?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="loan_amount_in_words"
              control={control}
              rules={{
                required: !watch("loan_amount_in_words")
                  ? "Value in words is required"
                  : false,
              }}
              defaultValue={watch("loan_amount_in_words") || ""}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <span className="text-[13px]">Amount in words (Rwf)</span>
                    <textarea
                      className="w-full p-2 border capitalize rounded-md resize-none placeholder:!font-light  placeholder:text-[13px]"
                      placeholder="Amount in words..."
                      readOnly
                      {...field}
                    />
                    {errors?.loan_amount_in_words && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.loan_amount_in_words?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
        </section>
        <menu className="flex justify-between">
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCollateralActiveStep("debtor_information"));
              dispatch(setCollateralActiveTab("debtor_information"));
            }}
          />
          <Button
            value={isSubmitSuccessful ? <Loader /> : "Save & Continue"}
            primary
            submit
          />
        </menu>
      </form>
      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => {
          setConfirmModal(false);
          setConfirmModalData({});
        }}
        onConfirm={(e) => {
          e.preventDefault();
          const updatedData = collateral_infos?.filter(
            (_: unknown, index: number) => {
              return index !== confirmModalData?.no;
            }
          );
          dispatch(
            setCollateralApplications({
              entry_id,
              collateral_infos: updatedData,
            })
          );
        }}
        message="Are you sure you want to delete this collateral?"
        description="This action cannot be undone"
      />
    </section>
  );
};

export default CollateralInformation;
