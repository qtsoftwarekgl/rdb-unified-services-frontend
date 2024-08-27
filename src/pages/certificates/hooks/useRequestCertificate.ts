/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/states/store";
import { useSelector } from "react-redux";
import { useCreateCertificateRequestMutation } from "@/states/api/businessRegApiSlice";
import { toast } from "react-toastify";


// Define the validation schema
const validationSchema = z.object({
  type: z.string().min(1, "Type is required"), // Use .min instead of .nonempty to avoid duplication issues
});

type FormData = z.infer<typeof validationSchema>;

type SelectOption = {
    label: string;
    value: string;
  };

export default function useRequestCertificate() {
  const [showRequestCertificate, setShowRequestCertificate] = useState(false);
  const requestableCertificate = [
    {
      type: "CESSATION_OF_DORMANCY_DOMESTIC",
      endpoint: "cessation"
    },
    {
      type: "CESSATION_OF_DORMANCY_FOREIGN",
      endpoint: "cessation"
    },
    {
      type: "DISSOLUTION_DOMESTIC",
      endpoint: "dissolution"
    },
    {
      type: "DISSOLUTION_FOREIGN",
      endpoint: "dissolution"
    },
    {
      type: "DISSOLUTION_ENTERPRISE",
      endpoint: "dissolution"
    },
    {
      type: "DOMESTIC_COMPANY_REGISTRATION",
      endpoint: "domestic-company"
    },
    {
      type: "FOREIGN_COMPANY_REGISTRATION",
      endpoint: "foreign-company"
    },
    {
      type: "ENTERPRISE_REGISTRATION",
      endpoint: "enterprise"
    },
    {
      type: "CONFIRMATION_OF_DORMANCY_DOMESTIC",
      endpoint: "dormancy"
    },
    {
      type: "CONFIRMATION_OF_DORMANCY_FOREIGN",
      endpoint: "dormancy"
    },
    {
      type: "CONFIRMATION_OF_DORMANCY_ENTERPRISE",
      endpoint: "dormancy"
    }
  ];

  const {
    certificatesCompany,
  } = useSelector((state: RootState) => state.business);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  const [
    createCertificateRequest,
    {
      isLoading: isRequesting,
      data: requestData,
      isError: requestError,
      error: requestErrorData,
      isSuccess: requestSuccess,
    },
  ] = useCreateCertificateRequestMutation();

  const onSubmit = (data: FormData) => {
    // Handle form submission
    createCertificateRequest({
      businessId: certificatesCompany?.id,
      certificateType: data.type,
      endpoint: requestableCertificate.find((certificate) => certificate.type === data.type)?.endpoint,
    });
  };

  useEffect(() => {
    if (requestSuccess) {
      reset();
      // Handle successful request
      toast.success(requestData?.message || "Certificate generated successfully");
    }
    else if(requestError){
      // Handle request error
      toast.error((requestErrorData as Record<string,any>)?.data?.message || "An error occurred while generating certificate");
    }
  }
  , [requestSuccess, requestError, requestErrorData, requestData, reset]);

  const createSelectOptions = (): SelectOption[] => {
    return requestableCertificate.map((certificate) => ({
      value: certificate.type,
      label: certificate.type.replace(/_/g, " "),
    }));
  };
  
  let selectOptions = createSelectOptions();
    // Filter out foreign certificates if the company is domestic and vice versa
    if(certificatesCompany?.isForeign){
        selectOptions = selectOptions.filter((option) => !option.label.includes("DOMESTIC"));
    }
    else{
        selectOptions = selectOptions.filter((option) => !option.label.includes("FOREIGN"));
    }

    // Filter out enterprise certificates if the company is not an enterprise, an enterprise company have enterpriseName 
    if(!certificatesCompany?.enterpriseName){
        selectOptions = selectOptions.filter((option) => !option.label.includes("ENTERPRISE"));
    }
    else{
        selectOptions = selectOptions.filter((option) => !option.label.includes("DOMESTIC"));
    }


  return {
    showRequestCertificate,
    setShowRequestCertificate,
    register,
    handleSubmit,
    errors,
    onSubmit,
    control,
    setValue,
    selectOptions,
    isRequesting
  };
}
