/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import Button from '../../../components/inputs/Button';
import { setCapitalDetails, setShareDetails } from '../../../states/features/businessRegistrationSlice';
import Loader from '../../../components/Loader';
import { capitalizeString } from '../../../helpers/Strings';

interface CapitalDetailsModalProps {
  isOpen: boolean;
  shareholder: object | null;
}

const CapitalDetailsModal: FC<CapitalDetailsModalProps> = ({
  isOpen,
  onClose,
  shareholder,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { share_details, capital_details } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setCapitalDetails(
          capital_details?.map((capital) => {
            if (capital?.no === shareholder?.no) {
              return {
                ...capital,
                shares: {
                  ...data,
                },
              };
            }
            return capital;
          })
        )
      );
      dispatch(
        setShareDetails({
          ...share_details,
          remaining_capital:
            Number(share_details?.remaining_capital) - Number(data?.total_value),
        })
      );
      onClose();
    }, 1000);
  };

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
        ?.map((row) => watch(row.name))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => a + b, 0)
    );
    if (Number(watch('total_value')) > Number(share_details?.remaining_capital)) {
      setError('total_value', {
        type: 'manual',
        message: 'Share values cannot exceed total company capital',
      });
    } else {
      clearErrors('total_value');
    }
  }, [
    watch('ordinary_share'),
    watch('preference_share'),
    watch('non_voting_share'),
    watch('redeemable_share'),
    watch('irredeemable_share'),
    share_details?.remaining_capital,
    clearErrors,
    setValue,
  ]);

  // RESET DEFAULT VALUES
  useEffect(() => {
    tableRows?.forEach((row) => {
        setValue(row?.name, shareholder?.shares && shareholder?.shares[row?.name])
        setValue(
          `${row?.name}_no`,
          shareholder?.shares && shareholder?.shares[`${row?.name}_no`]
        );
    })
  }, [setValue, shareholder])


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              return (
                <tr key={index} className="flex flex-row gap-3 w-full">
                  <menu className="flex flex-col gap-2 w-full">
                    <h4 className="w-full text-[15px]">{row?.label}</h4>
                    <p className="text-[12px]">
                      Total:{' '}
                      {String(
                        Object.entries(share_details.shares[index]).find(
                          ([key]: string) => key === `${row.name}_no`
                        )?.[1] || 0
                      ) || ''}
                    </p>
                  </menu>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      type="number"
                      defaultValue={
                        (shareholder?.shares &&
                          shareholder?.shares[`${row?.name}_no`]) ||
                        watch(`${row?.name}_no`)
                      }
                      onChange={(e) => {
                        const remainingShares =
                          Number(
                            share_details?.shares?.[index][`${row?.name}_no`]
                          ) - Number(e.target.value);
                        const shareName = Object.keys(
                          share_details?.shares[index]
                        )?.find((key) => key === row?.name);
                        if (remainingShares < 0) {
                          setError(`share_no_${index}`, {
                            type: 'manual',
                            message: `You are assigning more ${
                              shareName && capitalizeString(shareName)
                            }s that you company currently have. Update share details to continue.`,
                          });
                        } else clearErrors(`share_no_${index}`);
                        setValue(`${row.name}_no`, Number(e.target.value));
                        setValue(
                          row?.name,
                          Number(e.target.value) *
                            share_details?.shares[index][`${row?.name}_value`]
                        );
                      }}
                    />
                  </td>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      type="number"
                      readOnly
                      className="!border-none"
                      value={share_details?.shares[index][`${row?.name}_value`]}
                    />
                  </td>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      defaultValue={watch(`${row?.name}`)}
                      readOnly
                      value={
                        (shareholder?.shares &&
                          shareholder?.shares[row?.name]) ||
                        watch(row.name)
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
            className="!w-[70%] mx-auto"
          />
        )}
      </form>
    </Modal>
  );
};

export default CapitalDetailsModal;
