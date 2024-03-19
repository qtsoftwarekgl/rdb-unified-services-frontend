import { AppDispatch, RootState } from '../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../components/Modal';
import { setListCommentsModal } from '../../../states/features/businessRegistrationSlice';

const ListReviewComments = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { listCommentsModal } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  return (
    <Modal
      isOpen={listCommentsModal}
      onClose={() => {
        dispatch(setListCommentsModal(false));
      }}
    >
      ListReviewComments
    </Modal>
  );
};

export default ListReviewComments;
