import { useEffect, useState } from "react"
import { useForm, Controller, FieldValues } from "react-hook-form"
import Button from "../../../components/inputs/Button"
import Input from "../../../components/inputs/Input"
import Loader from "../../../components/Loader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import ViewDocument from "../../user-company-details/ViewDocument"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { businessId } from "@/types/models/business"
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk
} from "@/states/features/navigationFlowSlice"
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName
} from "@/helpers/business.helpers"
import { UnknownAction } from "@reduxjs/toolkit"
import { RootState } from "@/states/store"
import store from "store"
import {
  useLazyFetchBusinessAttachmentsQuery,
  useLazyGetBusinessDetailsQuery,
  useUploadBusinessAttachmentMutation
} from "@/states/api/businessRegApiSlice"
import { ErrorResponse } from "react-router-dom"
import {
  addBusinessAttachment,
  setBusinessAttachments,
  setBusinessDetails
} from "@/states/features/businessSlice"
import { toast } from "react-toastify"
import { BusinessAttachment } from "@/types/models/attachment"
import BusinessPeopleAttachments from "../domestic-business-registration/BusinessPeopleAttachments"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"

type AttachmentsProps = {
  businessId: businessId
  applicationStatus?: string
}

type Attachment = {
  label: string
  file: File | null
  required: boolean
  attachmentType: string
}

const Attachments = ({ businessId, applicationStatus }: AttachmentsProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  // STATE VARIABLES
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // Logged in user
  const user = store.get("user")
  const [attachmentFiles, setAttachmentFiles] = useState<Attachment[]>([
    {
      label: "National ID Copy ",
      file: null,
      required: user?.profile?.personIdentType?.toLowerCase() === "nid",
      attachmentType: "nid"
    },
    {
      label: "Passport Copy",
      file: null,
      required: user.profile?.personIdentType?.toLowerCase() === "passport",
      attachmentType: "passport"
    }
  ])
  const isFormDisabled = ["IN_REVIEW", "APPROVED"].includes(
    String(applicationStatus)
  )
  const [previewAttachment, setPreviewAttachment] = useState<string>("")
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  )
  const { businessAttachments } = useSelector(
    (state: RootState) => state.business
  )

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      isFetching: businessIsFetching,
      error: businessError,
      isError: businessIsError,
      isSuccess: businessIsSuccess
    }
  ] = useLazyGetBusinessDetailsQuery()

  // GET BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId })
    }
  }, [businessId, getBusinessDetails])

  // HANDLE BUSINESS DETAILS DATA RESPONSE
  useEffect(() => {
    if (businessIsError) {
      const errorMessage =
        (businessError as ErrorResponse)?.data?.message ||
        "An error occurred while fetching business details. Please try again later."
      toast.error(errorMessage)
    } else if (businessIsSuccess) {
      dispatch(setBusinessDetails(businessDetailsData?.data))
    }
  }, [
    businessDetailsData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch
  ])

  // INITIALIZE FETCH BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isFetching: businessAttachmentsIsFetching,
      error: businessAttachmentsError,
      isSuccess: businessAttachmentsIsSuccess,
      isError: businessAttachmentsIsError
    }
  ] = useLazyFetchBusinessAttachmentsQuery()

  // FETCH BUSINESS ATTACHMENTS
  useEffect(() => {
    if (businessId) {
      fetchBusinessAttachments({ businessId })
    }
  }, [businessId, fetchBusinessAttachments])

  // INITIALIZE UPLOAD BUSINESS ATTACHMENT
  const [
    uploadBusinessAttachment,
    {
      data: uploadBusinessAttachmentData,
      isLoading: uploadBusinessAttachmentIsLoading,
      error: uploadBusinessAttachmentError,
      isSuccess: uploadBusinessAttachmentIsSuccess,
      isError: uploadBusinessAttachmentIsError
    }
  ] = useUploadBusinessAttachmentMutation()

  // HANDLE UPLOAD BUSINESS ATTACHMENT RESPONSE
  useEffect(() => {
    if (uploadBusinessAttachmentIsError) {
      const errorMessage =
        (uploadBusinessAttachmentError as ErrorResponse)?.data?.message ||
        "An error occurred while uploading attachments. Please try again later."
      toast.error(errorMessage)
    } else if (uploadBusinessAttachmentIsSuccess) {
      toast.success("Attachments uploaded successfully")
      dispatch(addBusinessAttachment(uploadBusinessAttachmentData?.data))
    }
  }, [
    businessId,
    dispatch,
    uploadBusinessAttachmentData,
    uploadBusinessAttachmentError,
    uploadBusinessAttachmentIsError,
    uploadBusinessAttachmentIsSuccess
  ])

  const uploadHelper = (file: File, attachmentType: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("businessId", String(businessId))
    formData.append("attachmentType", attachmentType)
    formData.append("fileName", file.name)
    uploadBusinessAttachment({ formData })
  }

  // HANDLE FETCH BUSINESS ATTACHMENTS RESPONSE
  useEffect(() => {
    if (businessAttachmentsIsError) {
      const errorMessage =
        (businessAttachmentsError as ErrorResponse)?.data?.message ||
        "An error occurred while fetching business attachments. Please try again later."
      toast.error(errorMessage)
    } else if (businessAttachmentsIsSuccess) {
      dispatch(setBusinessAttachments(businessAttachmentsData?.data))
    }
  }, [
    businessAttachmentsData,
    businessAttachmentsError,
    businessAttachmentsIsError,
    businessAttachmentsIsSuccess,
    dispatch
  ])

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Attachments"
          )?.id
        }) as unknown as UnknownAction
      )
      dispatch(
        createNavigationFlowThunk({
          businessId,
          massId: findNavigationFlowMassIdByStepName(
            navigationFlowMassList,
            "Preview & Submission"
          ),
          isActive: true
        }) as unknown as UnknownAction
      )
    }, 4000)
    return {
      ...data,
      businessId,
      applicationStatus
    }
  }

  return (
    <section className="flex flex-col w-full gap-6">
      {(businessAttachmentsIsFetching || businessIsFetching) && (
        <figure className="flex items-center justify-center">
          <Loader />
        </figure>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isFormDisabled}>
        <section className="flex flex-col w-full gap-3 ">
          {attachmentFiles.map(({ label, required, attachmentType }) => (
            <section
              key={attachmentType}
              className={`flex flex-col w-full gap-3`}
            >
              {/* <h1 className="text-lg font-medium uppercase">{label}</h1> */}
              <Controller
                name={attachmentType}
                control={control}
                rules={
                  required
                    ? {
                        required: businessAttachments.some(
                          (attachment: BusinessAttachment) =>
                            attachment.attachmentType === attachmentType
                        )
                          ? false
                          : `Upload ${label.toLowerCase()}`
                      }
                    : {}
                }
                render={({ field }) => (
                  <label className="flex flex-col w-full gap-2">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="flex items-center gap-1">
                        {label}
                        {required && <span className="text-red-600">*</span>}
                        {businessAttachments.some(
                          (attachment: BusinessAttachment) =>
                            attachment.attachmentType === attachmentType
                        ) && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-primary"
                          />
                        )}
                      </p>
                      <Input
                        type="file"
                        required={required}
                        accept="application/pdf"
                        className="!w-fit"
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0])
                          if (e.target.files?.[0])
                            uploadHelper(e.target.files[0], attachmentType)
                        }}
                      />
                    </ul>
                    {errors[attachmentType] && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors[attachmentType]?.message)}
                      </p>
                    )}
                  </label>
                )}
              />
            </section>
          ))}
          {uploadBusinessAttachmentIsLoading && (
            <ul className="flex flex-col items-center gap-3">
              <ul className="flex items-center gap-2">
                <Loader className="text-primary" />
                Uploading attachment...
              </ul>
            </ul>
          )}
          {businessAttachmentsIsFetching ? (
            <figure className="flex items-center gap-3 w-full min-h-[20vh]">
              <Loader className="text-primary" />
              Fetching business attachments...
            </figure>
          ) : (
            businessAttachments?.length > 0 && (
              <BusinessPeopleAttachments attachments={businessAttachments} />
            )
          )}
          <menu
            className={`flex mt-6 items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault()
                dispatch(
                  createNavigationFlowThunk({
                    businessId,
                    massId: findNavigationFlowMassIdByStepName(
                      navigationFlowMassList,
                      "Enterprise Address"
                    ),
                    isActive: true
                  }) as unknown as UnknownAction
                )
              }}
            />
            <Button
              value={isLoading ? <Loader /> : "Save & Continue"}
              disabled={isFormDisabled}
              primary
              submit
            />
          </menu>
          </section>
        </fieldset>
      </form>
      {previewAttachment && (
        <ViewDocument
          documentUrl={previewAttachment}
          setDocumentUrl={setPreviewAttachment}
        />
      )}
    </section>
  )
}

export default Attachments
