import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/Modal';
import {
  setEditInstitutionModal,
  setInstitutionsList,
} from '../../states/features/institutionSlice';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import Select from '../../components/inputs/Select';

const EditInstitution = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { editInstitutionModal, institution, institutionsList } = useSelector(
    (state: RootState) => state.institution
  );

  // UPDATE DEFAULT VALUES
  useEffect(() => {
    setValue('name', institution?.name);
    setValue('email', institution?.email);
    setValue('type', institution?.type?.toLowerCase()?.split(' ')?.join('_'));
  }, [setValue, institution]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: object) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setInstitutionsList(
          institutionsList.map((i) => {
            if (i?.id === institution?.id) {
              return {
                ...i,
                name: data?.name,
                email: data?.email,
                type: data?.type,
              };
            }
            return i;
          })
        )
      );
      dispatch(setEditInstitutionModal(false));
    }, 1000);
  };

  return (
    <Modal
      isOpen={editInstitutionModal}
      onClose={() => {
        dispatch(setEditInstitutionModal(false));
      }}
    >
      <h1 className="text-primary text-lg font-semibold uppercase text-center">
        Update {institution?.name || 'Institution'} details
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-[60%] mx-auto"
      >
        <Controller
          name="name"
          defaultValue={watch('name')}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-1 w-full">
                <Input
                  label="Name"
                  defaultValue={watch('name')}
                  placeholder="Institution name"
                  {...field}
                />
                {errors?.name && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.name.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="email"
          defaultValue={watch('email')}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-1 w-full">
                <Input
                  label="Email"
                  defaultValue={watch('email')}
                  placeholder="Institution email"
                  {...field}
                />
                {errors?.email && (
                  <p className="text-red-500 text-[12px]">
                    {String(errors?.name.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="type"
          control={control}
          rules={{ required: 'Select institution type' }}
          render={({ field }) => {
            const options = [
              { value: 'private_sector', label: 'Private Sector' },
              { value: 'government', label: 'Government' },
            ];
            return (
              <label className="flex flex-col items-start gap-1">
                <Select
                  defaultValue={options?.find((o) => o.value === watch('type'))}
                  label="Institution type"
                  onChange={(e) => {
                    console.log(e);
                    field.onChange(e?.value);
                  }}
                  options={options}
                />
                {errors?.type && (
                  <p className="text-red-600 text-[13px]">
                    {String(errors?.type?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <menu className="flex items-center gap-3 justify-between mt-3">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setEditInstitutionModal(false));
            }}
          />
          <Button value={isLoading ? <Loader /> : 'Save'} submit primary />
        </menu>
      </form>
    </Modal>
  );
};

export default EditInstitution;
