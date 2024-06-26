import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import Modal from "../../../components/Modal";
import {
  setNameReservation,
  setSelectReservedNameModal,
} from "../../../states/features/nameReservationSlice";
import { FC, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import Button from "../../../components/inputs/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { UnknownAction } from "@reduxjs/toolkit";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import moment from "moment";
import {
  business_registration_tabs_initial_state,
  setBusinessRegistrationTabs,
} from '../../../states/features/businessRegistrationSlice';

interface SelectReservedNameProps {
  path: string;
  application_type: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (string: string) => UnknownAction;
}

const SelectReservedName: FC<SelectReservedNameProps> = ({
  path,
  application_type,
  setActiveTab,
  setActiveStep,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectReservedNameModal } = useSelector(
    (state: RootState) => state.nameReservation
  );
  const { user_applications } = useSelector((state: RootState) => state.userApplication);
  const nameReservationRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const { handleSubmit, control, setValue, watch } = useForm();


  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(setActiveStep("company_details"));
      dispatch(setActiveTab("general_information"));
      dispatch(
        setUserApplications({
          entryId: path?.split("=")[1],
          company_details: {
            name: data?.name_reservation,
            name_reserved: true,
          },
          status: "IN_PROGRESS",
        })
      );
      dispatch(setSelectReservedNameModal(false));
      dispatch(
        setBusinessRegistrationTabs(business_registration_tabs_initial_state)
      );
      navigate(path);
    }, 1000);
  };

  
  return (
    <Modal
      isOpen={selectReservedNameModal}
      onClose={() => {
        dispatch(setSelectReservedNameModal(false));
      }}
    >
      <section className="flex flex-col w-full gap-4">
        <h1 className="font-medium uppercase">
          You have name reservations for {application_type}
        </h1>
        <form className="flex flex-col gap-3 z-[1000]" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name_reservation"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  placeholder="Select a name"
                  options={user_applications
                    ?.filter(
                      (app: { type: string; status: string }) =>
                        app.type === 'name_reservation' &&
                        app.status === 'approved'
                    )
                    ?.map((name: { name: string; createdAt: string }) => {
                      const expiry_date = moment(name?.createdAt)
                        .add(3, 'months')
                        .format('MM/DD/YYYY');
                      return {
                        label: `${name?.name} (Expires on ${expiry_date})`,
                        value: name?.name,
                      };
                    })}
                  {...field}
                />
              );
            }}
          />
          <menu className="flex flex-col gap-2">
            <Button
              value={isLoading ? <Loader /> : "Select name"}
              submit
              primary
              disabled={!watch("name_reservation")}
            />
            {isLoading ? null : !watch("name_reservation") ? (
              <Button
                value={
                  <menu className="flex items-center gap-2 text-[14px] justify-center hover:gap-3 transition-all duration-200">
                    Continue without name
                    <FontAwesomeIcon icon={faArrowRight} />
                  </menu>
                }
                styled={false}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setNameReservation(null));
                  dispatch(setActiveStep("company_details"));
                  dispatch(setActiveTab("general_information"));
                  dispatch(setSelectReservedNameModal(false));
                  setValue("name_reservation", "");
                  if (nameReservationRef.current) {
                    nameReservationRef.current.clearValue();
                  }
                  navigate(path);
                }}
              />
            ) : (
              <Button
                styled={false}
                value={
                  <menu className="flex items-center text-[14px] justify-center gap-2">
                    Clear name
                    <FontAwesomeIcon icon={faBan} />
                  </menu>
                }
                onClick={(e) => {
                  e.preventDefault();
                  setValue("name_reservation", "");
                  if (nameReservationRef.current) {
                    nameReservationRef.current.clearValue();
                  }
                }}
              />
            )}
          </menu>
        </form>
        <p
          className={
            watch("name_reservation") ? "text-[12.5px] text-center" : "hidden"
          }
        >
          When you select a reserved name, you will not be able to change it
          throughout the application process.
        </p>
      </section>
    </Modal>
  );
};

export default SelectReservedName;
