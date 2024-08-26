import Modal from '@/components/Modal';
import { getCountryName } from '@/constants/countries';
import { getGenderLabel } from '@/constants/inputs.constants';
import { capitalizeString, formatDate } from '@/helpers/strings';
import { setBeneficialOwnerDetailsModal } from '@/states/features/beneficialOwnerSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const BeneficialOwnerDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { beneficialOwnerDetailsModal, selectedBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );

  return (
    <Modal
      isOpen={beneficialOwnerDetailsModal}
      onClose={() => {
        dispatch(setBeneficialOwnerDetailsModal(false));
      }}
      heading={`${selectedBeneficialOwner?.personDetail?.firstName || ''} ${
        selectedBeneficialOwner?.personDetail?.lastName || ''
      }`}
      className="min-w-[50%]"
    >
      <article className="grid grid-cols-2 gap-5 w-full">
        <p>
          Full Name: {selectedBeneficialOwner?.personDetail?.firstName || ''}{' '}
          {selectedBeneficialOwner?.personDetail?.lastName || ''}
        </p>
        <p>Document number: {selectedBeneficialOwner?.personDetail?.personDocNo}</p>
        <p>
          Ownership Type:{' '}
          {capitalizeString(selectedBeneficialOwner?.beneficialOwnerType)}
        </p>
        <p>Sex: {getGenderLabel(selectedBeneficialOwner?.personDetail?.gender)}</p>
        <p>Nationality: {getCountryName(selectedBeneficialOwner?.personDetail?.nationality)}</p>
        <p>Phone number: {selectedBeneficialOwner?.personDetail?.phoneNumber}</p>
        <p>TIN: {selectedBeneficialOwner?.tinNumber}</p>
        <p>
          Date of registration:{' '}
          {formatDate(selectedBeneficialOwner?.registeredDate)}
        </p>
        <p>
          Control type: {capitalizeString(selectedBeneficialOwner?.controlType)}
        </p>
        <p>
          Extent of shares: {selectedBeneficialOwner?.extentOfShare || 'N/A'}
        </p>
        <p>
          Significant influence:{' '}
          {capitalizeString(selectedBeneficialOwner?.significantInfluence)}
        </p>
        <p>
          Occupation:{' '}
          {capitalizeString(selectedBeneficialOwner?.occupation) || 'N/A'}
        </p>
        {selectedBeneficialOwner?.otherControlMeansDesc && (
          <p>
            Other control means:{' '}
            {selectedBeneficialOwner?.otherControlMeansDesc}
          </p>
        )}
        {selectedBeneficialOwner?.seniorManagementPosition && (
          <p>
            Senior management position:{' '}
            {selectedBeneficialOwner?.seniorManagementPosition}
          </p>
        )}
      </article>
    </Modal>
  );
};

export default BeneficialOwnerDetails;
