import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import Loader from "../../../../components/Loader";
import validateInputs from "../../../../helpers/validations";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../../../components/inputs/Select";
import { countriesList } from "../../../../constants/countries";
import { businessId } from "@/types/models/business";
import {
  useLazyFetchCellsQuery,
  useLazyFetchDistrictsQuery,
  useLazyFetchProvincesQuery,
  useLazyFetchSectorsQuery,
  useLazyFetchVillagesQuery,
  useLazyGetBusinessAddressQuery,
} from "@/states/api/businessRegApiSlice";
import { ErrorResponse, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setBusinessAddress,
  uploadAmendmentAttachmentThunk,
} from "@/states/features/businessSlice";
import { useCreateOrUpdateCompanyAddressMutation } from "@/states/api/foreignCompanyRegistrationApiSlice";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";
import ResolutionAttachment from "@/components/resolution-attachment/ResolutionAttachment";
import { ApplicationStatus } from "@/Enums/ApplicationStatus";
import { StaticLocation } from "../../domestic-business-registration/general-information/CompanyAddress";
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
import { set } from "store";

interface CompanyAddressProps {
  businessId: businessId;
  applicationStatus: string;
}

const CompanyAddress: FC<CompanyAddressProps> = ({
  businessId,
  applicationStatus,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    trigger,
    setValue,
    getValues,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessAddress } = useSelector((state: RootState) => state.business);
  const isFormDisabled = [
    "IN_REVIEW",
    "APPROVED",
    "PENDING_APPROVAL",
    "PENDING_REJECTION",
  ].includes(applicationStatus);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const [showStaticLocation, setShowStaticLocation] = useState(true);
  const [isPlaceOfIncorporationChanged, setIsPlaceOfIncorporationChanged] =
    useState(false);
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

  // Resolution attachment
  const { file, fileName, attachmentType } = useSelector(
    (state: RootState) => state.resolutionAttachment
  );

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessAddress,
    {
      data: businessAddressData,
      error: businessAddressError,
      isLoading: businessAddressIsLoading,
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

  // SET DEFAULT VALUES
  useEffect(() => {
    if (businessAddress && Object.keys(businessAddress).length > 0) {
      setValue(
        "countryOfIncorporation",
        businessAddress?.countryOfIncorporation
      );
    }
  }, [businessAddress, dispatch, setValue]);

  // INITIALIZE CREATE OR UPDATE COMPANY ADDRESS MUTATION
  const [
    createCompanyAddress,
    {
      error: createCompanyAddressError,
      isLoading: createCompanyAddressIsLoading,
      isError: createCompanyAddressIsError,
      isSuccess: createCompanyAddressIsSuccess,
      data: createCompanyAddressData,
    },
  ] = useCreateOrUpdateCompanyAddressMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createCompanyAddress({
      businessId: businessId,
      villageId: Number(data?.villageId) || 0,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      streetName: data?.streetName,
      placeOfIncorporationDto: isPlaceOfIncorporationChanged
        ? {
            incorporationName: data?.incorporationName,
            country: data?.countryOfIncorporation,
            email: data?.incorporationEmail,
            phoneNumber: data?.incorporationPhoneNumber,
            poBox: data?.poBox,
            fax: data?.fax,
            address1: data?.address1,
            address2: data?.address2,
          }
        : null,
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
      if (applicationStatus === ApplicationStatus.IsAmending) {
        // upload resolution attachment
        if (file && businessId)
          dispatch(
            uploadAmendmentAttachmentThunk({
              file,
              fileName,
              attachmentType,
              businessId: businessId.toString(),
              amendmentId: createCompanyAddressData?.data?.amendmentId,
            })
          );
      }
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

  // SET DEFAULT VALUES FROM BUSINESS ADDRESS
  useEffect(() => {
    if (businessAddress && Object.keys(businessAddress).length > 0) {
      // use reset function
      reset({
        countryOfIncorporation: businessAddress?.countryOfIncorporation,
        zipCode: businessAddress?.zipCode,
        email: businessAddress?.email,
        phoneNumber: businessAddress?.phoneNumber,
        streetName: businessAddress?.streetName,
        incorporationName:
          businessAddress?.placeOfIncorporation?.incorporationName,
        incorporationEmail: businessAddress?.placeOfIncorporation?.email,
        incorporationPhoneNumber:
          businessAddress?.placeOfIncorporation?.phoneNumber,
        poBox: businessAddress?.placeOfIncorporation?.poBox,
        fax: businessAddress?.placeOfIncorporation?.fax,
        address1: businessAddress?.placeOfIncorporation?.address1,
        address2: businessAddress?.placeOfIncorporation?.address2,
        countryOfIncorporation: businessAddress?.placeOfIncorporation?.country,
      });
    }
  }, [businessAddress, setValue]);

  return (
    <section className="flex flex-col w-full gap-6">
      {businessAddressIsLoading && (
        <figure className="min-h-[40vh] flex items-center justify-center w-full">
          <Loader />
        </figure>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <h1 className="text-lg">Local Address</h1>
          <menu className="flex flex-col gap-4 p-4 mb-8 border rounded-md">
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
          </menu>
          <h1 className="text-lg">Place of Incorporation</h1>
          <menu className="flex flex-col gap-6 p-4 border rounded-md">
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="incorporationName"
                control={control}
                defaultValue={
                  watch("incorporationName") ||
                  businessAddress?.placeOfIncorporation?.incorporationName
                }
                rules={{ required: "Incorporation name is required" }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        required
                        label="Incorporation Name"
                        defaultValue={
                          watch("incorporationName") ||
                          businessAddress?.placeOfIncorporation
                            ?.incorporationName
                        }
                        placeholder="Incoporation name"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
                        }}
                      />
                      {errors?.incorporationName && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.incorporationName.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="countryOfIncorporation"
                control={control}
                defaultValue={watch("countryOfIncorporation")}
                rules={{ required: "Country of incorporation is required" }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        placeholder="Select country of incorporation"
                        {...field}
                        required
                        defaultValue={watch("countryOfIncorporation")}
                        label="Country of Incorporation"
                        options={countriesList
                          ?.filter((country) => country.code !== "RW")
                          .map((country) => {
                            return {
                              ...country,
                              label: country.name,
                              value: country.code,
                            };
                          })}
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
                        }}
                      />
                      {errors?.countryOfIncorporation && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.countryOfIncorporation.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="incorporationEmail"
                control={control}
                defaultValue={
                  watch("incorporationEmail") ||
                  businessAddress?.placeOfIncorporation?.email
                }
                rules={{
                  required: watch("incorporationEmail")
                    ? "Email address is required"
                    : false,
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
                        defaultValue={
                          watch("incorporationEmail") ||
                          businessAddress?.placeOfIncorporation?.email
                        }
                        placeholder="name@domain.com"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
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
                name="incorporationPhoneNumber"
                control={control}
                defaultValue={
                  watch("incorporationPhoneNumber") ||
                  businessAddress?.placeOfIncorporation?.phoneNumber
                }
                rules={{
                  required: "Phone number is required",
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <p className="flex items-center gap-1">
                        Phone number <span className="text-red-600">*</span>
                      </p>
                      <menu className="relative flex items-center gap-0">
                        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                          <select
                            className="w-full !text-[12px]"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setIsPlaceOfIncorporationChanged(true);
                            }}
                          >
                            {countriesList?.map((country) => {
                              return (
                                <option
                                  key={country?.dial_code}
                                  value={country?.dial_code}
                                >
                                  {`${country?.code} ${country?.dial_code}`}
                                </option>
                              );
                            })}
                          </select>
                        </span>
                        <input
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setIsPlaceOfIncorporationChanged(true);
                          }}
                          defaultValue={
                            watch("incorporationPhoneNumber") ||
                            businessAddress?.placeOfIncorporation?.phoneNumber
                          }
                          className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                          type="text"
                        />
                      </menu>
                      {errors?.incorporationPhoneNumber && (
                        <p className="text-sm text-red-500">
                          {String(errors?.incorporationPhoneNumber?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="address1"
                control={control}
                defaultValue={
                  watch("address1") ||
                  businessAddress?.placeOfIncorporation?.address1
                }
                rules={{ required: "address1 is required" }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        label="Address1"
                        required
                        defaultValue={
                          watch("address1") ||
                          businessAddress?.placeOfIncorporation?.address1
                        }
                        placeholder="Address1"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
                        }}
                      />
                      {errors?.address1 && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.address1.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="address2"
                control={control}
                defaultValue={
                  watch("address2") ||
                  businessAddress?.placeOfIncorporation?.address2
                }
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        label="Address2"
                        defaultValue={
                          watch("address2") ||
                          businessAddress?.placeOfIncorporation?.address2
                        }
                        placeholder="Address2"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
                        }}
                      />
                      {errors?.address2 && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.address2.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
            <menu className="flex items-start w-full gap-6">
              <Controller
                control={control}
                name="poBox"
                defaultValue={
                  watch("poBox") || businessAddress?.placeOfIncorporation?.poBox
                }
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        defaultValue={
                          watch("poBox") ||
                          businessAddress?.placeOfIncorporation?.poBox
                        }
                        label="P.O.Box"
                        placeholder="P.O.Box"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
                        }}
                      />
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                defaultValue={
                  watch("fax") || businessAddress?.placeOfIncorporation?.fax
                }
                name="fax"
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Input
                        label="Fax"
                        placeholder="Fax"
                        defaultValue={
                          watch("fax") ||
                          businessAddress?.placeOfIncorporation?.fax
                        }
                        onChange={(e) => {
                          field.onChange(e);
                          setIsPlaceOfIncorporationChanged(true);
                        }}
                      />
                    </label>
                  );
                }}
              />
            </menu>
          </menu>
          {
            // resolution attachment
            applicationStatus === ApplicationStatus.IsAmending && (
              <ResolutionAttachment control={control} errors={errors} />
            )
          }
          {[
            ApplicationStatus.IsAmending,
            ApplicationStatus.Inprogress,
            ApplicationStatus.Forcorrection,
          ].includes(applicationStatus as ApplicationStatus) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={isFormDisabled}
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
              <Button
                value={
                  createCompanyAddressIsLoading ? <Loader /> : "Save & Continue"
                }
                primary
                submit
                disabled={isFormDisabled}
              />
            </menu>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default CompanyAddress;
