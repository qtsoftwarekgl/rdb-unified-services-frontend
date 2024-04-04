/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import Button from '../../../components/inputs/Button';
import { setCapitalDetailsModal } from '../../../states/features/businessRegistrationSlice';
import Loader from '../../../components/Loader';
import { capitalizeString } from '../../../helpers/strings';
import { setUserApplications } from '../../../states/features/userApplicationSlice';
import { business_capital_details } from './CapitalDetails';
import { business_share_details } from './ShareDetails';
import { RDBAdminEmailPattern } from '../../../constants/Users';

interface CapitalDetailsModalProps {
  shareholder: object | null;
  entry_id: string | null;
  capital_details: business_capital_details[];
  share_details: business_share_details;
}

const CapitalDetailsModal: FC<CapitalDetailsModalProps> = ({
  shareholder,
  entry_id,
  capital_details,
  share_details,
}) => {
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
  const { capitalDetailsModal } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // TABLE HEADERS
  const tableHeaders = [
    'Share type',
    'Number of shares',
    'Per Value',
    'Total Value',
  ];

  // TABLE ROWS
  const tableRows = [
    { name: 'ordinary_share', label: 'Ordinary Share' },
    { name: 'preference_share', label: 'Preference Share' },
    { name: 'non_voting_share', label: 'Non-voting Share' },
    { name: 'redeemable_share', label: 'Redeemable Share' },
    { name: 'irredeemable_share', label: 'Irredeemable Share' },
  ];

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          capital_details: capital_details?.map((capital) => {
            if (capital?.shareholder_id === shareholder?.shareholder_id) {
              return {
                ...capital,
                shares: {
                  total_value: data?.total_value,
                  total_shares: data?.total_shares,
                  ordinary_share: data?.ordinary_share_no,
                  preference_share: data?.preference_share_no,
                  non_voting_share: data?.non_voting_share_no,
                  redeemable_share: data?.redeemable_share_no,
                  irredeemable_share: data?.irredeemable_share_no,
                },
              };
            }
            return capital;
          }),
        })
      );
      dispatch(
        setUserApplications({
          entry_id,
          share_details: {
            ...share_details,
            remaining_capital:
              Number(share_details?.remaining_capital) -
              Number(data?.total_value),
            shares: tableRows?.map((row) => {
              const newShare = share_details?.shares?.find(
                (share) => share?.name === row.name
              );
              return {
                ...newShare,
                remaining_shares:
                  Number(data?.[`${row.name}_remaining_shares`]) >= 0
                    ? Number(data?.[`${row.name}_remaining_shares`])
                    : newShare?.remaining_shares,
              };
            }),
          },
        })
      );
      dispatch(setCapitalDetailsModal(false));
    }, 1000);
  };

  useEffect(() => {
    if (!capitalDetailsModal) {
      reset();
      if (watch('total_shares')) {
        setValue('total_shares', '');
      }
      if (watch('total_value')) {
        setValue('total_value', '');
      }
    } else if (capitalDetailsModal && shareholder?.shares) {
      tableRows?.forEach((row) => {
        setValue(
          `${row?.name}_value`,
          shareholder?.shares && shareholder?.shares?.[row?.name]
        );
        setValue(
          `${row?.name}_no`,
          shareholder?.shares && shareholder?.shares[`${row?.name}`]
        );
      });
    }
  }, [capitalDetailsModal, reset]);

  // HANDLE CAPITAL SHARES OVERFLOW
  useEffect(() => {
    setValue(
      'total_shares',
      tableRows
        ?.map((row) => Number(watch(`${row.name}_no`)))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => Number(a) + Number(b), 0)
    );
  }, [
    watch('ordinary_share_no'),
    watch('preference_share_no'),
    watch('non_voting_share_no'),
    watch('redeemable_share_no'),
    watch('redeemable_share_no'),
    watch('irredeemable_share_no'),
  ]);

  // HANDLE CAPITAL TOTAL OVERFLOW
  useEffect(() => {
    setValue(
      'total_value',
      tableRows
        ?.map((row) => watch(`${row.name}_value`))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => a + b, 0)
    );
    if (
      Number(watch('total_value')) > Number(share_details?.remaining_capital)
    ) {
      setError('total_value', {
        type: 'manual',
        message: 'Share values cannot exceed total company capital',
      });
    } else {
      clearErrors('total_value');
    }
  }, [
    watch('ordinary_share_value'),
    watch('preference_share_value'),
    watch('non_voting_share_value'),
    watch('redeemable_share_value'),
    watch('irredeemable_share_value'),
    share_details?.remaining_capital,
    clearErrors,
    setValue,
  ]);

  // RESET DEFAULT VALUES
  useEffect(() => {
    tableRows?.forEach((row) => {
      setValue(
        `${row?.name}_value`,
        shareholder?.shares && shareholder?.shares?.[row?.name]
      );
      setValue(
        `${row?.name}_no`,
        shareholder?.shares && shareholder?.shares[`${row?.name}`]
      );
    });
  }, [setValue, shareholder]);

  return (
    <Modal
      isOpen={capitalDetailsModal}
      onClose={() => {
        dispatch(setCapitalDetailsModal(false));
      }}
    >
      <h1 className="text-center uppercase font-semibold">
        Capital details for{' '}
        <span className="text-primary">
          {shareholder?.first_name || shareholder?.company_name || ''}{' '}
          {shareholder?.last_name || ''}
        </span>
      </h1>
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
                const total_shares =
                  share_details?.shares &&
                  share_details?.shares?.find(
                    (share: unknown) => share?.name === row.name
                  )?.no_shares;

                const remaining_shares =
                  share_details?.shares?.find(
                    (share: unknown) => share?.name === row?.name
                  )?.remaining_shares || 0;

                const share_value = share_details?.shares?.find(
                  (share) => share?.name === row?.name
                )?.share_value;

                return (
                  <tr key={index} className="flex flex-row gap-3 w-full">
                    <menu className="flex flex-col gap-1 w-full">
                      <h4 className="w-full text-[15px]">{row?.label}</h4>
                      <p className={`${disableForm && 'hidden'} text-[12px]`}>
                        Total: {total_shares || 0}
                      </p>
                      <p className={`${disableForm && 'hidden'} text-[12px]`}>
                        Remaining:{' '}
                        {Number(watch(`${row?.name}_remaining_shares`)) >= 0
                          ? Number(watch(`${row?.name}_remaining_shares`))
                          : remaining_shares || 0}
                      </p>
                    </menu>
                    <td className="w-full flex flex-col gap-1">
                      <Input
                        required
                        type="number"
                        readOnly={total_shares && share_value ? false : true}
                        value={watch(`${row.name}_no`)}
                        onChange={(e) => {
                          const remainingShares =
                            (share_details?.shares?.find(
                              (share) => share?.name === row?.name
                            )?.remaining_shares ?? 0) -
                            Number(e.target.value) +
                            (shareholder?.shares[row?.name]
                              ? Number(shareholder?.shares[row?.name])
                              : 0);
                          setValue(`${row.name}_no`, e.target.value);
                          if (remainingShares < 0) {
                            setError(`share_no_${index}`, {
                              type: 'manual',
                              message: `You are assigning more ${
                                row?.name && capitalizeString(row?.name)
                              }s that your company currently have. Update share details to continue.`,
                            });
                          } else {
                            clearErrors(`share_no_${index}`);
                            setValue(
                              `${row.name}_remaining_shares`,
                              remainingShares
                            );
                            setValue(
                              `${row?.name}_value`,
                              Number(e.target.value) *
                                Number(
                                  share_details?.shares?.find(
                                    (share) => share?.name === row?.name
                                  )?.share_value
                                )
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
                        value={
                          share_details?.shares?.find(
                            (share: unknown) => share?.name === row?.name
                          )?.share_value
                        }
                      />
                    </td>
                    <td className="w-full flex flex-col gap-1">
                      <Input
                        required
                        readOnly
                        value={
                          (shareholder?.shares &&
                            Number(shareholder?.shares[row?.name]) *
                              Number(share_value)) ||
                          watch(`${row.name}_value`)
                        }
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
                  <Input required readOnly value={watch('total_shares')} />
                </td>
                <span className="w-full" />
                <td className="w-full flex flex-col gap-1">
                  <Input required readOnly value={watch('total_value')} />
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
                  <caption className="w-full text-[13px] text-start text-red-600 caption-bottom">
                    {String(error?.message)}
                  </caption>
                );
              })}
            </menu>
          </table>
          {!errors?.total_value && (
            <Button
              value={isLoading ? <Loader /> : 'Complete'}
              submit
              primary
              className={`!w-[70%] mx-auto ${disableForm ? 'hidden' : ''}`}
            />
          )}
        </fieldset>
      </form>
    </Modal>
  );
};

export default CapitalDetailsModal;
