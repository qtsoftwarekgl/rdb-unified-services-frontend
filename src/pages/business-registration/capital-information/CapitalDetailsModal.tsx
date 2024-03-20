/* eslint-disable react-hooks/exhaustive-deps */
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import Modal from '../../../components/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import Button from '../../../components/inputs/Button';
import {
  setCapitalDetailsModal,
} from '../../../states/features/businessRegistrationSlice';
import Loader from '../../../components/Loader';
import { capitalizeString } from '../../../helpers/Strings';
import { setUserApplications } from '../../../states/features/userApplicationSlice';
import { business_capital_details } from './CapitalDetails';
import { business_share_details } from './ShareDetails';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            if (capital?.no === shareholder?.no) {
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
                remaining_shares: Number(
                  data?.[`${row.name}_remaining_shares`]
                ),
              };
            }),
          },
        })
      );
      dispatch(setCapitalDetailsModal(false));
    }, 1000);
  };

  // RESET FORM
  const inputRefs: {
    no_shares_ref: MutableRefObject<null>;
    name: string;
    value_ref: MutableRefObject<null>;
  }[] = [];
  tableRows?.forEach((row) => {
    inputRefs.push({
      no_shares_ref: useRef(null),
      name: row?.name,
      value_ref: useRef(null),
    });
  });
  const total_shares_ref = useRef(null);
  const total_value_ref = useRef(null);
  useEffect(() => {
    if (!capitalDetailsModal) {
      reset();
      inputRefs?.forEach((input) => {
        if (input?.no_shares_ref?.current && input?.value_ref?.current) {
          input.no_shares_ref.current.value = '';
          input.value_ref.current.value = '';
        }
      });
      if (total_shares_ref?.current) {
        total_shares_ref.current.value = '';
      }
      if (total_value_ref?.current) {
        total_value_ref.current.value = '';
      }
    }
  }, [capitalDetailsModal, reset]);

  // HANDLE CAPITAL SHARES OVERFLOW
  useEffect(() => {
    setValue(
      'total_shares',
      tableRows
        ?.map((row) => watch(`${row.name}_no`))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => a + b, 0)
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
        shareholder?.shares && shareholder?.shares[`no_shares`]
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
          {shareholder?.first_name || ''} {shareholder?.last_name || ''}
        </span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <table className="w-full flex flex-col gap-3">
          <thead className="w-full flex items-center justify-between">
            {tableHeaders?.map((header, index) => {
              return (
                <tr
                  key={index}
                  className="flex flex-row gap-3 w-full font-medium p-3 text-center uppercase"
                >
                  <th className="font-medium text-center">{header}</th>
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

              const remaining_shares = share_details?.shares?.find(
                (share: unknown) => share?.name === row?.name
              )?.remaining_shares;

              const share_value = share_details?.shares?.find(
                (share) => share?.name === row?.name
              )?.share_value;

              return (
                <tr key={index} className="flex flex-row gap-3 w-full">
                  <menu className="flex flex-col gap-1 w-full">
                    <h4 className="w-full text-[15px]">{row?.label}</h4>
                    <p className="text-[12px]">
                      Total: {total_shares || 'N/A'}
                    </p>
                    <p className="text-[12px]">
                      Remaining:{' '}
                      {Number(watch(`${row?.name}_remaining_shares`)) >= 0
                        ? Number(watch(`${row?.name}_remaining_shares`))
                        : remaining_shares || 'N/A'}
                    </p>
                  </menu>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      ref={
                        inputRefs?.find((ref) => ref?.name === row?.name)
                          ?.no_shares_ref
                      }
                      type="number"
                      readOnly={total_shares && share_value ? false : true}
                      defaultValue={
                        (shareholder?.shares &&
                          shareholder?.shares[`${row?.name}_no`]) ||
                        watch(`${row?.name}_no`)
                      }
                      onChange={(e) => {
                        const remainingShares =
                          share_details?.shares &&
                          share_details?.shares?.find(
                            (share) => share?.name === row?.name
                          )?.remaining_shares - Number(e.target.value);
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
                          setValue(`${row.name}_no`, Number(e.target.value));
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
                      ref={
                        inputRefs?.find((ref) => ref?.name === row?.name)
                          ?.value_ref
                      }
                      defaultValue={watch(`${row?.name}_value`)}
                      readOnly
                      value={
                        (shareholder?.shares && shareholder?.shares['value']) ||
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
                <Input
                  ref={total_shares_ref}
                  required
                  readOnly
                  value={watch('total_shares')}
                />
              </td>
              <span className="w-full" />
              <td className="w-full flex flex-col gap-1">
                <Input
                  ref={total_value_ref}
                  required
                  readOnly
                  value={watch('total_value')}
                />
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
            className="!w-[70%] mx-auto"
          />
        )}
      </form>
    </Modal>
  );
};

export default CapitalDetailsModal;
