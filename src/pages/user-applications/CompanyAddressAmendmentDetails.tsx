import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { capitalizeString } from '@/helpers/strings';
import { countriesList } from '@/constants/countries';

const CompanyAddressAmendmentDetails = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4 p-5">
      <section className="w-full flex flex-col gap-4">
        <h2 className="uppercase text-primary text-lg font-semibold">
          Current details
        </h2>
        <menu className="grid grid-cols-2 gap-5 w-full">
          {Object.entries(selectedBusinessAmendment?.oldValue ?? {})?.map(
            ([key, value], index) => {
              if (key === 'id' || value === null) return null;
              if (key === 'location') {
                return (
                  <ul key={index} className="grid grid-cols-2 items-center gap-4">
                    {Object.entries(value)?.map(([locationKey, locationValue], index) => {
                      if (locationKey === 'id' || locationValue === null) return null;
                      return (
                        <ul key={index} className="flex items-center gap-5">
                          <p>{capitalizeString(locationKey)}:</p>
                          <p className="font-medium">{String(locationValue)}</p>
                        </ul>
                      );
                    })}
                  </ul>
                )
              }
              if (key === 'countryOfIncorporation') {
                return (
                  <ul key={index} className="flex items-center gap-5">
                    <p>Country of incorporation:</p>
                    <p className="font-medium">
                      {
                        countriesList?.find(
                          (country) => country?.code === String(value)
                        )?.name
                      }
                    </p>
                  </ul>
                );
              }
              return (
                <ul key={index} className="flex items-center gap-5">
                  <p>{capitalizeString(key)}:</p>
                  <p className="font-medium">{String(value)}</p>
                </ul>
              );
            }
          )}
        </menu>
      </section>
      <section className="w-full flex flex-col gap-4">
        <h2 className="uppercase text-primary text-lg font-semibold">
          Submitted changes
        </h2>
        <menu className="grid grid-cols-2 gap-5 w-full">
          {Object.entries(selectedBusinessAmendment?.newValue ?? {})?.map(
            ([key, value], index) => {
              if (key === 'id' || value === null) return null;
              if (key === 'location') {
                return (
                  <ul key={index} className="grid grid-cols-2 items-center gap-4">
                    {Object.entries(value)?.map(([locationKey, locationValue], index) => {
                      if (locationKey === 'id' || locationValue === null) return null;
                      return (
                        <ul key={index} className="flex items-center gap-5">
                          <p>{capitalizeString(locationKey)}:</p>
                          <p className="font-medium">{String(locationValue)}</p>
                        </ul>
                      );
                    })}
                  </ul>
                )
              }
              if (key === 'countryOfIncorporation') {
                return (
                  <ul key={index} className="flex items-center gap-5">
                    <p>Country of incorporation:</p>
                    <p className="font-medium">
                      {
                        countriesList?.find(
                          (country) => country?.code === String(value)
                        )?.name
                      }
                    </p>
                  </ul>
                );
              }
              return (
                <ul key={index} className="flex items-center gap-5">
                  <p>{capitalizeString(key)}:</p>
                  <p className="font-medium">{String(value)}</p>
                </ul>
              );
            }
          )}
        </menu>
      </section>
    </main>
  );
};

export default CompanyAddressAmendmentDetails;
