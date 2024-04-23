import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import { setAddInstitutionModal, updateInstitutionsList } from '../../states/features/institutionSlice';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import validateInputs from '../../helpers/validations';
import Select from '../../components/inputs/Select';
import { useState } from 'react';
import Loader from '../../components/Loader';

const AddInstitution = () => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { addInstitutionModal } = useSelector(
    (state: RootState) => state.institution
  );

  // HANDLE FORM SUBMIT
  const onSubmit = (data: object) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        updateInstitutionsList({
          ...data,
          created_at: new Date().toLocaleDateString(),
        })
      );
      dispatch(setAddInstitutionModal(false));
    }, 1000);
  };

  return (
    <Modal
      isOpen={addInstitutionModal}
      onClose={() => {
        dispatch(setAddInstitutionModal(false));
      }}
    >
      <h1 className="text-primary text-lg font-semibold uppercase text-center">
        Add new institution
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-[80%] mx-auto"
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => {
            return (
              <label className="flex flex-col items-start gap-1">
                <Input label="Name" {...field} placeholder="Institution name" />
                {errors?.name && (
                  <p className="text-red-600 text-[13px]">
                    {String(errors?.name?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            validate: (value) =>
              validateInputs(value, 'email') || 'Invalid email',
          }}
          render={({ field }) => {
            return (
              <label className="flex flex-col items-start gap-1">
                <Input
                  label="Email"
                  {...field}
                  placeholder="Institution email address"
                />
                {errors?.email && (
                  <p className="text-red-600 text-[13px]">
                    {String(errors?.email?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="phone"
          control={control}
          rules={{
            required: 'Phone number is required',
            validate: (value) => {
              return validateInputs(value, 'tel') || 'Invalid phone number';
            },
          }}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-1 w-full">
                <Input
                  label="Phone number"
                  placeholder="07XX XXX XXX"
                  required
                  {...field}
                />
                {errors?.phone && (
                  <p className="text-red-500 text-sm">
                    {String(errors?.phone?.message)}
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
            return (
              <label className="flex flex-col items-start gap-1">
                <Select
                  label="Institution type"
                  placeholder="Select institution type"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  options={[
                    { value: 'private_sector', label: 'Private Sector' },
                    { value: 'government', label: 'Government' },
                  ]}
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
              dispatch(setAddInstitutionModal(false));
            }}
          />
          <Button value={isLoading ? <Loader /> : 'Submit'} submit primary />
        </menu>
      </form>
    </Modal>
  );
};

export default AddInstitution;
