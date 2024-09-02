import Combobox from '@/components/inputs/Combobox';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { beneficialOwnerOccupations } from '@/constants/beneficialOwner.constants';
import validateInputs from '@/helpers/validations';
import {
  useLazyFetchCellsQuery,
  useLazyFetchDistrictsQuery,
  useLazyFetchProvincesQuery,
  useLazyFetchSectorsQuery,
  useLazyFetchVillagesQuery,
} from '@/states/api/businessRegApiSlice';
import { AppDispatch } from '@/states/store';
import {
  Cell,
  District,
  Province,
  Sector,
  Village,
} from '@/types/locationTypes';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

interface BeneficialOwnerProfessionalAddressProps {
  personIdentType?: string;
}

const BeneficialOwnerProfessionalAddress = ({
  personIdentType = 'NID',
}: BeneficialOwnerProfessionalAddressProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
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

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
  } = useForm();

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

  return (
    <section className="w-full flex flex-col gap-4">
      {personIdentType === 'NID' && (
        <menu className="w-full flex flex-col gap-6">
          <h3 className="text-center uppercase text-primary text-lg font-medium">
            Professional address
          </h3>
          <fieldset className="w-full grid grid-cols-2 gap-5">
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
                      placeholder={sectorsIsFetching ? '...' : 'Select sector'}
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
            <Controller
              name="proEmail"
              control={control}
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
                    <Input
                      label="Email"
                      placeholder="Email"
                      required
                      {...field}
                    />
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
              rules={{ required: 'Professional phone number is required' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      label="Phone Number"
                      placeholder="Phone Number"
                      type="tel"
                      required
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
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Combobox
                      label="Occupation"
                      required
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
          </fieldset>
        </menu>
      )}
      <Controller
        name="occupationAttachment"
        control={control}
        rules={{ required: 'Proof of occupation is required' }}
        render={({ field }) => {
          return (
            <label className="w-full flex flex-col gap-2">
              <p className="text-[15px]">
                Proof of occupation <span className="text-red-500">*</span>
              </p>
              <Input
                label="Upload proof of occupation"
                type="file"
                required
                {...field}
              />
            </label>
          );
        }}
      />
    </section>
  );
};

export default BeneficialOwnerProfessionalAddress;
