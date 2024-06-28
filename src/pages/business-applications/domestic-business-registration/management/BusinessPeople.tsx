import Table from '@/components/table/Table';
import { countriesList } from '@/constants/countries';
import { genderOptions } from '@/constants/inputs.constants';
import { capitalizeString } from '@/helpers/strings';
import { businessId } from '@/types/models/business';
import { PersonDetail } from '@/types/models/personDetail';

type BusinessPeopleProps = {
  businessId?: businessId;
  businessPeopleList: PersonDetail[];
};

const BusinessPeople = ({ businessPeopleList }: BusinessPeopleProps) => {
  // MANAGEMENT PEOPLE COLUMNS
  const businessPeopleColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Document No',
      accessorKey: 'personDocNo',
    },
    {
      header: 'Sex',
      accessorKey: 'gender',
    },
    {
      header: 'Nationality',
      accessorKey: 'nationality',
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
  ];

  if (businessPeopleList?.length <= 0) return null;

  return (
    <section className="flex flex-col items-center w-full gap-2">
      {businessPeopleList?.length <= 0 && (
        <p className="text-sm text-center text-gray-500">No people found</p>
      )}
      {businessPeopleList?.length > 0 && (
        <Table
          data={businessPeopleList?.map((person: PersonDetail) => {
            return {
              ...person,
              position: capitalizeString(person?.roleDescription),
              name: `${person.firstName} ${person.middleName || ''} ${
                person.lastName || ''
              }`,
              nationality: countriesList?.find(
                (country) => country?.code === person?.nationality
              )?.name,
              gender: genderOptions?.find(
                (gender) => gender?.value === person?.gender
              )?.label,
            };
          })}
          columns={businessPeopleColumns}
          showFilter={false}
        />
      )}
    </section>
  );
};

export default BusinessPeople;
