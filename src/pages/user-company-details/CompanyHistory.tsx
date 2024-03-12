import { useTranslation } from "react-i18next";
import UserLayout from "../../containers/UserLayout";
import { companyHistories } from "../../constants/Users";
import Table from "../../components/table/Table";
import CreateAmendment from "./CreateAmendment";

const CompanyHistory = () => {
  const { t } = useTranslation();

  const columns = [
    {
      header: "Transaction Type",
      accessorKey: "transactionType",
      filter: true,
    },
    {
      header: "Transaction Number",
      accessorKey: "TransactionNumber",
    },
    {
      header: "Transaction Date",
      accessorKey: "transactionDate",
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-center text-black ">
            {t("company history")}
          </h1>
          <CreateAmendment />
        </menu>
        <section className="p-2">
          <Table
            data={companyHistories}
            columns={columns}
            className="bg-white rounded-t-2xl"
          />
        </section>
      </main>
    </UserLayout>
  );
};

export default CompanyHistory;
