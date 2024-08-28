import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { capitalizeString } from '@/helpers/strings';
import { Business } from '@/types/models/business';

const CompanyDetailsAmendmentReview = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
        <section className="w-full flex flex-col gap-4">
          <menu className="grid grid-cols-2 gap-5 w-full p-2">
            <article className="flex flex-col gap-4">
              <h3 className="uppercase text-primary text-lg font-medium">
                Current details
              </h3>
              {renderCompanyDetails(
                selectedBusinessAmendment?.oldValue as Business
              )}
            </article>
            <article className="flex flex-col gap-4">
              <h3 className="uppercase text-primary text-lg font-medium">
                Submitted changes
              </h3>
              {renderCompanyDetails(
                selectedBusinessAmendment?.newValue as Business,
                selectedBusinessAmendment?.oldValue as Business
              )}
            </article>
          </menu>
        </section>
    </main>
  );
};

function renderCompanyDetails(
  displayValue: Business,
  comparisonValue?: Business
) {
  return (
    <menu>
      <ul className="flex flex-col gap-3">
        {Object.entries(displayValue)?.map(([key, value]) => {
          const comparisonValueForKey = comparisonValue?.[key];
          if (
            [
              'assignedVerifier',
              'assignedApprover',
              'serviceId',
              'state',
              'version',
              'createdAt',
              'lastModifiedDate',
              'entityId',
              'id',
              'applicationReferenceId',
              'updatedAt',
              'createdDate',
              'isForeign',
              'applicationStatus',
            ].includes(key) ||
            value === null
          )
            return null;
          if (typeof value === 'boolean') {
            return (
              <li key={key} className="flex items-center gap-2">
                <p>{capitalizeString(key)}:</p>
                <p
                  className={`font-medium ${
                    comparisonValue &&
                    comparisonValueForKey !== value &&
                    'bg-green-700 text-white p-1 px-2 rounded-md'
                  }`}
                >
                  {value ? 'Yes' : 'No'}
                </p>
              </li>
            );
          }
          return (
            <li key={key} className="flex items-center gap-2">
              <p>{capitalizeString(key)}:</p>
              <p
                className={`font-medium ${
                  comparisonValue &&
                  comparisonValueForKey !== value &&
                  'bg-green-700 text-white p-1 px-2 rounded-md'
                }`}
              >
                {capitalizeString(String(value))}
              </p>
            </li>
          );
        })}
      </ul>
    </menu>
  );
}

export default CompanyDetailsAmendmentReview;
