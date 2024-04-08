import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Loader from "../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/inputs/Button";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setNameReservation,
  setNameReservationActiveStep,
  setNameReservationActiveTab,
  setNameReservationOwnerDetails,
  setReservedNames,
} from "../../states/features/nameReservationSlice";
import { generateUUID } from "../../helpers/strings";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import moment from "moment";

type Props = {
  isOpen: boolean;
};

const NameReservationSearch = ({ isOpen }: Props) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm();

  const { name_reservation } = useSelector(
    (state: RootState) => state.nameReservation
  );

  // NAVIGATE
  const navigate = useNavigate();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    search: false,
    submit: false,
    success: false,
  });

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    const entry_id = generateUUID();
    setIsLoading({
      search: false,
      submit: true,
      success: false,
    });
    setTimeout(() => {
      setIsLoading({
        search: false,
        submit: false,
        success: false,
      });
      dispatch(setNameReservationOwnerDetails(null));
      dispatch(setNameReservation(null));
      dispatch(
        setUserApplications({
          entry_id,
          type: 'name_reservation',
          status: 'submitted',
          registration_number: `REG-${Math.floor(Math.random() * 100000) + 1}`,
          created_at: moment().format(),
          name: data.name,
          path: `/name-reservation?entry_id=${entry_id}`,
          active_tab: 'name_reservation',
          active_step: 'name_reservation',
        })
      );
      dispatch(
        setReservedNames({
          name: data.name,
          status: 'Approved',
          created_at: Date.now(),
          id: entry_id,
          registration_number: `REG-${Math.floor(Math.random() * 100000) + 1}`,
        })
      );
      dispatch(setNameReservationActiveStep('owner_details'));
      dispatch(setNameReservationActiveTab('owner_details'));
      navigate('/services');
    }, 1000);
    return data;
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[40%] mx-auto flex flex-col gap-5"
      >
        <Controller
          name="name"
          control={control}
          defaultValue={watch('name') || name_reservation}
          rules={{ required: 'Company name is required' }}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-3">
                <Input
                  label={`${
                    name_reservation ? '' : 'Enter'
                  } the company name to reserve`}
                  suffixIcon={!name_reservation ? faSearch : undefined}
                  defaultValue={watch('name') || name_reservation}
                  readOnly={name_reservation ? true : false}
                  suffixIconPrimary
                  suffixIconHandler={(e) => {
                    e.preventDefault();
                    if (field.value?.length < 3) {
                      setError('name', {
                        type: 'manual',
                        message: 'Company name must be at least 3 characters',
                      });
                      return;
                    }
                    if (!field?.value) {
                      setError('name', {
                        type: 'manual',
                        message: 'Company name is required',
                      });
                      return;
                    } else {
                      clearErrors('name');
                      setIsLoading({
                        submit: false,
                        search: true,
                        success: false,
                      });
                      setTimeout(() => {
                        if (field?.value.trim().toLowerCase() !== 'xyz') {
                          setError('name', {
                            type: 'manual',
                            message: `${watch(
                              'name'
                            )} is not available. Try another name`,
                          });
                          setIsLoading({
                            submit: false,
                            search: false,
                            success: false,
                          });
                        } else {
                          clearErrors('name');

                          setIsLoading({
                            submit: false,
                            search: false,
                            success: true,
                          });
                        }
                      }, 1000);
                    }
                  }}
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors('name');
                    setError('name', {
                      type: 'manual',
                      message:
                        'Check if company name is available before submitting',
                    });
                    setIsLoading({
                      submit: false,
                      search: false,
                      success: false,
                    });
                  }}
                />
                {isLoading?.search && (
                  <p className="flex text-[13px] items-center gap-1">
                    <Loader size={4} /> Looking for name availability
                  </p>
                )}
                {isLoading?.success && (
                  <p className="flex text-[13px] items-center gap-2 text-green-600">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-700"
                    />
                    {watch('name')} is available
                  </p>
                )}
                {errors?.name && (
                  <p className="text-[12px] text-red-500">
                    {String(errors?.name?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setNameReservationActiveStep('owner_details'));
              dispatch(setNameReservationActiveTab('owner_details'));
            }}
          />
          <Button
            value={isLoading?.submit ? <Loader /> : 'Submit'}
            primary
            submit
            disabled={Object.keys(errors)?.length > 0}
          />
        </menu>
      </form>
    </section>
  );
};

export default NameReservationSearch;
