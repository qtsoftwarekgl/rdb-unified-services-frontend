import Modal from '@/components/Modal';
import { countriesList } from '@/constants/countries';
import { capitalizeString, formatDate } from '@/helpers/strings';
import { setBusinessPersonDetailsModal } from '@/states/features/businessRegistrationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface BusinessPersonDetailsProps {
  personDetails: {
    type: string;
    first_name: string;
    last_name: string;
    company_name: string;
    document_no: string;
    passport_no: string;
    email: string;
    phone: string;
    company_phone: string;
    incorporation_country: string;
    country: string;
    registration_date: string | Date;
  } | null;
}

const BusinessPersonDetails: FC<BusinessPersonDetailsProps> = ({
  personDetails,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessPersonDetailsModal } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  return (
    <Modal
      isOpen={businessPersonDetailsModal}
      onClose={() => {
        dispatch(setBusinessPersonDetailsModal(false));
      }}
    >
      <h1 className="flex font-semibold text-[18px]">
        {String(personDetails?.first_name || '') ||
          String(personDetails?.company_name || '')}{' '}
        {personDetails?.last_name || ''}
      </h1>

      <menu className="flex gap-3 flex-wrap">
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Type:</span>
          <span>
            {capitalizeString(String(personDetails?.type || ''))}
          </span>
        </p>
        {personDetails?.type === 'person' && (
          <p className="flex gap-2 w-[49%]">
            <span className="font-semibold">Document No:</span>
            <span>
              {capitalizeString(
                personDetails?.document_no || personDetails?.passport_no
              )}
            </span>
          </p>
        )}
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Email:</span>
          <span>{personDetails?.email}</span>
        </p>
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Phone:</span>
          <span>{personDetails?.phone || personDetails?.company_phone}</span>
        </p>
        <p className="flex gap-2 w-[49%]">
          <span className="font-semibold">Country:</span>
          <span>
            {
              countriesList?.find(
                (country) =>
                  country.code ===
                  (personDetails?.incorporation_country ||
                    personDetails?.country)
              )?.name
            }
          </span>
        </p>
        {personDetails?.type !== 'person' && (
          <p className="flex gap-2 w-[49%]">
            <span className="font-semibold">Registration date:</span>
            <span>
              {capitalizeString(
                formatDate(personDetails?.registration_date as string | Date)
              )}
            </span>
          </p>
        )}
      </menu>
    </Modal>
  );
};

export default BusinessPersonDetails;
