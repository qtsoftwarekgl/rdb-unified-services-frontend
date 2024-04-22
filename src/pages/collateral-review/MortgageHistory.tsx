import Table from "@/components/table/Table";
import { FC } from "react";

type Props = {
  mortgage_history: [];
};

const MortgageHistory: FC<Props> = ({ mortgage_history }) => {
  const columns = [
    {
      header: "Last change date",
      accessorKey: "last_change_date",
      id: "last_change_date",
    },
    {
      header: "Notice ID",
      accessorKey: "notice_id",
      id: "notice_id",
    },
    {
      header: "Status",
      accessorKey: "status",
      id: "status",
    },
    {
      header: "Registration Type",
      accessorKey: "registration_type",
      id: "registration_type",
    },
    {
      header: "Journal Num",
      accessorKey: "journal_num",
      id: "journal_num",
    },
  ];

  return (
    <section className="flex flex-col gap-8">
      <menu className="flex flex-col gap-2">
        <Table
          data={[]}
          columns={columns}
          showFilter={false}
          showPagination={false}
          rowClickHandler={undefined}
        />
      </menu>
    </section>
  );
};

export default MortgageHistory;
