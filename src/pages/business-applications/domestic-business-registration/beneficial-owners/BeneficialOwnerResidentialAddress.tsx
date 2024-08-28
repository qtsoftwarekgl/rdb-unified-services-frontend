import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import {
  fetchCellsThunk,
  fetchDistrictsThunk,
  fetchProvincesThunk,
  fetchSectorsThunk,
  fetchVillagesThunk,
  setCellsList,
  setDistrictsList,
  setSectorsList,
  setSelectedCell,
  setSelectedDistrict,
  setSelectedProvince,
  setSelectedSector,
  setVillagesList,
} from '@/states/features/locationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface BeneficialOwnerResidentialAddressProps {
  personIdentType?: string;
}

const BeneficialOwnerResidentialAddress = ({
  personIdentType = 'NID',
}: BeneficialOwnerResidentialAddressProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    provincesList,
    districtsList,
    sectorsList,
    cellsList,
    villagesList,
    fetchProvincesIsLoading,
    fetchDistrictsIsLoading,
    fetchSectorsIsLoading,
    fetchCellsIsLoading,
    fetchVillagesIsLoading,
    selectedProvince,
    selectedDistrict,
    selectedSector,
    selectedCell,
  } = useSelector((state: RootState) => state.location);

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
  } = useForm();

  // FETCH PROVINCES THUNK
  useEffect(() => {
    dispatch(fetchProvincesThunk());
  }, [dispatch]);

  // FETCH DISTRICTS THUNK
  useEffect(() => {
    if (selectedProvince) {
      dispatch(fetchDistrictsThunk(selectedProvince?.id));
    }
  }, [dispatch, selectedProvince]);

  // FETCH SECTORS THUNK
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchSectorsThunk(selectedDistrict?.id));
    }
  }, [dispatch, selectedDistrict]);

  // FETCH CELLS THUNK
  useEffect(() => {
    if (selectedSector) {
      dispatch(fetchCellsThunk(selectedSector?.id));
    }
  }, [dispatch, selectedSector]);

  // FETCH VILLAGES THUNK
  useEffect(() => {
    if (selectedCell) {
      dispatch(fetchVillagesThunk(selectedCell?.id));
    }
  }, [dispatch, selectedCell]);

  return (
    <section className="w-full flex flex-col gap-5">
      {personIdentType === 'NID' && (
        <menu className="w-full flex flex-col gap-6">
          <h3 className="text-center uppercase text-primary text-lg font-medium">
            Residential address
          </h3>
          <fieldset className="w-full grid grid-cols-2 gap-5 justify-between">
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
                        fetchProvincesIsLoading ? '...' : 'Select province'
                      }
                      label="Province"
                      options={provincesList?.map((province) => {
                        return {
                          ...province,
                          label: province.name,
                          value: String(province.id),
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(setSelectedProvince(e));
                        dispatch(setSelectedDistrict(undefined));
                        dispatch(setSelectedSector(undefined));
                        dispatch(setSelectedCell(undefined));
                        dispatch(setVillagesList([]));
                        dispatch(setCellsList([]));
                        dispatch(setSectorsList([]));
                        dispatch(setDistrictsList([]));
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
                        fetchDistrictsIsLoading ? '...' : 'Select district'
                      }
                      label="District"
                      options={districtsList?.map((district) => {
                        return {
                          label: district.name,
                          value: String(district.id),
                        };
                      })}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(setSelectedDistrict(e));
                        dispatch(setSelectedSector(undefined));
                        dispatch(setSelectedCell(undefined));
                        dispatch(setVillagesList([]));
                        dispatch(setCellsList([]));
                        dispatch(setSectorsList([]));
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
                        fetchSectorsIsLoading ? '...' : 'Select sector'
                      }
                      label="Sector"
                      options={sectorsList?.map((sector) => {
                        return {
                          label: sector.name,
                          value: String(sector.id),
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(setSelectedSector(e));
                        dispatch(setSelectedCell(undefined));
                        dispatch(setVillagesList([]));
                        dispatch(setCellsList([]));
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
                      placeholder={fetchCellsIsLoading ? '...' : 'Select cell'}
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
                        dispatch(setSelectedCell(e));
                        dispatch(setVillagesList([]));
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
                        fetchVillagesIsLoading ? '...' : 'Select village'
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
              name="streetNumber"
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
          </fieldset>
        </menu>
      )}
    </section>
  );
};

export default BeneficialOwnerResidentialAddress;
