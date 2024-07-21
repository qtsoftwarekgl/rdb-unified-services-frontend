import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Button from "@/components/inputs/Button";
import { countriesList } from "@/constants/countries";
import { genderOptions } from "@/constants/inputs.constants";
import { capitalizeString, formatDate } from "@/helpers/strings";
import { convertFileSizeToMbs } from "@/helpers/uploads";
import {
  useLazyFetchPersonAttachmentsQuery,
  useLazyGetBusinessPersonDetailsQuery,
} from "@/states/api/businessRegApiSlice";
import {
  setBusinessPerson,
  setBusinessPersonAttachments,
  setBusinessPersonDetailsModal,
  setDeleteBusinessPersonModal,
  setSelectedBusinessPerson,
} from "@/states/features/businessPeopleSlice";
import { AppDispatch, RootState } from "@/states/store";
import { PersonAttachment } from "@/types/models/attachment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorResponse, Link } from "react-router-dom";
import { toast } from "react-toastify";

const BusinessPersonDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessPersonDetailsModal,
    selectedBusinessPerson,
    businessPerson,
    businessPersonAttachments,
  } = useSelector((state: RootState) => state.businessPeople);

  // INITIALIZE GET BUSINESS PERSON DETAILS
  const [
    getBusinessPersonDetails,
    {
      data: businessPersonData,
      isFetching: businessPersonIsFetching,
      isSuccess: businessPersonIsSuccess,
      isError: businessPersonIsError,
      error: businessPersonError,
    },
  ] = useLazyGetBusinessPersonDetailsQuery();

  // FETCH BUSINESS PERSON
  useEffect(() => {
    if (selectedBusinessPerson) {
      getBusinessPersonDetails({ id: selectedBusinessPerson?.id });
    } else {
      dispatch(setBusinessPersonDetailsModal(false));
    }
  }, [dispatch, getBusinessPersonDetails, selectedBusinessPerson]);

  // HANDLE BUSINESS PERSON DETAILS RESPONSE
  useEffect(() => {
    if (businessPersonIsError) {
      if ((businessPersonError as ErrorResponse)?.status === 500) {
        toast.error(
          `An error occurred while getting ${selectedBusinessPerson?.firstName}'s details. Refresh and try again`
        );
      } else {
        toast.error((businessPersonError as ErrorResponse)?.data?.message);
      }
    } else if (businessPersonIsSuccess) {
      dispatch(setBusinessPerson(businessPersonData?.data));
    }
  }, [
    businessPersonData?.data,
    businessPersonError,
    businessPersonIsError,
    businessPersonIsSuccess,
    dispatch,
    selectedBusinessPerson?.firstName,
  ]);

  // INIITIALIZE FETCH PERSON ATTACHMENTS
  const [
    fetchPersonAttachments,
    {
      data: personAttachmentsData,
      isFetching: personAttachmentsIsFetching,
      isError: personAttachmentsIsError,
      isSuccess: personAttachmentsIsSuccess,
      error: personAttachmentsError,
    },
  ] = useLazyFetchPersonAttachmentsQuery();

  // FETCH PERSON ATTACHMENTS
  useEffect(() => {
    if (selectedBusinessPerson) {
      fetchPersonAttachments({ personId: selectedBusinessPerson?.id });
    } else {
      dispatch(setBusinessPersonDetailsModal(false));
    }
  }, [dispatch, fetchPersonAttachments, selectedBusinessPerson]);

  // HANDLE BUSINESS PERSON DETAILS RESPONSE
  useEffect(() => {
    if (personAttachmentsIsError) {
      if ((personAttachmentsError as ErrorResponse)?.status === 500) {
        toast.error(
          `An error occurred while getting ${selectedBusinessPerson?.firstName}'s attachments. Refresh and try again`
        );
      } else {
        toast.error((personAttachmentsError as ErrorResponse)?.data?.message);
      }
    } else if (personAttachmentsIsSuccess) {
      dispatch(setBusinessPersonAttachments(personAttachmentsData?.data));
    }
  }, [
    personAttachmentsData?.data,
    personAttachmentsError,
    personAttachmentsIsError,
    personAttachmentsIsSuccess,
    dispatch,
    selectedBusinessPerson?.firstName,
  ]);

  return (
    <Modal
      isOpen={businessPersonDetailsModal}
      onClose={() => {
        dispatch(setBusinessPersonDetailsModal(false));
        dispatch(setSelectedBusinessPerson(undefined));
      }}
      heading={`${
        selectedBusinessPerson?.firstName ||
        selectedBusinessPerson?.organizationName
      } ${selectedBusinessPerson?.lastName || ''}`}
    >
      {businessPersonIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[30vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <menu className="grid grid-cols-2 gap-5 w-full min-w-[45vw]">
          <p className="text-[14px]">First Name: {businessPerson?.firstName}</p>
          <p className="text-[14px]">Last Name: {businessPerson?.lastName}</p>
          <p className="text-[14px]">
            Date of birth:{' '}
            {formatDate(businessPerson?.dateOfBirth as unknown as string) ||
              'N/A'}
          </p>
          <p className="text-[14px]">
            Sex:{' '}
            {
              genderOptions?.find(
                (gender) => gender?.value === businessPerson?.gender
              )?.label
            }
          </p>
          <p className="text-[14px]">
            Nationality:{' '}
            {
              countriesList?.find(
                (country) => country?.code === businessPerson?.nationality
              )?.name
            }
          </p>
          <p className="text-[14px]">
            Document Type:{' '}
            {businessPerson?.personIdentType === 'nid'
              ? 'National Identification'
              : 'Passport'}
          </p>
          <p className="text-[14px]">
            Document Issue Place:{' '}
            {
              countriesList?.find(
                (country) => country?.code === businessPerson?.persDocIssuePlace
              )?.name
            }
          </p>
          <p className="text-[14px]">
            Phone number: {businessPerson?.phoneNumber}
          </p>
          <p className="text-[14px]">Email: {businessPerson?.email}</p>
          <p className="text-[14px]">
            Role:{' '}
            {capitalizeString(businessPerson?.personRole?.roleDescription) ||
              capitalizeString(businessPerson?.roleDescription)}
          </p>
        </menu>
      )}
      {personAttachmentsIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[10vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        personAttachmentsIsSuccess &&
        businessPersonAttachments?.length > 0 && (
          <menu className="flex flex-col w-full gap-2 my-4">
            <h1 className="font-medium uppercase text-primary">
              {selectedBusinessPerson?.firstName}'s attachments
            </h1>
            <ul className="grid w-full grid-cols-3 gap-5">
              {businessPersonAttachments?.map(
                (personAttachment: PersonAttachment) => {
                  return (
                    <ul className="p-1 px-5 flex bg-gray-100 items-center gap-2 justify-between rounded-md shadow-xs cursor-pointer transition-all duration-300 hover: scale-[1.01]">
                      <p className="flex flex-col gap-0 text-[12px]">
                        <p className="text-[12px]">
                          {capitalizeString(personAttachment?.attachmentType)}
                        </p>
                        <p className="text-[12px]">
                          {' '}
                          {convertFileSizeToMbs(
                            Number(personAttachment?.fileSize)
                          )}
                        </p>
                      </p>
                      <Link
                        to={personAttachment?.attachmentUrl}
                        target="_blank"
                        className="text-primary text-[13px]"
                      >
                        View
                      </Link>
                    </ul>
                  );
                }
              )}
            </ul>
          </menu>
        )
      )}
      <menu className="flex items-center justify-between w-full gap-3">
        <Button
          value={'Cancel'}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setBusinessPersonDetailsModal(false));
            dispatch(setSelectedBusinessPerson(undefined));
          }}
        />
        <Button
          primary
          value={'Remove'}
          danger
          onClick={(e) => {
            e.preventDefault();
            dispatch(setDeleteBusinessPersonModal(true));
          }}
        />
      </menu>
    </Modal>
  );
};

export default BusinessPersonDetails;
