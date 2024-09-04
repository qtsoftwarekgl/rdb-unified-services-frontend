import Button from '@/components/inputs/Button';
import Combobox from '@/components/inputs/Combobox';
import CustomPopover from '@/components/inputs/CustomPopover';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import Loader from '@/components/Loader';
import Table from '@/components/table/Table';
import { beneficialOwnerOccupations } from '@/constants/beneficialOwner.constants';
import { attachmentColumns } from '@/constants/business.constants';
import { countriesList } from '@/constants/countries';
import ConfirmActionModal from '@/containers/modals/ConfirmActionModal';
import validateInputs from '@/helpers/validations';
import {
  useLazyFetchCellsQuery,
  useLazyFetchDistrictsQuery,
  useLazyFetchProvincesQuery,
  useLazyFetchSectorsQuery,
  useLazyFetchVillagesQuery,
  useUpdateBeneficialOwnerProfessionalAddressMutation,
} from '@/states/api/businessRegApiSlice';
import {
  setActiveBeneficialOwnerNavigationStep,
  setCompleteBeneficialOwnerNavigationStep,
  setNewBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { AppDispatch, RootState } from '@/states/store';
import {
  Cell,
  District,
  Province,
  Sector,
  Village,
} from '@/types/locationTypes';
import { queryParam } from '@/types/models/business';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface BeneficialOwnerProfessionalAddressProps {
  beneficialOwnerId: queryParam;
}

const BeneficialOwnerProfessionalAddress = ({
  beneficialOwnerId,
}: BeneficialOwnerProfessionalAddressProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { newBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );
  const [selectedProvince, setSelectedProvince] = useState<number | undefined>(
    undefined
  );
  const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(
    undefined
  );
  const [selectedSector, setSelectedSector] = useState<number | undefined>(
    undefined
  );
  const [selectedCell, setSelectedCell] = useState<number | undefined>(
    undefined
  );
  const [villagesList, setVillagesList] = useState<Village[]>([]);
  const [cellsList, setCellsList] = useState<Cell[]>([]);
  const [sectorsList, setSectorsList] = useState<Sector[]>([]);
  const [districtsList, setDistrictsList] = useState<District[]>([]);
  const [provincesList, setProvincesList] = useState<Province[]>([]);
  const [occupationAttachments, setOccupationAttachments] = useState<File[]>(
    []
  );
  const [confirmDeleteAttachment, setConfirmDeleteAttachment] = useState(false);

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    clearErrors,
  } = useForm();

  const { occupation } = watch();

  const { proCountry } = watch();

  // INITIALIZE FETCH PROVINCES QUERY
  const [
    fetchProvinces,
    {
      data: provincesData,
      error: provincesError,
      isFetching: provincesIsFetching,
      isError: provincesIsError,
      isSuccess: provincesIsSuccess,
    },
  ] = useLazyFetchProvincesQuery();

  // FETCH PROVINCES
  useEffect(() => {
    fetchProvinces({});
  }, [fetchProvinces]);

  // HANDLE PROVINCES RESPONSE
  useEffect(() => {
    if (provincesIsError) {
      const errorResponse =
        (provincesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching provinces';
      toast.error(errorResponse);
    } else if (provincesIsSuccess) {
      setProvincesList(provincesData?.data || []);
    }
  }, [
    dispatch,
    provincesData?.data,
    provincesError,
    provincesIsError,
    provincesIsSuccess,
  ]);

  // INITIALIZE FETCH DISTRICTS QUERY
  const [
    fetchDistricts,
    {
      isFetching: districtsIsFetching,
      error: districtsError,
      isError: districtsIsError,
      isSuccess: districtsIsSuccess,
      data: districtsData,
    },
  ] = useLazyFetchDistrictsQuery();

  // FETCH DISTRICTS
  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts({ provinceId: Number(selectedProvince) });
    }
  }, [fetchDistricts, selectedProvince]);

  // HANDLE DISTRICTS RESPONSE
  useEffect(() => {
    if (districtsIsError) {
      const errorResponse =
        (districtsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching districts';
      toast.error(errorResponse);
    } else if (districtsIsSuccess) {
      setDistrictsList(districtsData?.data || []);
    }
  }, [
    dispatch,
    districtsData?.data,
    districtsError,
    districtsIsError,
    districtsIsSuccess,
  ]);

  // INITIALIZE FETCH SECTORS QUERY
  const [
    fetchSectors,
    {
      isFetching: sectorsIsFetching,
      error: sectorsError,
      isSuccess: sectorsIsSuccess,
      isError: sectorsIsError,
      data: sectorsData,
    },
  ] = useLazyFetchSectorsQuery();

  // FETCH SECTORS
  useEffect(() => {
    if (selectedDistrict) {
      fetchSectors({ districtId: Number(selectedDistrict) });
    }
  }, [dispatch, fetchSectors, selectedDistrict]);

  // HANDLE SECTORS RESPONSE
  useEffect(() => {
    if (sectorsIsError) {
      const errorResponse =
        (sectorsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching sectors';
      toast.error(errorResponse);
    } else if (sectorsIsSuccess) {
      setSectorsList(sectorsData?.data || []);
    }
  }, [
    dispatch,
    sectorsData?.data,
    sectorsError,
    sectorsIsError,
    sectorsIsSuccess,
  ]);

  // INITIALIZE FETCH CELLS QUERY
  const [
    fetchCells,
    {
      isFetching: cellsIsFetching,
      error: cellsError,
      isSuccess: cellsIsSuccess,
      isError: cellsIsError,
      data: cellsData,
    },
  ] = useLazyFetchCellsQuery();

  // FETCH CELLS
  useEffect(() => {
    if (selectedSector) {
      fetchCells({ sectorId: Number(selectedSector) });
    }
  }, [fetchCells, selectedSector]);

  // HANDLE CELLS RESPONSE
  useEffect(() => {
    if (cellsIsError) {
      const errorResponse =
        (cellsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching cells';
      toast.error(errorResponse);
    } else if (cellsIsSuccess) {
      setCellsList(cellsData?.data || []);
    }
  }, [cellsData?.data, cellsError, cellsIsError, cellsIsSuccess]);

  // INITIALIZE FETCH VILLAGES QUERY
  const [
    fetchVillages,
    {
      isFetching: villagesIsFetching,
      error: villagesError,
      isSuccess: villagesIsSuccess,
      isError: villagesIsError,
      data: villagesData,
    },
  ] = useLazyFetchVillagesQuery();

  // FETCH VILLAGES
  useEffect(() => {
    if (selectedCell) {
      fetchVillages({ cellId: Number(selectedCell) });
    }
  }, [fetchVillages, selectedCell]);

  // HANDLE VILLAGES RESPONSE
  useEffect(() => {
    if (villagesIsError) {
      const errorResponse =
        (villagesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching villages';
      toast.error(errorResponse);
    } else if (villagesIsSuccess) {
      setVillagesList(villagesData?.data || []);
    }
  }, [villagesData?.data, villagesError, villagesIsError, villagesIsSuccess]);

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

  // INITIALIZE UPDATE PROFESSIONAL ADDRESS MUTATION
  const [
    updateBeneficialOwnerProfessionalAddress,
    {
      isLoading: updateProfessionalAddressIsLoading,
      error: updateProfessionalAddressError,
      isSuccess: updateProfessionalAddressIsSuccess,
      isError: updateProfessionalAddressIsError,
      data: updateProfessionalAddressData,
      reset: resetUpdateProfessionalAddress,
    },
  ] = useUpdateBeneficialOwnerProfessionalAddressMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateBeneficialOwnerProfessionalAddress({
      id: beneficialOwnerId,
      proCountry: data?.proCountry,
      proStreetNumber: data?.proStreetNumber,
      proEmail: data?.proEmail,
      proPhoneNumber: data?.proPhoneNumber,
      occupation: data?.occupation,
      proPoBox: data?.proPoBox,
      proFax: data?.proFax,
    });
  };

  // HANDLE UPDATE PROFESSIONAL ADDRESS RESPONSE
  useEffect(() => {
    if (updateProfessionalAddressIsError) {
      const errorResponse =
        (updateProfessionalAddressError as ErrorResponse)?.data?.message ||
        'An error occurred while updating professional address';
      toast.error(errorResponse);
    } else if (updateProfessionalAddressIsSuccess) {
      dispatch(setNewBeneficialOwner(updateProfessionalAddressData?.data));
      dispatch(
        setCompleteBeneficialOwnerNavigationStep('professional_address')
      );
      dispatch(setActiveBeneficialOwnerNavigationStep('ownership_information'));
      toast.success('Professional address updated successfully');
      resetUpdateProfessionalAddress();
    }
  }, [
    dispatch,
    resetUpdateProfessionalAddress,
    updateProfessionalAddressData,
    updateProfessionalAddressError,
    updateProfessionalAddressIsError,
    updateProfessionalAddressIsSuccess,
  ]);

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="w-full flex flex-col gap-6">
        <h3 className="text-center uppercase text-primary text-lg font-medium">
          Professional address
        </h3>
        <fieldset className="w-full grid grid-cols-2 gap-5">
          <Controller
            name="proCountry"
            control={control}
            defaultValue={newBeneficialOwner?.proCountry}
            rules={{ required: 'Select the country of profession' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Combobox
                    {...field}
                    required
                    label={'Country'}
                    placeholder="Select country"
                    options={countriesList?.map((country) => {
                      return {
                        label: country.name,
                        value: country.code,
                      };
                    })}
                  />
                  {errors?.proCountry && (
                    <span className="text-red-500 text-[13px]">
                      {String(errors?.proCountry.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          {proCountry === 'RW' && (
            <>
              <Controller
                name="provinceId"
                control={control}
                rules={{
                  required: 'Select province of residence',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        {...field}
                        required
                        placeholder={
                          provincesIsFetching ? '...' : 'Select province'
                        }
                        label="Province"
                        options={provincesList?.map((province: Province) => {
                          return {
                            ...province,
                            label: province.name,
                            value: String(province.id),
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedProvince(Number(e));
                          setSelectedDistrict(undefined);
                          setSelectedSector(undefined);
                          setSelectedCell(undefined);
                          setVillagesList([]);
                          setCellsList([]);
                          setSectorsList([]);
                          setDistrictsList([]);
                        }}
                      />
                      {errors?.provinceId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.provinceId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="districtId"
                control={control}
                rules={{
                  required: 'Select district of residence',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        required
                        placeholder={
                          districtsIsFetching ? '...' : 'Select district'
                        }
                        label="District"
                        options={districtsList?.map((district: District) => {
                          return {
                            label: district.name,
                            value: String(district.id),
                          };
                        })}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedDistrict(Number(e));
                          setSelectedSector(undefined);
                          setSelectedCell(undefined);
                          setVillagesList([]);
                          setCellsList([]);
                          setSectorsList([]);
                        }}
                      />
                      {errors?.districtId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.districtId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="sectorId"
                control={control}
                rules={{
                  required: 'Select sector of residence',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        {...field}
                        required
                        placeholder={
                          sectorsIsFetching ? '...' : 'Select sector'
                        }
                        label="Sector"
                        options={sectorsList?.map((sector: Sector) => {
                          return {
                            label: sector.name,
                            value: String(sector.id),
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedSector(Number(e));
                          setSelectedCell(undefined);
                          setVillagesList([]);
                          setCellsList([]);
                        }}
                      />
                      {errors?.sectorId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.sectorId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="cellId"
                control={control}
                rules={{
                  required: 'Select cell of residence',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        {...field}
                        placeholder={cellsIsFetching ? '...' : 'Select cell'}
                        required
                        label="Cell"
                        options={cellsList?.map((cell) => {
                          return {
                            label: cell.name,
                            value: String(cell.id),
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedCell(Number(e));
                          setVillagesList([]);
                        }}
                      />
                      {errors?.cellId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.cellId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="villageId"
                control={control}
                rules={{
                  required: 'Select village of residence',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        placeholder={
                          villagesIsFetching ? '...' : 'Select village'
                        }
                        {...field}
                        required
                        label="Village"
                        options={villagesList?.map((village) => {
                          return {
                            label: village.name,
                            value: String(village.id),
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.villageId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.villageId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                name="proStreetNumber"
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        label="Street number"
                        placeholder="Street number"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            </>
          )}
          <Controller
            name="proStreetNumber"
            control={control}
            defaultValue={newBeneficialOwner?.proStreetNumber}
            rules={{
              required:
                proCountry && proCountry !== 'RW'
                  ? 'Add professional street number'
                  : false,
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    label="Street number"
                    placeholder="Street number"
                    required={proCountry && proCountry !== 'RW'}
                    {...field}
                  />
                  {errors?.proStreetNumber && (
                    <span className="text-red-500 text-[13px]">
                      {String(errors?.proStreetNumber.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="proEmail"
            control={control}
            defaultValue={newBeneficialOwner?.proEmail}
            rules={{
              validate: (value) => {
                if (!value) return true;
                return (
                  validateInputs(value, 'email') ||
                  'Invalid professional email address'
                );
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input label="Email" placeholder="Email" {...field} />
                  {errors?.email && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.email?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="proPhoneNumber"
            control={control}
            defaultValue={newBeneficialOwner?.proPhoneNumber}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    label="Phone Number"
                    placeholder="Phone Number"
                    type="tel"
                    {...field}
                  />
                  {errors?.phoneNumber && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.phoneNumber?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="occupation"
            control={control}
            defaultValue={newBeneficialOwner?.occupation}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Combobox
                    label="Occupation"
                    options={beneficialOwnerOccupations?.map((occupation) => {
                      return {
                        label: occupation,
                        value: occupation,
                      };
                    })}
                    placeholder="Select occupation"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="proPoBox"
            control={control}
            defaultValue={newBeneficialOwner?.proPoBox}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    label="P.O. Box (optional)"
                    placeholder="P.O. Box"
                    {...field}
                  />
                </label>
              );
            }}
          />
        </fieldset>
      </fieldset>
      <Controller
        name="occupationAttachment"
        control={control}
        rules={{
          required: occupation ? 'Proof of occupation is required' : false,
        }}
        render={({ field }) => {
          return (
            <label className="w-full flex flex-col gap-2">
              <p className="text-[15px]">
                Proof of occupation{' '}
                {occupation && <span className="text-red-500">*</span>}
              </p>
              <Input
                label="Upload proof of occupation"
                type="file"
                required={occupation ? true : false}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const files = e.target.files;
                  if (files) {
                    setOccupationAttachments(Array.from(files));
                    clearErrors('occupationAttachment');
                  }
                }}
              />
              {errors?.occupationAttachment && (
                <span className="text-red-500 text-[13px]">
                  {String(errors?.occupationAttachment.message)}
                </span>
              )}
            </label>
          );
        }}
      />
      {occupationAttachments.length > 0 && (
        <Table
          columns={
            attachmentExtendedColumns as ColumnDef<{
              fileName: string;
              attachmentType: string;
              size: number;
            }>[]
          }
          data={occupationAttachments?.map((file) => {
            return {
              fileName: file.name,
              attachmentType: file.type,
              size: file.size,
            };
          })}
        />
      )}
      <menu className="w-full flex items-center gap-3 justify-between mt-3">
        <Button
          value={'Cancel'}
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setActiveBeneficialOwnerNavigationStep('residential_address')
            );
          }}
        />
        <Button
          value={updateProfessionalAddressIsLoading ? <Loader /> : 'Next'}
          primary
          submit
        />
      </menu>
      <ConfirmActionModal
        isOpen={confirmDeleteAttachment}
        onClose={(e) => {
          if (e) e.preventDefault();
          setConfirmDeleteAttachment(false);
        }}
        onConfirm={(e) => {
          e.preventDefault();
          setOccupationAttachments([]);
          setConfirmDeleteAttachment(false);
        }}
        actionType="delete"
        message="Are you sure you want to delete the attachment? You can always upload another one."
      />
    </form>
  );
};

export default BeneficialOwnerProfessionalAddress;
