import { FC } from "react";
import ReviewCard from "./ReviewCard";
import Table from "@/components/table/Table";
import Input from "@/components/inputs/Input";
import { integerToWords } from "@/constants/integerToWords";

type Props = {
  property: any;
};

const Property: FC<Props> = ({ property }) => {
  const propertData = {
    "Unique parcel Identification (UPI)/Plate Number":
      property?.upi_number || property?.vehicle_plate_number || "N/A",
    "Nature of Property": property?.property_nature,
    Address: property?.property_location,
    Description: property?.property_description,
  };

  const propertyEvaluation = {
    Valuer: property.valuer_name,
    "Evaluator's Certificate No.": property.evaluator_certificate_number,
    "Date of the evaluation of the property": property.evaluation_date,
  };

  const ownerColumns = [
    {
      header: "Names",
      accessorKey: "name",
    },
    {
      header: "Address",
      accessorKey: "owner_address",
    },
    {
      header: "ID number",
      accessorKey: "id_number",
    },
  ];

  //   const spouseColumns = [
  //     {
  //       header: "Names",
  //       accessorKey: "spouse_name",
  //     },
  //     {
  //       header: "Address",
  //       accessorKey: "spouse_address",
  //     },
  //     {
  //       header: "ID number",
  //       accessorKey: "spouse_id",
  //     },
  //   ];

  return (
    <section className="flex flex-col gap-8">
      <ReviewCard header="Property Information" data={propertData} />
      <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            Property Value
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <p className="flex items-center w-full gap-24">
            <h1 className="font-bold">Value of the property:</h1>
            <menu className="flex flex-1 gap-6">
              <Input value={property?.property_value} readOnly />
              <Input className="!w-20" readOnly value={"RWF"} />
            </menu>
          </p>
          <p className="flex items-center w-full gap-6">
            <h1 className="font-bold">Value of the property in words:</h1>
            <menu className="flex flex-1 gap-6">
              <textarea
                readOnly
                className="w-full p-2 border capitalize rounded-md resize-none placeholder:!font-light  placeholder:text-[13px]"
                value={integerToWords(+property?.property_value)}
              />
            </menu>
          </p>
        </section>
      </section>
      <ReviewCard header="Property Evaluation" data={propertyEvaluation} />
      <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            Owners
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <Table
            showFilter={false}
            rowClickHandler={undefined}
            showPagination={false}
            data={property.owners || []}
            columns={ownerColumns}
          />
        </section>
      </section>
      {/* <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full gap-3">
          <h2 className="text-lg font-semibold uppercase text-primary">
            Spouses/Other Family Members
          </h2>
        </menu>
        <section className="flex flex-col w-full gap-3 my-2">
          <Table
            showFilter={false}
            rowClickHandler={undefined}
            showPagination={false}
            data={property.owners || []}
            columns={spouseColumns}
          />
        </section>
      </section> */}
    </section>
  );
};

export default Property;
