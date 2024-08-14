import Modal from '@/components/Modal';
import { countriesList } from '@/constants/countries';
import {
  findCountryNameByCode,
  formatCurrency,
  formatNumbers,
} from '@/helpers/strings';
import {
  setFounderWithSharesDetailsModal,
  setSelectedFounderDetailWithShares,
} from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const FounderDetailsWithSharesDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedFounderDetailWithShares, founderWithSharesDetailsModal } =
    useSelector((state: RootState) => state.founderDetail);

  return (
    <Modal
      isOpen={founderWithSharesDetailsModal}
      onClose={() => {
        dispatch(setFounderWithSharesDetailsModal(false));
        dispatch(setSelectedFounderDetailWithShares(undefined));
      }}
      heading={`Founder Details With Shares for ${
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.firstName ||
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.organization?.organizationName ||
        ''
      }`}
      className="min-w-[55vw]"
    >
      <section className="w-full flex flex-col gap-4">
        <menu className="grid grid-cols-2 w-full gap-5">
          <p>
            Name:{' '}
            {`${
              selectedFounderDetailWithShares?.founderDetail?.personDetail
                ?.firstName
            } ${
              selectedFounderDetailWithShares?.founderDetail?.personDetail
                ?.lastName || ''
            }`}
          </p>
          <p>
            Document Number:{' '}
            {selectedFounderDetailWithShares?.founderDetail?.personDetail
              ?.personDocNo || ''}
          </p>
          <p>
            Phone number:{' '}
            {selectedFounderDetailWithShares?.founderDetail?.personDetail
              ?.phoneNumber || ''}
          </p>
          <p>
            Nationality:{' '}
            {selectedFounderDetailWithShares?.founderDetail?.personDetail
              ?.nationality &&
              findCountryNameByCode(
                selectedFounderDetailWithShares?.founderDetail?.personDetail
                  ?.nationality,
                countriesList
              )}
          </p>
          <p>
            Sex:{' '}
            {
              selectedFounderDetailWithShares?.founderDetail?.personDetail
                ?.gender
            }
          </p>
          <p>
            Email:{' '}
            {
              selectedFounderDetailWithShares?.founderDetail?.personDetail
                ?.email
            }
          </p>
        </menu>
      </section>
      <section className="w-full flex flex-col gap-4 my-4">
        <h3 className="font-medium uppercase text-lg underline">
          Share details
        </h3>
        <menu className="grid grid-cols-2 w-full gap-5">
          <p>
            Share Quantity:{' '}
            {formatNumbers(
              selectedFounderDetailWithShares?.founderDetail?.shareQuantity
            )}
          </p>
          <p>
            Share Amount:{' '}
            {formatCurrency(
              selectedFounderDetailWithShares?.founderDetail?.totalQuantity,
              'RWF'
            )}
          </p>
          <p>
            Share Quantity Percentage:{' '}
            {selectedFounderDetailWithShares?.shareQuantityPercentage}%
          </p>
        </menu>
      </section>
    </Modal>
  );
};

export default FounderDetailsWithSharesDetails;
