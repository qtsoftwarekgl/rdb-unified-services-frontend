import Modal from '@/components/Modal';
import { setShareholderDetailsModal } from '@/states/features/businessRegistrationSlice';
import { RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { business_shareholders } from './ShareHolders';
import { FC } from 'react';
import { capitalizeString } from '@/helpers/strings';
import { countriesList } from '@/constants/countries';

interface ShareholderDetailsProps {
  shareholder: business_shareholders | null;
}

const ShareholderDetails: FC<ShareholderDetailsProps> = ({ shareholder }) => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { shareholderDetailsModal } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  return (
    <Modal
      isOpen={shareholderDetailsModal}
      onClose={() => dispatch(setShareholderDetailsModal(false))}
    >
      <h1 className="flex font-semibold text-[18px]">
        {shareholder?.first_name || shareholder?.company_name}{' '}
        {shareholder?.last_name || ''}
      </h1>

      <menu className="flex gap-3 flex-wrap">
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Type:</span>
          <span>{capitalizeString(String(shareholder?.shareholder_type))}</span>
        </p>
        {shareholder?.shareholder_type === 'person' && <p className="flex gap-2 w-[49%]">
            <span className="font-semibold">Document No:</span>
            <span>{capitalizeString(shareholder?.document_no || shareholder?.passport_no)}</span>
            </p>}
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Email:</span>
          <span>{shareholder?.email}</span>
        </p>
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Phone:</span>
          <span>{shareholder?.phone || shareholder?.company_phone}</span>
        </p>
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Country:</span>
          <span>
            {
              countriesList?.find(
                (country) =>
                  country.code ===
                  (shareholder?.incorporation_country || shareholder?.country)
              )?.name
            }
          </span>
        </p>
        {shareholder?.shareholder_type !== 'person' && <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Registration date:</span>
          <span>{capitalizeString(shareholder?.registration_date)}</span>
        </p>}
      </menu>
    </Modal>
  );
};

export default ShareholderDetails;
