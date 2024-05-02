import { Controller, FieldValues, useForm } from 'react-hook-form';
import { searchedCompanies } from '../../constants/businessRegistration';
import UserLayout from '../../containers/UserLayout';
import Input from '../../components/inputs/Input';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Loader from '../../components/Loader';
import moment from 'moment';
import Button from '../../components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validTinNumber } from '@/constants/authentication';

const SearchCompanyDetails = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    trigger
  } = useForm();

  // NAVIGATE
  const navigate = useNavigate();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState({
    search: false,
    submit: false,
    data: null,
  });

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading({ ...isLoading, submit: true });
    setTimeout(() => {
      setIsLoading({ ...isLoading, submit: false });
      toast.success('Company details requested successfully');
      setTimeout(() => {
        navigate('/services');
      }, 1000);
    }, 1000);
    return data;
  };

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-5 p-6 rounded-md bg-white">
        <h1 className="uppercase font-semibold text-lg text-center">
          Request company details
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <section className="w-[40%] mx-auto">
            <Controller
              name="tin"
              control={control}
              rules={{
                required: 'Company name is required',
                validate: (value) => {
                  return (
                    (value.length < 9 && 'TIN number must be 9 digits') ||
                    (value.length > 9 && 'TIN number cannot exceed 9 digits')
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <Input
                      label="TIN Number"
                      required
                      type="number"
                      suffixIcon={faSearch}
                      suffixIconPrimary
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        clearErrors('tin');
                        setIsLoading({ ...isLoading, search: true });
                        setTimeout(() => {
                          setIsLoading({ ...isLoading, search: false });
                          const randomNumber = Math.floor(Math.random() * 10);
                          const companyDetails =
                            searchedCompanies[randomNumber];

                          if (field.value !== String(validTinNumber)) {
                            setError('tin', {
                              type: 'manual',
                              message: `Company not found`,
                            });
                            setIsLoading({ ...isLoading, data: null });
                          } else {
                            clearErrors('tin');
                            setIsLoading({
                              ...isLoading,
                              data: companyDetails,
                            });
                          }
                        }, 1000);
                      }}
                      placeholder="Enter company TIN number"
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger('tin');
                      }}
                    />
                    {isLoading.search && (
                      <p className="text-primary text-[13px] flex items-center gap-1">
                        <Loader size={4} /> Searching...
                      </p>
                    )}
                    {errors?.tin && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.tin.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </section>
          <section
            className={`${
              isLoading?.data &&
              !Object.keys(errors).length &&
              !isLoading?.search
                ? 'flex'
                : 'hidden'
            } flex-col gap-5`}
          >
            <section className="flex flex-col gap-4 w-[40%] mx-auto mt-5">
              <h1 className="uppercase font-semibold text-lg text-primary">
                Company Details
              </h1>
              <section className="flex flex-col gap-4">
                <p>
                  <span className="font-semibold">Company Name:</span>{' '}
                  {isLoading?.data?.company_name}
                </p>
                <p>
                  <span className="font-semibold">Company TIN:</span>{' '}
                  {isLoading?.data?.tin || watch('tin')}
                </p>
                <p>
                  <span className="font-semibold">Company Type:</span>{' '}
                  {isLoading?.data?.company_type}
                </p>
                <p>
                  <span className="font-semibold">Incorporation date:</span>{' '}
                  {moment().subtract(1, 'years').format('MMMM Do YYYY')}
                </p>
              </section>
            </section>
            <menu className="w-[40%] mx-auto flex flex-col items-center gap-3 justify-between mt-6">
              <Button
                value={isLoading?.submit ? <Loader /> : 'Request full info'}
                primary
                submit
                className="!w-full"
              />
              <Button
                styled={false}
                route="/services"
                value={
                  <menu className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </menu>
                }
              />
            </menu>
          </section>
        </form>
      </main>
    </UserLayout>
  );
};

export default SearchCompanyDetails;
