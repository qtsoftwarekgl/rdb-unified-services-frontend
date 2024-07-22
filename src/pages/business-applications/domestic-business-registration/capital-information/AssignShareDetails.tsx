/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import Modal from '../../../../components/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { capitalizeString } from '../../../../helpers/strings';
import { businessId } from '@/types/models/business';
import { setAssignSharesModal } from '@/states/features/founderDetailSlice';
import { ShareDetail } from '@/types/models/shareDetail';
import { useAssignSharesMutation } from '@/states/api/businessRegApiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setShareDetailsList } from '@/states/features/shareDetailSlice';

type AssignShareDetailsProps = {
  businessId: businessId;
  applicationStatus: string;
};

const AssignShareDetails = ({ applicationStatus }: AssignShareDetailsProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedFounderDetail, assignSharesModal } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const { shareDetailsList } = useSelector(
    (state: RootState) => state.shareDetail
  );
  const disableForm = ['IN_REVIEW'].includes(applicationStatus);

  // INITIALIZE ASSIGN SHARES MUTATION
  const [
    assignShares,
    {
      isLoading: assignSharesIsLoading,
      error: assignSharesError,
      isSuccess: assignSharesIsSuccess,
      isError: assignSharesIsError,
      data: assignSharesData,
    },
  ] = useAssignSharesMutation();

  // TABLE HEADERS
  const tableHeaders = [
    'Share type',
    'Number of shares',
    'Per Value',
    'Total Value',
  ];

  // TABLE ROWS
  const tableRows = [
    { name: 'ordinaryShare', label: 'Ordinary Share' },
    { name: 'preferenceShare', label: 'Preference Share' },
    { name: 'nonVotingShare', label: 'Non-voting Share' },
    { name: 'redeemableShare', label: 'Redeemable Share' },
    { name: 'irredeemableShare', label: 'Irredeemable Share' },
  ];

  // UPDATE TOTAL QUANTITY AND AMOUNT
  useEffect(() => {
    const totalQuantity = tableRows?.reduce((acc, row) => {
      return acc + (Number(watch(`${row?.name}Quantity`)) || 0);
    }, 0);
    setValue('totalQuantity', totalQuantity);

    const totalAmount = tableRows?.reduce((acc, row) => {
      return acc + (Number(watch(`${row?.name}Amount`)) || 0);
    }, 0);
    setValue('totalAmount', totalAmount);
  }, [
    setValue,
    watch('ordinaryShareQuantity'),
    watch('preferenceShareQuantity'),
    watch('nonVotingShareQuantity'),
    watch('redeemableShareQuantity'),
    watch('irredeemableShareQuantity'),
    watch('ordinaryShareAmount'),
    watch('preferenceShareAmount'),
    watch('nonVotingShareAmount'),
    watch('redeemableShareAmount'),
    watch('irredeemableShareAmount'),
  ]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    const shareDetails = tableRows.map((row) => {
      const shareDetail = shareDetailsList?.find(
        (share: ShareDetail) => share?.shareTypeCD === row?.label
      );
      return {
        shareTypeCD: row.label,
        shareQuantity: Number(data[`${row.name}Quantity`]),
        shareValue: shareDetail?.perValue,
        totalValue: data[`${row.name}Amount`],
        remainingShares: data[`${row.name}RemainingShares`],
      };
    });

    assignShares({
      founderId: selectedFounderDetail?.id,
      shareDetails,
    });
  };

  // HANDLE ASSIGN SHARES RESPONSE
  useEffect(() => {
    if (assignSharesIsError) {
      if ((assignSharesError as ErrorResponse)?.status === 500) {
        toast.error('Failed to assign shares. Please try again later.');
      } else {
        toast.error((assignSharesError as ErrorResponse)?.data?.message);
      }
    } else if (assignSharesIsSuccess) {
      dispatch(setShareDetailsList(assignSharesData?.data));
      dispatch(setAssignSharesModal(false));
      window.location.reload();
    }
  }, [assignSharesIsSuccess]);

  return (
    <Modal
      isOpen={assignSharesModal}
      onClose={() => {
        reset({
          ordinaryShareQuantity: '',
          preferenceShareQuantity: '',
          nonVotingShareQuantity: '',
          redeemableShareQuantity: '',
          irredeemableShareQuantity: '',
          totalQuantity: '',
          ordinaryShareAmount: '',
          preferenceShareAmount: '',
          nonVotingShareAmount: '',
          redeemableShareAmount: '',
          irredeemableShareAmount: '',
          totalAmount: '',
        });
        dispatch(setAssignSharesModal(false));
      }}
      heading={`Assign shares to ${
        selectedFounderDetail?.personDetail?.firstName ||
        selectedFounderDetail?.organization?.organizationName
      }`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={disableForm} className="flex flex-col gap-4">
          <table className="w-full flex flex-col gap-3">
            <thead className="w-full flex items-center justify-between">
              {tableHeaders?.map((header, index) => {
                return (
                  <tr
                    key={index}
                    className="flex flex-row gap-3 w-full font-medium p-3 text-center uppercase"
                  >
                    <th className="font-medium text-center text-primary">
                      {header}
                    </th>
                  </tr>
                );
              })}
            </thead>
            <tbody className="w-full flex flex-col items-center justify-between gap-4 p-2">
              {tableRows?.map((row, index) => {
                const rowShare = shareDetailsList?.find(
                  (share: ShareDetail) => share?.shareTypeCD === row?.label
                );

                return (
                  <tr key={index} className="flex flex-row gap-3 w-full">
                    <menu className="flex flex-col gap-1 w-full">
                      <h4 className="w-full text-[15px]">{row?.label}</h4>
                      <p className={`${disableForm && 'hidden'} text-[12px]`}>
                        Total: {rowShare?.shareQuantity || 0}
                      </p>
                      <p className={`${disableForm && 'hidden'} text-[12px]`}>
                        Remaining:{' '}
                        {Number(rowShare?.remainingShares) -
                          (watch(`${row?.name}Quantity`) || 0)}
                      </p>
                    </menu>
                    <td className="w-full flex flex-col gap-1">
                      <Input
                        required
                        type="number"
                        readOnly={rowShare?.shareQuantity === 0}
                        value={watch(`${row.name}Quantity`)}
                        onChange={(e) => {
                          const remainingShares =
                            Number(rowShare?.remainingShares) -
                            Number(e.target.value);
                          setValue(`${row.name}Quantity`, e.target.value);
                          if (remainingShares < 0) {
                            setError(`shareNo${index}`, {
                              type: 'manual',
                              message: `You are assigning more ${
                                row?.label && capitalizeString(row?.name)
                              }s that your company currently have.`,
                            });
                          } else {
                            clearErrors(`shareNo${index}`);
                            setValue(
                              `${row.name}RemainingShares`,
                              remainingShares
                            );
                            setValue(
                              `${row?.name}Amount`,
                              Number(e.target.value) *
                                Number(rowShare?.perValue)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="w-full flex flex-col gap-1">
                      <Input
                        required
                        type="number"
                        readOnly
                        className="!border-none"
                        value={rowShare?.perValue}
                      />
                    </td>
                    <td className="w-full flex flex-col gap-1">
                      <Input
                        required
                        readOnly
                        value={watch(`${row.name}Amount`)}
                        type="number"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="w-full flex flex-row items-center justify-between">
              <tr className="w-full flex flex-row items-center gap-3 justify-between p-3">
                <h2 className="uppercase font-semibold w-full">Total</h2>
                <td className="w-full flex flex-col gap-1">
                  <Input required readOnly value={watch('totalQuantity')} />
                </td>
                <span className="w-full" />
                <td className="w-full flex flex-col gap-1">
                  <Input required readOnly value={watch('totalAmount')} />
                </td>
              </tr>
            </tfoot>
            <menu
              className={`${
                Object.keys(errors)?.length > 0 ? 'flex' : 'hidden'
              } flex-col gap-4`}
            >
              {Object.values(errors)?.map((error) => {
                return (
                  <caption className="w-full mx-auto text-center text-[13px] text-red-600 caption-bottom">
                    {String(error?.message)}
                  </caption>
                );
              })}
            </menu>
          </table>
          {!errors?.totalPerValue && (
            <Button
              value={assignSharesIsLoading ? <Loader /> : 'Complete'}
              submit
              primary
              className={`!w-[70%] mx-auto ${disableForm ? 'hidden' : ''}`}
              disabled={false || Object.keys(errors)?.length > 0}
            />
          )}
        </fieldset>
      </form>
    </Modal>
  );
};

export default AssignShareDetails;
