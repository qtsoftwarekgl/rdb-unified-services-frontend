import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { PersonDetail } from '@/types/models/personDetail';
import BusinessPeopleTable from '../business-applications/domestic-business-registration/management/BusinessPeopleTable';

const ExecutiveMemberAmendmentReview = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
        <menu className="w-full flex flex-col gap-4">
          <ul>
            <h3 className="text-primary uppercase font-medium text-ld">
              Existing executive members
            </h3>
            <BusinessPeopleTable
              businessPeopleList={
                selectedBusinessAmendment?.oldValue as unknown as PersonDetail[]
              }
            />
          </ul>
          <ul>
            <h3 className="text-primary uppercase font-medium text-ld">
              New executive members
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

export default ExecutiveMemberAmendmentReview;
