import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { capitalizeString, formatDate } from '@/helpers/strings';

const CloseBusinessAmendmentReview = () => {
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
        <menu className="w-full grid grid-cols-2 gap-5">
          <ul className="w-full flex items-center gap-1">
            <p>Dissolution date:</p>
            <p>
              {formatDate(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      dissolutionDate: string;
                    };
                  }
                )?.newValue?.dissolutionDate
              )}
            </p>
          </ul>
          <ul className="w-full flex items-center gap-1">
            <p>Dissolution reason:</p>
            <p>
              {capitalizeString(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      dissolutionReason: string;
                    };
                  }
                )?.newValue?.dissolutionReason
              )}
            </p>
          </ul>
          <ul className="w-full flex items-center gap-1">
            <p>Resolution date:</p>
            <p>
              {formatDate(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      resolutionDate: string;
                    };
                  }
                )?.newValue?.resolutionDate
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

export default CloseBusinessAmendmentReview;
