import { useTranslation } from "react-i18next";
import UserLayout from "../../containers/UserLayout";
import { companyHistories } from "../../constants/Users";
import Table from "../../components/table/Table";
import CreateAmendment from "./CreateAmendment";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setViewedCompany } from "../../states/features/userCompaniesSlice";
import { RootState } from "../../states/store";

const CompanyHistory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  useEffect(() => {
    if (id) {
      dispatch(
        setViewedCompany(
          user_applications?.find((business) => business.entry_id === id)
        )
      );
    }

    return () => {
      dispatch(setViewedCompany(null));
    };
  }, [id, dispatch, user_applications, location]);

  const columns = [
    {
      header: "Transaction Type",
      accessorKey: "transactionType",
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
