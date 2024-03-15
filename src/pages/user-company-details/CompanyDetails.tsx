import UserLayout from "../../containers/UserLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import { RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import CreateAmendment from "./CreateAmendment";
import { useParams } from "react-router-dom";
import { registeredBusinesses } from "../../constants/dashboard";
import { setViewedCompany } from "../../states/features/userCompaniesSlice";

const CompanyDetails = () => {
  const { id } = useParams();
  const { viewedCompany } = useSelector(
    (state: RootState) => state.userCompanies
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id) {
      dispatch(
        setViewedCompany(
          registeredBusinesses.find((business) => business.id === id)
        )
      );
    }
  }, []);

  const companyManagementMembers = [
    {
      name: "Christelle Kwizera",
      position: "MD",
    },
    {
      name: "Christelle Imena",
      position: "MD",
    },
    {
      name: "Christelle Abera",
      position: "MD",
    },
    {
      name: "Christelle Kirezi",
      position: "MD",
    },
  ];

  const managementMemberColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: ({ row }: { row: unknown }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                return row;
              }}
              icon={faEye}
              className="text-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
            />
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              icon={faTrash}
              className="text-red-500 cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-center text-black ">
            {t("company details")}
          </h1>
          <CreateAmendment />
        </menu>
        <Accordion type="single" collapsible className="p-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              General Information
            </AccordionTrigger>
            <AccordionContent underlineHeader className="relative border-none">
              <div>
                <h1 className="text-base">
                  Company Name:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.companyName || "XYZ"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Registration Category:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.registrationCategory || "Domestic"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Company Category:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.companyCategory || "Domestic"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Company Type:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.companyType || "Domestic"}
                  </span>
                </h1>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              Office Address
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h1 className="text-base">
                    Country:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.country || "Rwanda"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Province:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.province || "North Province"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    District:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.district || "Gakenke"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Sector:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.sector || "Gahinga"}
                    </span>
                  </h1>
                </div>
                <div>
                  <h1 className="text-base">
                    Cell:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.cell || "Biryogo"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Village:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.village || "XYZ"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Street Name:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.streetName || "St 204"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Phone:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.phone || "+250786745562"}
                    </span>
                  </h1>
                </div>
                <div>
                  <h1 className="text-base">
                    Fax:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.fax || "982937"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    P O Box:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.pob || "00821"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Email:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.email || "xyz@gmail.com"}
                    </span>
                  </h1>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              Business Activity & VAT Request
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <div className="flex flex-col gap-4 sm:gap-20 sm:flex-row">
                <div>
                  <h1 className="text-base">
                    Main Business Activity:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.mainBusinessActivity || "Agriculture"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Selected Business Line:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.businessLine || "A11023-Agriculture"}
                    </span>
                  </h1>
                </div>
                <div>
                  <h1 className="text-base">
                    VAT Request:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.vatRequest || "Yes"}
                    </span>
                  </h1>
                  <h1 className="text-base">
                    Total turnover:
                    <span className="ml-2 text-base font-semibold">
                      {viewedCompany?.totalTurnOver || "15000000"}
                    </span>
                  </h1>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              Management
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <Table
                showFilter={false}
                showPagination={false}
                columns={managementMemberColumns}
                data={companyManagementMembers}
                className="bg-white"
                tableTitle="Management Members"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              Employment Information
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <div>
                <h1 className="text-base">
                  Date of hiring:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.hiringDate || "12-03-2020"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Number of employees:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.numberOfEmployees || "120"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Financial Year start date:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.financialYear || "12-03-2020"}
                  </span>
                </h1>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              Capital Details
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <div>
                <h1 className="text-base">
                  Total Number of Share of the company:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.totalNumShare || "100"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Total Share Capital of the company:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.numberOfEmployees || "1215000"}
                  </span>
                </h1>
                <h1 className="text-base ">
                  Remaining shares:
                  <span className="ml-2 text-base font-semibold">
                    {viewedCompany?.remainingShares || "120999"}
                  </span>
                </h1>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              ShareHolders
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <Table
                showFilter={false}
                showPagination={false}
                columns={managementMemberColumns}
                data={companyManagementMembers}
                className="bg-white"
                tableTitle="shareholders"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="px-8 py-8 bg-white">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold ">
              Beneficial owners
            </AccordionTrigger>
            <AccordionContent underlineHeader className="border-none">
              <Table
                showFilter={false}
                showPagination={false}
                columns={managementMemberColumns}
                data={companyManagementMembers}
                className="bg-white"
                tableTitle="Beneficial Owners"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </UserLayout>
  );
};

export default CompanyDetails;
