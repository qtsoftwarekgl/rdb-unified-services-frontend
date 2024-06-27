import Loader from '@/components/Loader';
import Table from '@/components/table/Table';
import { capitalizeString } from '@/helpers/strings';
import { useLazyFetchShareholdersQuery } from '@/states/api/businessRegApiSlice';
import { setFounderDetailsList } from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { FounderDetail } from '@/types/models/personDetail';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

type FoundersDetailsProps = {
  businessId: businessId;
};

const FoundersDetails = ({ businessId }: FoundersDetailsProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { founderDetailsList } = useSelector(
    (state: RootState) => state.founderDetail
  );

  // INITIALIZE FETCH SHAREHOLDERS QUERY
  const [
    fetchShareholders,
    {
      data: shareholdersData,
      isLoading: shareholdersIsLoading,
      error: shareholdersError,
      isError: shareholdersIsError,
      isSuccess: shareholdersIsSuccess,
    },
  ] = useLazyFetchShareholdersQuery();

  // FETCH SHAREHOLDERS
  useEffect(() => {
    fetchShareholders({ businessId });
  }, [businessId, fetchShareholders, founderDetailsList]);

  // SHAREHOLDERS COLUMNS
  const shareholderColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Document Number',
      accessorKey: 'personDocNo',
    },
    {
      header: 'Phone number',
      accessorKey: 'phoneNumber',
    },
    {
      header: 'Shareholder Type',
      accessorKey: 'shareHolderType',
    },
  ];

  // HANDLE SHAREHOLDERS RESPONSE
  useEffect(() => {
    if (shareholdersIsError) {
      if ((shareholdersError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while fetching shareholders');
      } else {
        toast.error((shareholdersError as ErrorResponse)?.data?.message);
      }
    } else if (shareholdersIsSuccess) {
      dispatch(setFounderDetailsList(shareholdersData?.data));
    }
  }, [
    shareholdersData,
    shareholdersIsSuccess,
    dispatch,
    shareholdersIsError,
    shareholdersError,
  ]);

  if (founderDetailsList?.length <= 0) return null;

  return (
    <section className="w-full flex flex-col gap-3">
      <h1 className="text-primary uppercase font-medium">Shareholders list</h1>
      {shareholdersIsLoading && (
        <figure className="min-h-[40vh] flex items-center w-full justify-center">
          <Loader />
        </figure>
      )}
      {founderDetailsList?.length === 0 && !shareholdersIsLoading && (
        <p className="text-muted-foreground text-[14px] text-secondary">
          Start by adding shareholders to your business
        </p>
      )}
      <Table
        data={founderDetailsList?.map((founder: FounderDetail) => {
          return {
            ...founder,
            shareHolderType: capitalizeString(founder.shareHolderType),
            name: `${founder.firstName || founder?.companyName} ${
              founder.middleName || ''
            } ${founder.lastName || ''}`,
          };
        })}
        columns={shareholderColumns}
        showFilter={false}
        showPagination={false}
      />
    </section>
  );
};

export default FoundersDetails;
