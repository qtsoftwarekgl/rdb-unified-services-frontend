import Modal from '@/components/Modal';
import Table from '@/components/table/Table';
import { convertDecimalToPercentage } from '@/helpers/strings';
import { setSimilarBusinessNamesModal } from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const SimilarBusinessNames = ({ businessName }: { businessName: string }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { similarBusinessNamesModal, nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );

  // BUSINESS NAMES COLUMNS
  const businessNamesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Business Name',
      accessorKey: 'companyName',
    },
    {
      header: 'Similarity',
      accessorKey: 'similarity',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
  ];

  return (
    <Modal
      isOpen={similarBusinessNamesModal}
      onClose={() => {
        dispatch(setSimilarBusinessNamesModal(false));
      }}
    >
      <h1 className="text-center text-primary font-medium uppercase">
        List of businesses with similar names to {businessName?.toUpperCase()}
      </h1>
      <section className="flex flex-col gap-2">
        <Table
          showFilter={false}
          showPagination={false}
          data={nameAvailabilitiesList?.map(
            (
              nameAvailability: {
                companyName: string;
                similarity: string | number;
              },
              index: number
            ) => {
              return {
                no: index + 1,
                companyName: nameAvailability.companyName,
                similarity: `${convertDecimalToPercentage(
                  nameAvailability.similarity
                )}%`,
              };
            }
          )}
          columns={businessNamesColumns}
        />
      </section>
    </Modal>
  );
};

export default SimilarBusinessNames;
