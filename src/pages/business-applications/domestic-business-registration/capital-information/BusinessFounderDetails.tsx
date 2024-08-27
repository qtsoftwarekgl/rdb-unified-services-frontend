import Modal from '@/components/Modal';
import { getCountryName } from '@/constants/countries';
import { formatCurrency, formatNumbers } from '@/helpers/strings';
import { setFounderDetailsModal } from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';

const FounderDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { founderDetailsModal, selectedFounderDetail } = useSelector(
    (state: RootState) => state.founderDetail
  );

  return (
    <Modal
      isOpen={founderDetailsModal}
      onClose={() => {
        dispatch(setFounderDetailsModal(false));
      }}
      heading={`Founder Details With Shares for ${
        selectedFounderDetail?.personDetail?.firstName ||
        selectedFounderDetail?.personDetail?.organization?.organizationName ||
        ''
      }`}
      className="min-w-[55vw]"
    >
      <section className="w-full flex flex-col gap-4">
        <menu className="grid grid-cols-2 w-full gap-5">
          <p>
            Name:{' '}
            {`${selectedFounderDetail?.personDetail?.firstName} ${
              selectedFounderDetail?.personDetail?.lastName || ''
            }`}
          </p>
          <p>
            Document Number:{' '}
            {selectedFounderDetail?.personDetail?.personDocNo || ''}
          </p>
          <p>
            Phone number:{' '}
            {selectedFounderDetail?.personDetail?.phoneNumber || ''}
          </p>
          <p>
            Nationality:{' '}
            {selectedFounderDetail?.personDetail?.nationality &&
              getCountryName(selectedFounderDetail?.personDetail?.nationality)}
          </p>
          <p>Sex: {selectedFounderDetail?.personDetail?.gender}</p>
          <p>Email: {selectedFounderDetail?.personDetail?.email}</p>
        </menu>
      </section>
      <section className="w-full flex flex-col gap-4 my-4">
        <h3 className="font-medium uppercase text-lg underline">
          Share details
        </h3>
        <menu className="grid grid-cols-2 w-full gap-5">
          <p>
            Share Quantity:{' '}
            {formatNumbers(selectedFounderDetail?.shareQuantity)}
          </p>
          <p>
            Share Amount:{' '}
            {formatCurrency(selectedFounderDetail?.totalQuantity, 'RWF')}
          </p>
        </menu>
      </section>
    </Modal>
  );
};

export default FounderDetails;
