import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import validateInputs from "../../../../helpers/validations";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessActiveStep } from "../../../../states/features/businessRegistrationSlice";
import { businessId } from "@/types/models/business";
import { setBusinessAddress } from "@/states/features/businessSlice";
import { toast } from "react-toastify";
import { ErrorResponse, Link } from "react-router-dom";
import {
  useCreateCompanyAddressMutation,
  useLazyGetBusinessAddressQuery,
} from "@/states/api/businessRegApiSlice";
import {
  useLazyFetchCellsQuery,
  useLazyFetchDistrictsQuery,
  useLazyFetchProvincesQuery,
  useLazyFetchSectorsQuery,
  useLazyFetchVillagesQuery,
} from "@/states/api/businessRegApiSlice";
import {
  setCellsList,
  setDistrictsList,
  setProvincesList,
  setSectorsList,
  setSelectedCell,
  setSelectedDistrict,
  setSelectedProvince,
  setSelectedSector,
  setVillagesList,
} from "@/states/features/locationSlice";
import Loader from "@/components/Loader";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";

type CompanyAddressProps = {
  businessId: businessId;
  applicationStatus?: string;
};

const CompanyAddress = ({
  businessId,
  applicationStatus,
}: CompanyAddressProps) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessAddress } = useSelector((state: RootState) => state.business);
  const {
    provincesList,
    districtsList,
    sectorsList,
    cellsList,
    villagesList,
    selectedProvince,
    selectedCell,
    selectedDistrict,
    selectedSector,
  } = useSelector((state: RootState) => state.location);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showStaticLocation, setShowStaticLocation] = useState(true);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // DISABLE FORM
  useEffect(() => {
    if (["IN_REVIEW"].includes(String(applicationStatus))) {
      setFormDisabled(true);
    }
  }, [applicationStatus]);

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessAddress,
    {
      data: businessAddressData,
      error: businessAddressError,
      isFetching: businessAddressIsFetching,
      isError: businessAddressIsError,
      isSuccess: businessAddressIsSuccess,
    },
  ] = useLazyGetBusinessAddressQuery();

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusinessAddress({ businessId });
    }
  }, [getBusinessAddress, businessId]);

  // HANDLE GET BUSINESS RESPONSE
  useEffect(() => {
    if (businessAddressIsError) {
      if ((businessAddressError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching business data");
      } else {
        toast.error((businessAddressError as ErrorResponse)?.data?.message);
      }
    } else if (businessAddressIsSuccess) {
      dispatch(setBusinessAddress(businessAddressData?.data));
    }
  }, [
    businessAddressData,
    businessAddressError,
    businessAddressIsError,
    businessAddressIsSuccess,
    dispatch,
  ]);

  // INITIALIZE FETCH PROVINCES QUERY
  const [
    fetchProvinces,
    {
      data: provincesData,
      error: provincesError,
      isLoading: provincesIsLoading,
      isError: provincesIsError,
      isSuccess: provincesIsSuccess,
    },
  ] = useLazyFetchProvincesQuery();

  // INITIALIZE FETCH DISTRICTS QUERY
  const [
    fetchDistricts,
    {
      data: districtsData,
      error: districtsError,
      isLoading: districtsIsLoading,
      isError: districtsIsError,
      isSuccess: districtsIsSuccess,
    },
  ] = useLazyFetchDistrictsQuery();

  // INITIALIZE FETCH SECTORS QUERY
  const [
    fetchSectors,
    {
      data: sectorsData,
      error: sectorsError,
      isLoading: sectorsIsLoading,
      isError: sectorsIsError,
      isSuccess: sectorsIsSuccess,
    },
  ] = useLazyFetchSectorsQuery();

  // INITIALIZE FETCH CELLS QUERY
  const [
    fetchCells,
    {
      data: cellsData,
      error: cellsError,
      isLoading: cellsIsLoading,
      isError: cellsIsError,
      isSuccess: cellsIsSuccess,
    },
  ] = useLazyFetchCellsQuery();

  // INITIALIZE FETCH VILLAGES QUERY
  const [
    fetchVillages,
    {
      data: villagesData,
      error: villagesError,
      isLoading: villagesIsLoading,
      isError: villagesIsError,
      isSuccess: villagesIsSuccess,
    },
  ] = useLazyFetchVillagesQuery();

  // FETCH VILLAGES
  useEffect(() => {
    if (selectedCell) {
      fetchVillages({ cellId: selectedCell?.id });
    }
  }, [fetchVillages, selectedCell]);

  // FETCH CELLS
  useEffect(() => {
    if (selectedSector) {
      fetchCells({ sectorId: selectedSector?.id });
    }
  }, [fetchCells, selectedSector]);

  // FETCH SECTORS
  useEffect(() => {
    if (selectedDistrict) {
      fetchSectors({ districtId: selectedDistrict?.id });
    }
  }, [fetchSectors, selectedDistrict]);

  // FETCH DISTRICTS
  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts({ provinceId: selectedProvince?.id });
    }
  }, [fetchDistricts, selectedProvince]);

  // FETCH PROVINCES
  useEffect(() => {
    fetchProvinces({});
  }, [fetchProvinces]);

  // HANDLE FETCH PROVINCES RESPONSE
  useEffect(() => {
    if (provincesIsError) {
      if ((provincesError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching provinces");
      } else {
        toast.error((provincesError as ErrorResponse)?.data?.message);
      }
    } else if (provincesIsSuccess) {
      dispatch(setProvincesList(provincesData?.data));
    }
  }, [
    dispatch,
    provincesData?.data,
    provincesError,
    provincesIsError,
    provincesIsSuccess,
  ]);

  // HANDLE FETCH DISTRICTS RESPONSE
  useEffect(() => {
    if (districtsIsError) {
      if ((districtsError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching districts");
      } else {
        toast.error((districtsError as ErrorResponse)?.data?.message);
      }
    } else if (districtsIsSuccess) {
      dispatch(setDistrictsList(districtsData?.data));
    }
  }, [
    dispatch,
    districtsData?.data,
    districtsError,
    districtsIsError,
    districtsIsSuccess,
  ]);

  // HANDLE FETCH SECTORS RESPONSE
  useEffect(() => {
    if (sectorsIsError) {
      if ((sectorsError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching sectors");
      } else {
        toast.error((sectorsError as ErrorResponse)?.data?.message);
      }
    } else if (sectorsIsSuccess) {
      dispatch(setSectorsList(sectorsData?.data));
    }
  }, [
    dispatch,
    sectorsData?.data,
    sectorsError,
    sectorsIsError,
    sectorsIsSuccess,
  ]);

  // HANDLE FETCH CELLS RESPONSE
  useEffect(() => {
    if (cellsIsError) {
      if ((cellsError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching cells");
      } else {
        toast.error((cellsError as ErrorResponse)?.data?.message);
      }
    } else if (cellsIsSuccess) {
      dispatch(setCellsList(cellsData?.data));
    }
  }, [dispatch, cellsData?.data, cellsError, cellsIsError, cellsIsSuccess]);

  // HANDLE FETCH VILLAGES RESPONSE
  useEffect(() => {
    if (villagesIsError) {
      if ((villagesError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching villages");
      } else {
        toast.error((villagesError as ErrorResponse)?.data?.message);
      }
    } else if (villagesIsSuccess) {
      dispatch(setVillagesList(villagesData?.data));
    }
  }, [
    dispatch,
    villagesData?.data,
    villagesError,
    villagesIsError,
    villagesIsSuccess,
  ]);

  // INITIALIZE CREATE OR UPDATE COMPANY ADDRESS MUTATION
  const [
    createCompanyAddress,
    {
      error: createCompanyAddressError,
      isLoading: createCompanyAddressIsLoading,
      isError: createCompanyAddressIsError,
      isSuccess: createCompanyAddressIsSuccess,
    },
  ] = useCreateCompanyAddressMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createCompanyAddress({
      businessId: businessId,
      villageId: Number(data?.villageId) || 0,
      email: data?.email || businessAddress?.email,
      phoneNumber: data?.phoneNumber || businessAddress?.phoneNumber,
      streetName: data?.streetName || businessAddress?.streetName,
    });
  };

  // HANDLE CREATE OR UPDATE COMPANY ADDRESS RESPONSE
  useEffect(() => {
    if (createCompanyAddressIsError) {
      if ((createCompanyAddressError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while creating or updating company address"
        );
      } else {
        toast.error(
          (createCompanyAddressError as ErrorResponse)?.data?.message
        );
      }
    } else if (createCompanyAddressIsSuccess) {
      toast.success("Company address created or updated successfully");
      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Company Address"
          )?.id,
        })
      );
      dispatch(
        createNavigationFlowThunk({
          businessId,
          massId: findNavigationFlowMassIdByStepName(
            navigationFlowMassList,
            "Business Activity & VAT"
          ),
          isActive: true,
        })
      );
    }
  }, [
    businessId,
    createCompanyAddressError,
    createCompanyAddressIsError,
    createCompanyAddressIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex flex-col w-full gap-6">
      {businessAddressIsFetching && (
        <figure className="min-h-[40vh] flex items-center justify-center w-full">
          <Loader />
        </figure>
      )}
      {businessAddressIsSuccess && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            className="flex flex-col w-full gap-6"
            disabled={["IN_REVIEW"].includes(String(applicationStatus))}
          >
            {businessAddress?.location && !showStaticLocation && (
              <Link
                to={"#"}
                onClick={(e) => {
                  e.preventDefault();
                  setShowStaticLocation(true);
                }}
                className="text-primary text-[13px] underline text-center"
              >
                Show existing location
              </Link>
            )}
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="provinceId"
                control={control}
                rules={{
                  required: !showStaticLocation
                    ? "Select province of residence"
                    : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      {businessAddress?.location?.province &&
                      showStaticLocation ? (
                        <StaticLocation
                          location={businessAddress?.location.province}
                          showStaticLocation={setShowStaticLocation}
                        />
                      ) : (
                        <Select
                          {...field}
                          required
                          placeholder={
                            provincesIsLoading ? "..." : "Select province"
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
                      )}
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
                  required: !showStaticLocation
                    ? "Select district of residence"
                    : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      {businessAddress?.location?.district &&
                      showStaticLocation ? (
                        <StaticLocation
                          location={businessAddress?.location.district}
                          showStaticLocation={setShowStaticLocation}
                        />
                      ) : (
                        <Select
                          required
                          placeholder={
                            districtsIsLoading ? "..." : "Select district"
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
                      )}
                      {errors?.districtId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.districtId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="sectorId"
                control={control}
                rules={{
                  required: !showStaticLocation
                    ? "Select sector of residence"
                    : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      {businessAddress?.location?.sector &&
                      showStaticLocation ? (
                        <StaticLocation
                          location={businessAddress?.location.sector}
                          showStaticLocation={setShowStaticLocation}
                        />
                      ) : (
                        <Select
                          {...field}
                          required
                          placeholder={
                            sectorsIsLoading ? "..." : "Select sector"
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
                      )}
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
                  required: !showStaticLocation
                    ? "Select cell of residence"
                    : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      {businessAddress?.location?.cell && showStaticLocation ? (
                        <StaticLocation
                          location={businessAddress?.location.cell}
                          showStaticLocation={setShowStaticLocation}
                        />
                      ) : (
                        <Select
                          {...field}
                          placeholder={cellsIsLoading ? "..." : "Select cell"}
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
                      )}
                      {errors?.cellId && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.cellId.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="villageId"
                control={control}
                rules={{
                  required: !showStaticLocation
                    ? "Select village of residence"
                    : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      {businessAddress?.location?.village &&
                      showStaticLocation ? (
                        <StaticLocation
                          location={businessAddress?.location.village}
                          showStaticLocation={setShowStaticLocation}
                        />
                      ) : (
                        <Select
                          placeholder={
                            villagesIsLoading ? "..." : "Select village"
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
                      )}
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
                name="streetName"
                defaultValue={businessAddress?.streetName}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        label="Street Name"
                        placeholder="Street name"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="email"
                control={control}
                defaultValue={businessAddress?.email}
                rules={{
                  required: "Email address is required",
                  validate: (value) => {
                    return (
                      validateInputs(String(value), "email") ||
                      "Invalid email address"
                    );
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input
                        required
                        label="Email"
                        placeholder="name@domain.com"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("email");
                        }}
                      />
                      {errors?.email && (
                        <p className="text-sm text-red-500">
                          {String(errors?.email?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="phoneNumber"
                defaultValue={businessAddress?.phoneNumber}
                rules={{
                  required: "Phone number is required",
                  validate: (value) => {
                    return (
                      validateInputs(
                        value?.length < 10 ? `0${value}` : String(value),
                        "tel"
                      ) || "Invalid phone number"
                    );
                  },
                }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input
                        required
                        label="Phone"
                        prefixText="+250"
                        placeholder="Phone number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("phoneNumber");
                        }}
                      />
                      {errors?.phoneNumber && (
                        <p className="text-sm text-red-500">
                          {String(errors?.phoneNumber?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            {[
              "IN_PROGRESS",
              "ACTION_REQUIRED",
              "IS_AMENDING",
              "IN_PREVIEW",
            ].includes(String(applicationStatus)) && (
              <menu
                className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
              >
                <Button
                  value="Back"
                  disabled={formDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      createNavigationFlowThunk({
                        businessId,
                        massId: findNavigationFlowMassIdByStepName(
                          navigationFlowMassList,
                          "Company Details"
                        ),
                        isActive: true,
                      })
                    );
                  }}
                />
                {["IS_AMENDING"].includes(String(applicationStatus)) && (
                  <Button submit value={"Complete Amendment"} />
                )}
                {["IN_PREVIEW", "ACTION_REQUIRED"].includes(
                  String(applicationStatus)
                ) && (
                  <Button
                    value={"Save & Complete Preview"}
                    primary
                    submit
                    disabled={formDisabled}
                  />
                )}
                <Button
                  value={
                    createCompanyAddressIsLoading ? (
                      <Loader />
                    ) : (
                      "Save & Continue"
                    )
                  }
                  primary
                  submit
                  disabled={formDisabled}
                />
              </menu>
            )}
            {[
              "IN_REVIEW",
              "APPROVED",
              "PENDING_APPROVAL",
              "PENDING_REJECTION",
            ].includes(String(applicationStatus)) && (
              <menu className="flex items-center justify-between gap-3">
                <Button
                  value={"Back"}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setBusinessActiveStep("company_details"));
                  }}
                />
                <Button
                  value={"Next"}
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setBusinessActiveStep("business_activity_vat"));
                  }}
                />
              </menu>
            )}
          </fieldset>
        </form>
      )}
    </section>
  );
};

export const StaticLocation = ({
  location,
  showStaticLocation,
}: {
  location: string;
  showStaticLocation: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <menu className="flex items-center w-full gap-4">
      <p className="text-[13px] py-[6px] px-2 rounded-md bg-white border-[1.5px] border-secondary text-black w-full">
        {location}
      </p>
      <Link
        to={"#"}
        className="text-[12px] underline text-primary"
        onClick={(e) => {
          e.preventDefault();
          showStaticLocation(false);
        }}
      >
        Change
      </Link>
    </menu>
  );
};

export default CompanyAddress;
