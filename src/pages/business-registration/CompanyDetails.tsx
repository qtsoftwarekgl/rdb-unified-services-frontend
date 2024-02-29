import { FC } from 'react';

interface CompanyDetailsProps {
  isOpen?: boolean;
}

const CompanyDetails: FC<CompanyDetailsProps> = () => {

  return (
    <section className="flex flex-col gap-6 w-full items-center bg-white rounded-md h-full py-6 px-4">
      <h1 className="text-xl font-semibold">Company Details</h1>
    </section>
  );
};

export default CompanyDetails;
