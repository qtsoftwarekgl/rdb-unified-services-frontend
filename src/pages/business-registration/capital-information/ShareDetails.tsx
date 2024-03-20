/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';
import { AppDispatch } from '../../../states/store';
import { useDispatch } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../states/features/businessRegistrationSlice';
import { setUserApplications } from '../../../states/features/userApplicationSlice';

export interface business_share_details {
  company_capital: number;
  total_value: number;
  total_shares: number;
  shares: {
    name: string;
    no_shares: number;
    share_value: number;
    remaining_shares: number;
  }[];
}

interface ShareDetailsProps {
  isOpen: boolean;
  share_details: business_share_details;
  entry_id: string | null;
}

const ShareDetails: FC<ShareDetailsProps> = ({
  isOpen,
  share_details,
  entry_id,
}) => {
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
        ?.map((row) => watch(`${row.name}_no_shares`))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => a + b, 0)
    );
  }, [
    watch('ordinary_share_no_shares'),
    watch('preference_share_no_shares'),
    watch('non_voting_share_no_shares'),
    watch('redeemable_share_no_shares'),
    watch('redeemable_share_no_shares'),
    watch('irredeemable_share_no_shares'),
  ]);

  // HANDLE CAPITAL TOTAL OVERFLOW
  useEffect(() => {
    setValue(
      'total_value',
      tableRows
        ?.map((row) => watch(`${row.name}_total_value`))
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
    watch('ordinary_share_total_value'),
    watch('preference_share_total_value'),
    watch('non_voting_share_total_value'),
    watch('redeemable_share_total_value'),
    watch('irredeemable_share_total_value'),
    watch('company_capital'),
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (share_details && Object.keys(share_details)?.length > 1) {
      setValue('company_capital', share_details?.company_capital);
      setValue('total_value', share_details?.total_value);
      setValue('total_shares', share_details?.total_shares);
      share_details?.shares?.forEach((row: unknown) => {
        setValue(`${row?.name}_no_shares`, row?.no_shares);
        setValue(`${row?.name}_share_value`, row?.share_value);
        setValue(`${row?.name}_total_value`, row?.no_shares * row?.share_value);
      });
    }
  }, [setValue, share_details]);

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          share_details: {
            company_capital: data?.company_capital,
            remaining_capital: data?.company_capital,
            total_value: data?.total_value,
            total_shares: data?.total_shares,
            shares: tableRows?.map((row) => {
              return {
                name: row?.name,
                no_shares: data?.[`${row.name}_no_shares`],
                share_value: data?.[`${row.name}_share_value`],
                remaining_shares: data?.[`${row.name}_no_shares`],
              };
            }),
          },
        })
      );
      dispatch(setBusinessActiveStep('shareholders'));
      dispatch(setBusinessCompletedStep('share_details'));
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <section className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <fieldset className="w-full flex flex-col gap-6">
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
                          watch(`${row.name}_no_shares`) ||
                          share_details?.shares?.find(
                            (share) => share?.name === row?.name
                          )?.no_shares ||
                          0
                        }
                        type="number"
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            return;
                          }
                          setValue(`${row.name}_no_shares`, Number(e.target.value));
                          setValue(
                            `${row.name}_total_value`,
                            Number(watch(`${row.name}_share_value`)) *
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
                          watch(`${row.name}_share_value`) ||
                          share_details?.shares?.find(
                            (share) => share?.name === row?.name
                          )?.share_value ||
                          0
                        }
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            return;
                          }
                          setValue(`${row.name}_share_value`, Number(e.target.value));
                          setValue(
                            `${row.name}_total_value`,
                            Number(watch(`${row.name}_no_shares`)) *
                              Number(e.target.value)
                          );
                        }}
                      />
                    </td>
                    <td className="w-full flex flex-col gap-1">
                      <Input
                        required
                        readOnly
                        value={watch(`${row.name}_total_value`)}
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
                    defaultValue={share_details?.total_value}
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
        </fieldset>
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
