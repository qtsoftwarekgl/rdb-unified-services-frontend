/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/Input';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import { businessId } from '@/types/models/business';
import { useCreateShareDetailsMutation } from '@/states/api/businessRegApiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ShareDetailsProps {
  businessId: businessId;
  status: string;
}

const ShareDetails: FC<ShareDetailsProps> = ({ businessId, status }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    preview: false,
    submit: false,
    amend: false,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // INITIALIZE CREATE SHARE DETAILS MUTATION
  const [
    createShareDetails,
    {
      isLoading: createShareDetailsIsLoading,
      error: createShareDetailsError,
      isError: createShareDetailsIsError,
      isSuccess: createShareDetailsIsSuccess,
    },
  ] = useCreateShareDetailsMutation();

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

  // HANDLE CAPITAL SHARES OVERFLOW
  useEffect(() => {
    setValue(
      'totalShares',
      tableRows
        ?.map((row) => watch(`${row.name}Quantity`))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => a + b, 0)
    );
  }, [
    watch('ordinaryShareQuantity'),
    watch('preferenceShareQuantity'),
    watch('nonVotingShareQuantity'),
    watch('redeemableShareQuantity'),
    watch('irredeemableShareQuantity'),
  ]);

  // HANDLE CAPITAL TOTAL OVERFLOW
  useEffect(() => {
    setValue(
      'totalAmount',
      tableRows
        ?.map((row) => watch(`${row.name}TotalAmount`))
        ?.filter((row) => Number(row) === row)
        ?.reduce((a, b) => a + b, 0)
    );
    setValue('companyCapital', watch('totalAmount'));
    if (Number(watch('totalAmount')) > Number(watch('companyCapital'))) {
      setError('totalAmount', {
        type: 'manual',
        message: 'Share values cannot exceed total company capital',
      });
    } else {
      clearErrors('totalAmount');
    }
  }, [
    watch('ordinaryShareTotalAmount'),
    watch('preferenceShareTotalAmount'),
    watch('nonVotingShareTotalAmount'),
    watch('redeemableShareTotalAmount'),
    watch('irredeemableShareTotalAmount'),
    watch('companyCapital'),
  ]);

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    const shareDetails = tableRows.map((row) => ({
      shareType: row?.label,
      shareQuantity: data[`${row?.name}Quantity`],
      perValue: data[`${row?.name}PerValue`],
      totalAmount: data[`${row?.name}TotalAmount`],
    }));
    createShareDetails({
      businessId,
      shareDetails,
    });
  };

  // HANDLE CREATE SHARE DETAILS RESPONSE
  useEffect(() => {
    if (createShareDetailsIsError) {
      if ((createShareDetailsError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((createShareDetailsError as ErrorResponse)?.data?.message);
      }
    } else if (createShareDetailsIsSuccess) {
      dispatch(setBusinessCompletedStep('share_details'));
      dispatch(setBusinessActiveStep('shareholders'));
    }
  }, [createShareDetailsIsSuccess]);

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <Controller
            name="companyCapital"
            control={control}
            rules={{ required: 'Total company capital is required' }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    prefixText="RWF"
                    required
                    label="Total company capital"
                    labelClassName="!hidden"
                    {...field}
                    readOnly
                  />
                  <p className="text-secondary text-[12px] hidden">
                    The amount is derived from the total value of available
                    shares
                  </p>
                  {errors?.companyCapital && (
                    <p className="text-[13px] text-red-600">
                      {String(errors?.companyCapital?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <table className="flex flex-col w-full gap-3">
            <thead className="flex items-center justify-between w-full">
              {tableHeaders?.map((header, index) => {
                return (
                  <tr
                    key={index}
                    className="flex flex-row w-full gap-3 p-3 font-normal text-center text-white bg-primary"
                  >
                    <th className="font-medium text-center">{header}</th>
                  </tr>
                );
              })}
            </thead>
            <tbody className="flex flex-col items-center justify-between w-full gap-4 p-2">
              {tableRows?.map((row, index) => {
                return (
                  <tr key={index} className="flex flex-row w-full gap-3">
                    <h4 className="w-full text-[15px]">{row?.label}</h4>
                    <td className="flex flex-col w-full gap-1">
                      <Input
                        required
                        type="number"
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            return;
                          }
                          setValue(
                            `${row.name}Quantity`,
                            Number(e.target.value)
                          );
                          setValue(
                            `${row.name}TotalAmount`,
                            Number(watch(`${row.name}PerValue`)) *
                              Number(e.target.value)
                          );
                        }}
                      />
                    </td>
                    <td className="flex flex-col w-full gap-1">
                      <Input
                        required
                        type="number"
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            return;
                          }
                          setValue(
                            `${row.name}PerValue`,
                            Number(e.target.value)
                          );
                          setValue(
                            `${row.name}TotalAmount`,
                            Number(watch(`${row.name}Quantity`)) *
                              Number(e.target.value)
                          );
                        }}
                      />
                    </td>
                    <td className="flex flex-col w-full gap-1">
                      <Input
                        required
                        readOnly
                        value={watch(`${row.name}TotalAmount`)}
                        type="number"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="flex flex-row items-center justify-between w-full">
              <tr className="flex flex-row items-center justify-between w-full gap-3 p-3">
                <h2 className="w-full font-semibold uppercase">Total</h2>
                <td className="flex flex-col w-full gap-1">
                  <Input required readOnly value={watch('totalShares')} />
                </td>
                <span className="w-full"></span>

                <td className="flex flex-col w-full gap-1">
                  <Input required readOnly value={watch('totalAmount')} />
                </td>
              </tr>
            </tfoot>
            {errors?.totalAmount && (
              <caption className="w-full text-[14px] text-red-600 caption-bottom">
                {String(errors?.totalAmount?.message)}
              </caption>
            )}
          </table>
        </fieldset>
        {[
          'IN_PROGRESS',
          'ACTION_REQUIRED',
          'IN_PREVIEW',
          'IS_AMENDING',
        ].includes(status) && (
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              disabled={disableForm}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep('employment_info'));
                dispatch(setBusinessActiveTab('management'));
              }}
            />
            {status === 'IS_AMENDING' && (
              <Button
                value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                disabled={disableForm || Object.keys(errors)?.length > 0}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors).length > 0) return;
                  setIsLoading({
                    preview: false,
                    amend: true,
                    submit: false,
                  });
                }}
                submit
              />
            )}
            {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) && (
              <Button
                value={
                  isLoading?.preview ? <Loader /> : 'Save & Complete Review'
                }
                primary
                submit
                disabled={Object.keys(errors)?.length > 0 || disableForm}
              />
            )}
            <Button
              value={createShareDetailsIsLoading ? <Loader /> : 'Save & Continue'}
              primary
              submit
              disabled={Object.keys(errors)?.length > 0 || disableForm}
            />
          </menu>
        )}
        {[
          'IN_REVIEW',
          'IS_APPROVED',
          'PENDING_APPROVAL',
          'PENDING_REJECTION',
        ].includes(status) && (
          <menu className="flex items-center gap-3 justify-between">
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep('employment_info'));
                dispatch(setBusinessActiveTab('management'));
              }}
            />
            <Button
              value="Next"
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep('shareholders'));
              }}
            />
          </menu>
        )}
      </form>
    </section>
  );
};

export default ShareDetails;
