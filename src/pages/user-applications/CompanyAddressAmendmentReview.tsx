import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { capitalizeString } from '@/helpers/strings';
import { getCountryName } from '@/constants/countries';

const CompanyAddressAmendmentReview = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
      <section className="w-full flex flex-col gap-4">
        <ul className="grid grid-cols-2 w-full gap-5">
          <h3 className="uppercase text-primary text-lg font-medium">
            Current details
          </h3>
          <h3 className="uppercase text-primary text-lg font-medium">
            Submitted changes
          </h3>
        </ul>
        <menu className="flex flex-col items-start gap-3 w-full">
          {Object.entries(selectedBusinessAmendment?.oldValue ?? {}).map(
            ([key, oldValue], index) => {
              if (
                [
                  'id',
                  'state',
                  'version',
                  'createdAt',
                  'updatedAt',
                  'createdDate',
                  'lastModifiedDate',
                  'applicationReferenceId',
                  'serviceId',
                  'assignedVerifier',
                  'assignedApprover',
                  'applicationStatus',
                  'isForeign',
                ].includes(key) ||
                oldValue === null
              )
                return null;
              const newValue = selectedBusinessAmendment?.newValue?.[key];

              const valuesChanged = oldValue !== newValue;

              if (key === 'location') {
                return (
                  <ul className="w-full flex flex-col gap-3" key={index}>
                    {Object.entries(oldValue).map(
                      ([locationKey, locationOldValue], locationIndex) => {
                        if (locationKey === 'id' || locationOldValue === null)
                          return null;
                        const locationNewValue = newValue?.[locationKey];
                        const locationValueChanged =
                          locationOldValue !== locationNewValue;
                        return (
                          <menu
                            key={locationIndex}
                            className="grid grid-cols-2 gap-5"
                          >
                            <li className="flex items-center gap-2">
                              <p className={`font-medium`}>
                                {capitalizeString(locationKey)}:
                              </p>
                              <p
                                className={`font-medium ${
                                  locationValueChanged &&
                                  'bg-red-700 text-white'
                                } p-1 rounded-md px-2 text-[15px]`}
                              >
                                {String(locationOldValue)}
                              </p>
                            </li>
                            <li className="flex items-center gap-2">
                              <p>{capitalizeString(locationKey)}:</p>
                              <p
                                className={`font-medium  p-1 px-2 rounded-md text-[15px] ${
                                  locationValueChanged &&
                                  'text-white bg-green-700'
                                }`}
                              >
                                {String(locationNewValue)}
                              </p>
                            </li>
                          </menu>
                        );
                      }
                    )}
                  </ul>
                );
              }

              if (key === 'countryOfIncorporation') {
                return (
                  <ul
                    key={index}
                    className="grid grid-cols-2 items-center gap-5 w-full justify-between"
                  >
                    <li className="flex items-center gap-2">
                      <p>{capitalizeString(key)}:</p>
                      <p
                        className={`font-medium p-1 rounded-md px-2 text-[15px] ${
                          valuesChanged && 'bg-red-700 text-white'
                        }`}
                      >
                        {getCountryName(String(oldValue))}
                      </p>
                    </li>
                    <li className="flex items-center gap-2">
                      <p>{capitalizeString(key)}:</p>
                      <p
                        className={`font-medium  p-1 px-2 rounded-md text-[15px] ${
                          valuesChanged && 'text-white bg-green-700'
                        }`}
                      >
                        {getCountryName(newValue)}
                      </p>
                    </li>
                  </ul>
                );
              }

              return (
                <ul
                  key={index}
                  className="grid grid-cols-2 items-center gap-5 w-full justify-between"
                >
                  <li className="flex items-center gap-2">
                    <p>{capitalizeString(key)}:</p>
                    <p
                      className={`font-medium p-1 rounded-md px-2 text-[15px] ${
                        valuesChanged && 'bg-red-700 text-white'
                      }`}
                    >
                      {capitalizeString(String(oldValue))}
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <p>{capitalizeString(key)}:</p>
                    <p
                      className={`font-medium  p-1 px-2 rounded-md text-[15px] ${
                        valuesChanged && 'text-white bg-green-700'
                      }`}
                    >
                      {capitalizeString(String(newValue))}
                    </p>
                  </li>
                </ul>
              );
            }
          )}
        </menu>
      </section>
    </main>
  );
};

export default CompanyAddressAmendmentReview;
