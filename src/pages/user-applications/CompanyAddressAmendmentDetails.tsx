import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { capitalizeString } from '@/helpers/strings';
import { countriesList } from '@/constants/countries';

const CompanyAddressAmendmentDetails = () => {
  // STATE VARIABLES
  const [selectedTab, setSelectedTab] = useState('request-summary');
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
      <BusinessAmendmentNavigation
        onSelectTab={(slug) => {
          setSelectedTab(slug);
        }}
      />
      {selectedTab === 'current-details' && (
        <section className="w-full flex flex-col gap-4">
          <menu className="grid grid-cols-2 gap-5 w-full">
            {Object.entries(selectedBusinessAmendment?.oldValue ?? {})?.map(
              ([key, value], index) => {
                if (key === 'id' || value === null) return null;
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
      )}
      {selectedTab === 'proposed-changes' && (
        <section className="w-full flex flex-col gap-4">
          <menu className="grid grid-cols-2 gap-5 w-full">
            {Object.entries(selectedBusinessAmendment?.newValue ?? {})?.map(
              ([key, value], index) => {
                if (key === 'id' || value === null) return null;
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
      )}
    </main>
  );
};

export default CompanyAddressAmendmentDetails;
