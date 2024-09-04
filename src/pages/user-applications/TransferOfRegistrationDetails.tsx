import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { formatDate } from '@/helpers/strings';

const TransferOfRegistrationDetails = () => {
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
          <ul className="w-full flex flex-col gap-2">
            <p className="uppercase text-primary font-medium underline">
              Transfer reason:
            </p>
            <p>
              {
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      transferReason: string;
                    };
                  }
                )?.newValue?.transferReason
              }
            </p>
          </ul>
          <ul className="w-full flex items-center gap-1">
            <p className="text-black font-normal">Transfer date:</p>
            <p>
              {formatDate(
                (
                  selectedBusinessAmendment as unknown as {
                    newValue: {
                      transferDate: string;
                    };
                  }
                ).newValue.transferDate
              )}
            </p>
          </ul>
        </menu>
      </section>
    </main>
  );
};

export default TransferOfRegistrationDetails;
