import Button from '@/components/inputs/Button';
import Combobox from '@/components/inputs/Combobox';
import CustomPopover from '@/components/inputs/CustomPopover';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import Table from '@/components/table/Table';
import { seniorManagementPositions } from '@/constants/beneficialOwner.constants';
import {
  attachmentColumns,
  beneficialOwnerControlMeans,
  beneficialOwnerControlType,
} from '@/constants/business.constants';
import ConfirmActionModal from '@/containers/modals/ConfirmActionModal';
import { capitalizeString } from '@/helpers/strings';
import {
  setActiveBeneficialOwnerNavigationStep,
  setCompleteBeneficialOwnerNavigationStep,
} from '@/states/features/beneficialOwnerSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BeneficialOwnershipInformation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedFounderDetailWithShares } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const { selectedBeneficialOwner, newBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );
  const [confirmDeleteAttachment, setConfirmDeleteAttachment] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    fileName: string;
    attachmentType: string;
    size: number;
  } | null>(null);

  // REACT HOOK FORM
  const {
    control,
    watch,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();
  const {
    beneficialOwnerType,
    controlType,
    significantInfluence,
    extentOfShare,
  } = watch();

  // SET DEFAULT VALUES
  useEffect(() => {
    if (selectedFounderDetailWithShares) {
      setValue(
        'extentOfShare',
        selectedFounderDetailWithShares.shareQuantityPercentage
      );
      setValue(
        'extentOfVoting',
        selectedFounderDetailWithShares.shareQuantityPercentage
      );
    }
    if (selectedBeneficialOwner) {
      setValue(
        'beneficialOwnerType',
        selectedBeneficialOwner?.beneficialOwnerType
      );
      setValue('controlType', selectedBeneficialOwner.controlType);
      setValue(
        'significantInfluence',
        selectedBeneficialOwner.significantInfluence
      );
    }
  }, [selectedBeneficialOwner, selectedFounderDetailWithShares, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    console.log({
      ...newBeneficialOwner,
      ...data,
    });
    dispatch(setCompleteBeneficialOwnerNavigationStep('ownership_information'));
  };

  // ATTACHMENT EXTENDED COLUMNS
  const attachmentExtendedColumns = [
    ...attachmentColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: Row<{
          fileName: string;
          attachmentType: string;
          size: number;
        }>;
      }) => {
        return (
          <CustomPopover
            trigger={
              <FontAwesomeIcon
                icon={faEllipsisH}
                className="p-1 px-3 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer"
              />
            }
          >
            <menu className="w-full flex flex-col gap-1">
              <Link
                to={'#'}
                className="flex items-center hover:bg-background p-[5px] px-2 rounded-md gap-2 text-[13px]"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(row.original);
                }}
              >
                <FontAwesomeIcon
                  className="text-[13px] rounded-full p-[6px] bg-primary text-white cursor-pointer"
                  icon={faEye}
                />{' '}
                Preview{' '}
              </Link>
              <Link
                to={'#'}
                className="flex items-center hover:bg-background p-[5px] px-2 rounded-md gap-2 text-[13px]"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAttachment(row?.original);
                  setConfirmDeleteAttachment(true);
                }}
              >
                <FontAwesomeIcon
                  className="text-[13px] rounded-full p-[6px] bg-red-600 text-white cursor-pointer"
                  icon={faTrash}
                />
                Delete
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="grid grid-cols-2 w-full gap-5 justify-between">
        <Controller
          name="registeredDate"
          control={control}
          rules={{ required: 'Date of becoming beneficial owner is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Date of becoming a beneficial owner"
                  required
                  type="date"
                  toDate={moment().toDate()}
                  {...field}
                />
                {errors?.registeredDate && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.registeredDate?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="controlType"
          control={control}
          rules={{ required: 'Control type is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  {...field}
                  label={'Control Type'}
                  required
                  options={beneficialOwnerControlType?.map((controlType) => {
                    return {
                      label: capitalizeString(controlType),
                      value: controlType,
                      disabled: selectedBeneficialOwner?.controlType
                        ? controlType !== selectedBeneficialOwner?.controlType
                        : false,
                    };
                  })}
                />
                {errors?.controlType && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.controlType?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        {selectedBeneficialOwner?.significantInfluence === 'OTHER' && (
          <Controller
            name="significantInfluence"
            control={control}
            rules={{ required: 'Control means is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    label={'Control Means'}
                    required
                    options={beneficialOwnerControlMeans?.map((controlMean) => {
                      return {
                        label: capitalizeString(controlMean),
                        value: controlMean,
                      };
                    })}
                  />
                  {errors?.significantInfluence && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.significantInfluence?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
        <Controller
          name="extentOfShare"
          control={control}
          rules={{
            required:
              controlType === 'DIRECT' || selectedFounderDetailWithShares
                ? 'Extent of shares is required'
                : false,
          }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label={`Extent of shares ${
                    controlType !== 'DIRECT' && '(optional)'
                  }`}
                  required={
                    controlType === 'DIRECT' ||
                    !!selectedFounderDetailWithShares
                  }
                  readOnly={!!selectedFounderDetailWithShares}
                  type="number"
                  placeholder="Extent of shares"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('extentOfVoting', e.target.value);
                  }}
                />
                {errors?.extentOfShare && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.extentOfShare?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="extentOfVoting"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Extent of voting rights"
                  type="number"
                  required={
                    controlType === 'DIRECT' ||
                    !!selectedFounderDetailWithShares
                  }
                  readOnly={!!selectedFounderDetailWithShares || extentOfShare}
                  placeholder="Extent of voting rights"
                  {...field}
                />
              </label>
            );
          }}
        />
        {beneficialOwnerType === 'SENIOR_MANAGEMENT' && (
          <Controller
            name="seniorManagementPosition"
            rules={{
              required: 'Senior management position is required',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Combobox
                    placeholder="Select Senior Management Position"
                    options={seniorManagementPositions?.map((position) => {
                      return {
                        label: capitalizeString(position),
                        value: position,
                      };
                    })}
                    required
                    label="Senior Management Position"
                    {...field}
                  />
                  {errors?.seniorManagementPosition && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.seniorManagementPosition?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
        {significantInfluence === 'OTHERS' && (
          <Controller
            name="OtherControlMeansDesc"
            control={control}
            rules={{ required: 'Control means description is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    resize
                    required
                    label="Other Control Means Description"
                    placeholder="Enter control means description"
                    {...field}
                  />
                  {errors?.OtherControlMeansDesc && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.OtherControlMeansDesc?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
      </fieldset>
      <menu className="w-full flex flex-col gap-4 my-2">
        <h3 className="font-medium text-lg">Attachments</h3>
        <fieldset className="grid grid-cols-2 gap-5">
          {beneficialOwnerType === 'SENIOR_MANAGEMENT' && (
            <Controller
              name="seniorManagementAttachment"
              control={control}
              rules={{ required: 'Identity card is required' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <p>
                      Proof of management position{' '}
                      <span className="text-red-600">*</span>
                    </p>
                    <Input
                      required
                      label="Identity Card"
                      type="file"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const files = e.target.files;
                        if (files) {
                          setAttachmentFiles((prev) => {
                            return prev
                              ? [...prev, ...Array.from(files)]
                              : Array.from(files);
                          });
                        }
                      }}
                    />
                    {errors?.seniorManagementAttachment && (
                      <span className="text-red-500 text-[12px]">
                        {String(errors?.seniorManagementAttachment?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
          )}
          {controlType !== 'DIRECT' &&
            !selectedFounderDetailWithShares &&
            extentOfShare && (
              <Controller
                name="extentOfShareAttachment"
                control={control}
                rules={{ required: 'Shareholder attachment is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-2">
                      <p>
                        Proof of shares <span className="text-red-600">*</span>
                      </p>
                      <Input
                        required
                        label="Shareholder Attachment"
                        type="file"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const files = e.target.files;
                          if (files) {
                            setAttachmentFiles((prev) => {
                              return prev
                                ? [...prev, ...Array.from(files)]
                                : Array.from(files);
                            });
                          }
                        }}
                      />
                      {errors?.extentOfShareAttachment && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.extentOfShareAttachment?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
            )}
          {selectedBeneficialOwner?.significantInfluence === 'OTHER' && (
            <Controller
              name="significantInfluenceAttachment"
              control={control}
              rules={{ required: 'Control means attachment is required' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <p>
                      Proof of control means{' '}
                      <span className="text-red-600">*</span>
                    </p>
                    <Input
                      required
                      label="Control Means Attachment"
                      type="file"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const files = e.target.files;
                        if (files) {
                          setAttachmentFiles((prev) => {
                            return prev
                              ? [...prev, ...Array.from(files)]
                              : Array.from(files);
                          });
                        }
                      }}
                    />
                    {errors?.significantInfluenceAttachment && (
                      <span className="text-red-500 text-[12px]">
                        {String(
                          errors?.significantInfluenceAttachment?.message
                        )}
                      </span>
                    )}
                  </label>
                );
              }}
            />
          )}
          <Controller
            name="otherAttachments"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-2">
                  <p>Other Attachments</p>
                  <Input
                    label="Other Attachments"
                    type="file"
                    multiple
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const files = e.target.files;
                      if (files) {
                        setAttachmentFiles((prev) => {
                          return prev
                            ? [...prev, ...Array.from(files)]
                            : Array.from(files);
                        });
                      }
                    }}
                  />
                </label>
              );
            }}
          />
        </fieldset>
      </menu>
      {(attachmentFiles?.length ?? 0) > 0 && (
        <Table
          columns={
            attachmentExtendedColumns as ColumnDef<{
              fileName: string;
              attachmentType: string;
              size: number;
            }>[]
          }
          data={Array.from(attachmentFiles ?? [])?.map((file) => {
            return {
              fileName: file.name,
              attachmentType: file.type,
              size: file.size,
            };
          })}
        />
      )}
      <menu className="w-full flex items-center gap-3 justify-between">
        <Button
          value={'Back'}
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setActiveBeneficialOwnerNavigationStep('professional_address')
            );
          }}
        />
        <Button value={'Save'} primary submit />
      </menu>
      <ConfirmActionModal
        actionType="delete"
        isOpen={confirmDeleteAttachment}
        onClose={(e) => {
          if (e) e.preventDefault();
          setConfirmDeleteAttachment(false);
        }}
        onConfirm={(e) => {
          if (e) e.preventDefault();
          setAttachmentFiles((prev) => {
            return prev.filter(
              (file) => file?.name !== selectedAttachment?.fileName
            );
          });
          setConfirmDeleteAttachment(false);
        }}
        message={`Are you sure you want to delete this ${selectedAttachment?.fileName} attachment? You can always re-upload it.`}
      />
    </form>
  );
};

export default BeneficialOwnershipInformation;
