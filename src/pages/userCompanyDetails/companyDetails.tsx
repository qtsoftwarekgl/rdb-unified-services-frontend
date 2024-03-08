import { useTranslation } from "react-i18next";
import UserLayout from "../../containers/UserLayout";

const CompanyDetails = () => {
  const { t } = useTranslation();
  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f7f7f7] rounded-md">
        <h1 className="w-full text-2xl font-medium text-center text-black ">
          {t("companyDetails")}
        </h1>
      </main>
    </UserLayout>
  );
};

export default CompanyDetails;
