import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { capitalizeString, formatDate } from '@/helpers/strings';

const BusinessCessationToDormancyDetails = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
      <section className="w-full flex flex-col gap-3">
        <h1 className="uppercase text-primary font-semibold text-lg">
          Provided information
        </h1>
        <menu className="grid grid-cols-2 gap-5 w-full">
          <ul className="w-full flex items-center gap-1">
            <p>Resolution start date:</p>
            <p>
              {formatDate(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      resolutionStartDate: Date;
                    };
                  }
                )?.newValue?.resolutionStartDate
              )}
            </p>
          </ul>
          <ul className="w-full flex items-center gap-1">
            <p>Resolution end date:</p>
            <p>
              {formatDate(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      resolutionEndDate: Date;
                    };
                  }
                )?.newValue?.resolutionEndDate
              )}
            </p>
          </ul>
          <ul className="w-full flex items-center gap-1">
            <p>Resolution reason:</p>
            <p>
              {capitalizeString(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      resolutionReason: string;
                    };
                  }
                )?.newValue?.resolutionReason
              )}
            </p>
          </ul>
        </menu>
      </section>
    </main>
  );
};

export default BusinessCessationToDormancyDetails;
