import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import moment, { MomentInput } from 'moment';
import { capitalizeString } from '@/helpers/strings';

const EmploymentInfoAmendmentReview = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
      <menu className="grid grid-cols-2 gap-5 w-full">
        <menu className="w-full flex flex-col gap-4">
          <h3 className="text-primary uppercase text-lg font-medium">
            Existing details
          </h3>
          <ul className="w-full flex-col gap-4 flex">
            {Object.entries(selectedBusinessAmendment?.oldValue ?? {})?.map(
              ([key, value], index) => {
                if (
                  [
                    'createdAt',
                    'id',
                    'lastModifiedDate',
                    'version',
                    'state',
                    'entityId',
                    'updatedAt',
                    'createdDate',
                  ].includes(key) ||
                  value === null
                )
                  return null;
                if (
                  ['financialYearEndDate', 'financialYearStartDate'].includes(
                    key
                  )
                ) {
                  return (
                    <li key={index} className="flex items-center gap-2">
                      <p>{capitalizeString(key)}:</p>
                      <p>{moment(value as MomentInput).format('MMMM DD')}</p>
                    </li>
                  );
                }
                if (
                  [
                    'financialYearEndDate',
                    'employmentDeclarationDate',
                    'financialYearStartDate',
                    'employmentDeclarationDate',
                    'hiringDate',
                  ].includes(key)
                ) {
                  return (
                    <li key={index} className="flex items-center gap-2">
                      <p>{capitalizeString(key)}:</p>
                      <p>{moment(value as MomentInput).format('YYYY-MM-DD')}</p>
                    </li>
                  );
                }
                return (
                  <li key={index} className="flex items-center gap-2">
                    <p>{capitalizeString(key)}:</p>
                    <p>{String(value)}</p>
                  </li>
                );
              }
            )}
          </ul>
        </menu>
        <menu className="w-full flex flex-col gap-4">
          <h3 className="text-primary uppercase text-lg font-medium">
            Submitted changes
          </h3>
          <ul className="w-full flex-col gap-4 flex">
            {Object.entries(selectedBusinessAmendment?.newValue ?? {})?.map(
              ([key, value], index) => {
                const comparisonValue =
                  selectedBusinessAmendment?.oldValue?.[key];
                if (
                  [
                    'createdAt',
                    'id',
                    'lastModifiedDate',
                    'version',
                    'state',
                    'entityId',
                    'updatedAt',
                    'createdDate',
                  ].includes(key) ||
                  value === null
                )
                  return null;
                if (
                  ['financialYearEndDate', 'financialYearStartDate'].includes(
                    key
                  )
                ) {
                  return (
                    <li key={index} className="flex items-center gap-2">
                      <p>{capitalizeString(key)}:</p>
                      <p
                        className={`${
                          comparisonValue !== value &&
                          'bg-green-700 text-white p-1 rounded-md px-1 text-[13px]'
                        }`}
                      >
                        {moment(value as MomentInput).format('MMMM DD')}
                      </p>
                    </li>
                  );
                }
                if (
                  [
                    'financialYearEndDate',
                    'employmentDeclarationDate',
                    'financialYearStartDate',
                    'employmentDeclarationDate',
                    'hiringDate',
                  ].includes(key)
                ) {
                  return (
                    <li key={index} className="flex items-center gap-2">
                      <p>{capitalizeString(key)}:</p>
                      <p
                        className={`${
                          comparisonValue !== value &&
                          'bg-green-700 text-white p-1 rounded-md px-1 text-[13px]'
                        }`}
                      >
                        {moment(value as MomentInput).format('YYYY-MM-DD')}
                      </p>
                    </li>
                  );
                }
                return (
                  <li key={index} className="flex items-center gap-2">
                    <p>{capitalizeString(key)}:</p>
                    <p
                      className={`${
                        comparisonValue !== value &&
                        'bg-green-700 text-white p-1 rounded-md px-1 text-[13px]'
                      }`}
                    >
                      {String(value)}
                    </p>
                  </li>
                );
              }
            )}
          </ul>
        </menu>
      </menu>
    </main>
  );
};

export default EmploymentInfoAmendmentReview;
