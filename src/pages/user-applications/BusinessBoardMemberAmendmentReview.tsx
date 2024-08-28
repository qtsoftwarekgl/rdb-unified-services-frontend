import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { PersonDetail } from '@/types/models/personDetail';
import BusinessPeopleTable from '../business-applications/domestic-business-registration/management/BusinessPeopleTable';

const BusinessBoardMemberAmendmentReview = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
        <menu className="w-full flex flex-col gap-4">
          <ul className="w-full flex flex-col gap-4">
            <h3 className="uppercase text-lg text-primary">
              Existing Board Members
            </h3>
            <BusinessPeopleTable
              businessPeopleList={
                selectedBusinessAmendment?.oldValue as unknown as PersonDetail[]
              }
            />
          </ul>
          <ul className="w-full flex flex-col gap-4">
            <h3 className="uppercase text-lg text-primary">
              New board members
            </h3>
            <BusinessPeopleTable
              businessPeopleList={
                [
                  selectedBusinessAmendment?.newValue,
                ] as unknown as PersonDetail[]
              }
            />
          </ul>
        </menu>
    </main>
  );
};

export default BusinessBoardMemberAmendmentReview;
