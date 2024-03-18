/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';
import { AppDispatch, RootState } from '../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setShareDetails,
} from '../../../states/features/businessRegistrationSlice';

interface ShareDetailsProps {
  isOpen: boolean;
}

const ShareDetails: FC<ShareDetailsProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { share_details } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [isLoading, setIsLoading] = useState(false);

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
    if (Number(watch('total_value')) > Number(watch('company_capital'))) {
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
    watch('company_capital'),
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (share_details && Object.keys(share_details)?.length > 1) {
      setValue('company_capital', share_details?.company_capital);
      setValue('total_value', share_details?.total_value);
      setValue('total_shares', share_details?.total_shares);
      share_details?.shares?.forEach((row: unknown) => {
        Object.entries(row).forEach(([key, value]) => {
          setValue(key, value);
        });
      });
    }
  }, [setValue, share_details]);

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setShareDetails({
          company_capital: data?.company_capital,
          remaining_capital: data?.company_capital,
          total_value: data?.total_value,
          total_shares: data?.total_shares,
          shares: tableRows?.map((row) => {
            return {
              [`${row.name}_no`]: data[`${row.name}_no`],
              [`${row.name}_value`]: data[`${row.name}_value`],
              [`${row.name}`]: data[`${row.name}`],
            };
          }),
        })
      );
      dispatch(setBusinessActiveStep('shareholders'));
      dispatch(setBusinessCompletedStep('share_details'));
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <section className="w-full flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <Controller
          name="company_capital"
          control={control}
          defaultValue={share_details?.company_capital}
          rules={{ required: 'Total company capital is required' }}
          render={({ field }) => {
            return (
              <label className="w-[49%] flex flex-col gap-1">
                <Input
                  prefixText="RWF"
                  required
                  label="Enter company capital"
                  {...field}
                />
                {errors?.company_capital && (
                  <p className="text-[13px] text-red-600">
                    {String(errors?.company_capital?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <table className="w-full flex flex-col gap-3">
          <thead className="w-full flex items-center justify-between">
            {tableHeaders?.map((header, index) => {
              return (
                <tr
                  key={index}
                  className="flex flex-row gap-3 w-full font-normal bg-primary text-white p-3 text-center"
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
                  <h4 className="w-full text-[15px]">{row?.label}</h4>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      defaultValue={
                        watch(`${row.name}_no`) ||
                        share_details?.shares?.[index]?.[`${row.name}_no`] ||
                        0
                      }
                      type="number"
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) {
                          return;
                        }
                        setValue(`${row.name}_no`, Number(e.target.value));
                        setValue(
                          `${row.name}`,
                          Number(watch(`${row.name}_value`)) *
                            Number(e.target.value)
                        );
                      }}
                    />
                  </td>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      type="number"
                      defaultValue={
                        watch(`${row.name}_value`) ||
                        share_details?.shares?.[index]?.[`${row.name}_value`] ||
                        0
                      }
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) {
                          return;
                        }
                        setValue(`${row.name}_value`, Number(e.target.value));
                        setValue(
                          `${row.name}`,
                          Number(watch(`${row.name}_no`)) *
                            Number(e.target.value)
                        );
                      }}
                    />
                  </td>
                  <td className="w-full flex flex-col gap-1">
                    <Input
                      required
                      readOnly
                      value={watch(row.name)}
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
              <span className="w-full"></span>

              <td className="w-full flex flex-col gap-1">
                <Input
                  required
                  readOnly
                  onChange={(e) => {
                    setValue(
                      'company_capital',
                      tableRows
                        ?.map((row) => watch(row.name))
                        ?.filter((row) => Number(row) === row)
                        ?.reduce((a, b) => a + b, 0)
                    );
                  }}
                  value={watch('total_value')}
                />
              </td>
            </tr>
          </tfoot>
          {errors?.total_value && (
            <caption className="w-full text-[14px] text-red-600 caption-bottom">
              {String(errors?.total_value?.message)}
            </caption>
          )}
        </table>
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setBusinessActiveStep('employment_info'));
              dispatch(setBusinessActiveTab('management'));
              console.log('Back');
            }}
          />
          <Button
            value={isLoading ? <Loader /> : 'Continue'}
            primary
            submit
            disabled={Object.keys(errors)?.length > 0}
          />
        </menu>
      </form>
    </section>
  );
};

export default ShareDetails;
