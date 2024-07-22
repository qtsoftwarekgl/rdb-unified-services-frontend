import { BusinessAttachment } from '@/types/models/attachment';
import {
  Address,
  Business,
  Details,
  EmploymentInfo,
} from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegApiSlice from '../api/businessRegApiSlice';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';

const initialState: {
  businessesList: Business[];
  business: Business;
  employmentInfo: EmploymentInfo;
  businessAttachments: BusinessAttachment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  selectedBusiness?: Business;
  deleteBusinessModal: boolean;
  nameAvailabilitiesList: {
    companyName: string;
    similarity: string | number;
  }[];
  similarBusinessNamesModal: boolean;
  businessDetails?: Details;
  businessAddress?: Address;
  deleteBusiessAttachmentModal: boolean;
  selectedBusinessAttachment?: BusinessAttachment;
  businessesIsFetching: boolean;
  uploadAmendmentAttachmentIsLoading: boolean;
  uploadAmendmentAttachmentIsSuccess: boolean;
} = {
  businessesList: [],
  business: {} as Business,
  employmentInfo: {} as EmploymentInfo,
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedBusiness: undefined,
  deleteBusinessModal: false,
  nameAvailabilitiesList: [],
  similarBusinessNamesModal: false,
  businessDetails: undefined,
  businessAddress: undefined,
  deleteBusiessAttachmentModal: false,
  businessAttachments: [],
  selectedBusinessAttachment: undefined,
  businessesIsFetching: false,
  uploadAmendmentAttachmentIsLoading: false,
  uploadAmendmentAttachmentIsSuccess: false,
};

// FETCH BUSINESSES
export const fetchBusinessesThunk = createAsyncThunk<
  Business[],
  { page: number; size: number },
  { dispatch: AppDispatch }
>(
  'business/fetchBusinesses',
  async (
    {
      page,
      size,
      serviceId,
      applicationStatus,
    }: {
      page: number;
      size: number;
      serviceId?: string;
      applicationStatus?: string;
    },
    {
      dispatch,
    }: {
      dispatch: AppDispatch;
    }
  ) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchBusinesses.initiate({
          page,
          size,
          serviceId,
          applicationStatus,
        })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while fetching businesses');
      throw error;
    }
  }
);

// UPLOAD AMENDMEND ATTACHMENT
export const uploadAmendmentAttachmentThunk = createAsyncThunk<
  BusinessAttachment,
  {
    file: File;
    businessId: string;
    amendmentId: UUID;
    fileName: string;
    attachmentType: string;
  },
  { dispatch: AppDispatch }
>(
  'business/uploadAmendmentAttachment',
  async (
    { file, businessId, amendmentId, fileName, attachmentType },
    { dispatch }
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('businessId', businessId);
      formData.append('amendmentId', amendmentId);
      formData.append('attachmentType', attachmentType);
      formData.append('fileName', fileName);
      const response = await dispatch(
        businessRegApiSlice.endpoints.uploadAmendmentAttachment.initiate({
          formData,
        })
      ).unwrap();
      toast.success(`${fileName} uploaded successfully`);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while uploading attachment');
      throw error;
    }
  }
);

export const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessesList: (state, action) => {
      state.businessesList = action.payload;
    },
    setBusinessPage: (state, action) => {
      state.page = action.payload;
    },
    setBusinessSize: (state, action) => {
      state.size = action.payload;
    },
    setBusinessTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setBusinessTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setBusiness: (state, action) => {
      state.business = action.payload;
    },
    setBusinessDetails: (state, action) => {
      state.businessDetails = action.payload;
    },
    setBusinessAddress: (state, action) => {
      state.businessAddress = action.payload;
    },
    setEmploymentInfo: (state, action) => {
      state.employmentInfo = action.payload;
    },
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
    setDeleteBusinessModal: (state, action) => {
      state.deleteBusinessModal = action.payload;
    },
    setNameAvailabilitiesList: (state, action) => {
      state.nameAvailabilitiesList = action.payload;
    },
    setSimilarBusinessNamesModal: (state, action) => {
      state.similarBusinessNamesModal = action.payload;
    },
    setDeleteBusinessAttachmentModal: (state, action) => {
      state.deleteBusiessAttachmentModal = action.payload;
    },
    setBusinessAttachments: (state, action) => {
      state.businessAttachments = action.payload;
    },
    addBusinessAttachment: (state, action) => {
      state.businessAttachments = [
        action.payload,
        ...state.businessAttachments,
      ];
    },
    removeBusinessAttachment: (state, action) => {
      state.businessAttachments = state.businessAttachments.filter(
        (attachment: BusinessAttachment) => attachment.id !== action.payload.id
      );
    },
    setSelectedBusinessAttachment: (state, action) => {
      state.selectedBusinessAttachment = action.payload;
    },
    addToBusinessesList: (state, action) => {
      state.businessesList = [...action.payload, ...state.businessesList];
    },
    removeFromBusinessesList: (state, action) => {
      state.businessesList = state.businessesList.filter(
        (business) => business.id !== action.payload
      );
    },
    setUploadAmendmentAttachmentIsLoading: (state, action) => {
      state.uploadAmendmentAttachmentIsLoading = action.payload;
    },
    setUploadAmendmentAttachmentIsSuccess: (state, action) => {
      state.uploadAmendmentAttachmentIsSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessesThunk.pending, (state) => {
      state.businessesIsFetching = true;
    });
    builder.addCase(fetchBusinessesThunk.fulfilled, (state, action) => {
      state.businessesIsFetching = false;
      state.businessesList = (
        action.payload as unknown as {
          data: Business[];
        }
      )?.data;
      state.totalElements = (
        action.payload as unknown as {
          totalElements: number;
        }
      )?.totalElements;
      state.totalPages = (
        action.payload as unknown as {
          totalPages: number;
        }
      )?.totalPages;
    });
    builder.addCase(fetchBusinessesThunk.rejected, (state) => {
      state.businessesIsFetching = false;
    });
    builder.addCase(uploadAmendmentAttachmentThunk.pending, (state) => {
      state.uploadAmendmentAttachmentIsLoading = true;
    })
    builder.addCase(uploadAmendmentAttachmentThunk.fulfilled, (state) => {
      state.uploadAmendmentAttachmentIsLoading = false;
      state.uploadAmendmentAttachmentIsSuccess = true;
    })
  },
});

export default businessSlice.reducer;

export const {
  setBusinessesList,
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
  setBusiness,
  setEmploymentInfo,
  setDeleteBusinessModal,
  setSelectedBusiness,
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
  setBusinessDetails,
  setBusinessAddress,
  setDeleteBusinessAttachmentModal,
  setBusinessAttachments,
  addBusinessAttachment,
  removeBusinessAttachment,
  setSelectedBusinessAttachment,
  addToBusinessesList,
  removeFromBusinessesList,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
} = businessSlice.actions;
