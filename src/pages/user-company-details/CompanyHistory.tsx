import { useTranslation } from "react-i18next";
import UserLayout from "../../containers/UserLayout";
import { companyHistories } from "../../constants/Users";
import Table from "../../components/table/Table";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/inputs/Button";

const CompanyHistory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      console.log(id);
    }
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
            {t("company documents")}
          </h1>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              navigate("/user-applications");
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBackward} />
                Back
              </menu>
            }
          />
        </menu>
        <section className="p-2">
          <Table data={companyHistories} columns={columns} />
        </section>
      </main>
    </UserLayout>
  );
};

export default CompanyHistory;
