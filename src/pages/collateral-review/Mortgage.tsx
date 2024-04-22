import { FC } from "react";
import ReviewCard from "./ReviewCard";
import Table from "@/components/table/Table";
import Input from "@/components/inputs/Input";
import { integerToWords } from "@/constants/integerToWords";

type Props = {
  property: any;
};

const Mortgage: FC<Props> = ({ property }) => {
  const loanData = {
    "Loan Amount": property?.loan_amount,
    "Loan Amount in words": property?.loan_amount_in_words || "N/A",
  };

  const securedAmountData = {
    "Secured Amount": property?.secured_amount,
    "Secured Amount in words": property?.secured_amount_in_words || "N/A",
  };

  const creditorColumns = [
    {
      header: "Creditor Name",
      accessorKey: "name",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
  ];

  const debtorColumns = [
    {
      header: "Debtor Name",
      accessorKey: "debtor_names",
    },
    {
      header: "ID Number",
      accessorKey: "debtor_id",
    },
    {
      header: "Address",
      accessorKey: "debtor_address",
    },
  ];

  return (
    <section className="flex flex-col gap-8">
      <ReviewCard header="Amount of the Loan" data={loanData} />
      <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            Amount of the loan
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <p className="flex items-center w-full gap-24">
            <h1 className="font-bold">Laon Amount:</h1>
            <menu className="flex flex-1 gap-6">
              <Input value={property?.loan_amount} readOnly />
              <Input className="!w-20" readOnly value={"RWF"} />
            </menu>
          </p>
          <p className="flex items-center w-full gap-6">
            <h1 className="font-bold">Loan Amount in words:</h1>
            <menu className="flex flex-1 gap-6">
              <textarea
                readOnly
                className="w-full p-2 border capitalize rounded-md resize-none placeholder:!font-light  placeholder:text-[13px]"
                value={property?.loan_amount_in_words}
              />
            </menu>
          </p>
        </section>
      </section>
      <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            secured amount
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <p className="flex items-center w-full gap-24">
            <h1 className="font-bold">Secured Amount:</h1>
            <menu className="flex flex-1 gap-6">
              <Input value={property?.secured_amount} readOnly />
              <Input className="!w-20" readOnly value={"RWF"} />
            </menu>
          </p>
          <p className="flex items-center w-full gap-6">
            <h1 className="font-bold">Secured Amount in words:</h1>
            <menu className="flex flex-1 gap-6">
              <textarea
                readOnly
                className="w-full p-2 border capitalize rounded-md resize-none placeholder:!font-light  placeholder:text-[13px]"
                value={property?.secured_amount_in_words}
              />
            </menu>
          </p>
        </section>
      </section>

      <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            Creditors
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <Table
            showFilter={false}
            rowClickHandler={undefined}
            showPagination={false}
            data={property.creditors || []}
            columns={creditorColumns}
          />
        </section>
      </section>
      <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            Debtors
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <Table
            showFilter={false}
            rowClickHandler={undefined}
            showPagination={false}
            data={property.debtors || []}
            columns={debtorColumns}
          />
        </section>
      </section>
    </section>
  );
};

export default Mortgage;
