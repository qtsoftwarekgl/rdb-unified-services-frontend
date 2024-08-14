import { fetchFoundersWithSharePercentagesThunk } from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FounderDetailsWithShares from '../capital-information/FounderDetailsWithSharesTable';

interface BeneficialOwnersProps {
  businessId: businessId;
}

const BeneficialOwners = ({ businessId }: BeneficialOwnersProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { founderDetailsList } = useSelector(
    (state: RootState) => state.founderDetail
  );

  // FETCH FOUNDER DETAILS WITH SHARE PERCENTAGES
  useEffect(() => {
    dispatch(
      fetchFoundersWithSharePercentagesThunk({
        businessId: businessId,
      })
    );
  }, [dispatch, businessId]);

  return (
    <section className="w-full flex flex-col gap-2">
      <FounderDetailsWithShares founderDetailsList={founderDetailsList} />
    </section>
  );
};

export default BeneficialOwners;
