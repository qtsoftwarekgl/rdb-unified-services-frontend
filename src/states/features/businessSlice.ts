import {
  Address,
  Business,
  Details,
  EmploymentInfo,
} from "@/types/models/business";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  businessesList: Business[];
  business: Business;
  businessDetails: Details;
  businessAddress: Address;
  employmentInfo: EmploymentInfo;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  selectedBusiness: Business;
  deleteBusinessModal: boolean;
  nameAvailabilitiesList: {
    companyName: string;
    similarity: string | number;
  }[];
  similarBusinessNamesModal: boolean;
} = {
  businessesList: [],
  business: {} as Business,
  businessDetails: {} as Details,
  businessAddress: {} as Address,
  employmentInfo: {} as EmploymentInfo,
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedBusiness: {} as Business,
  deleteBusinessModal: false,
  nameAvailabilitiesList: [],
  similarBusinessNamesModal: false,
};

export const businessSlice = createSlice({
  name: "business",
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
  setBusinessDetails,
  setBusinessAddress,
  setEmploymentInfo,
  setDeleteBusinessModal,
  setSelectedBusiness,
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
} = businessSlice.actions;
