import { Controller, FieldValues, useForm } from 'react-hook-form';
import UserLayout from '../../containers/UserLayout';
import Select from '../../components/inputs/Select';
import { RootState } from '../../states/store';
import { useSelector } from 'react-redux';
import Input from '../../components/inputs/Input';
import { useEffect, useState } from 'react';
import validateInputs from '../../helpers/validations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import Table from '../../components/table/Table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { provicesList } from '../../constants/provinces';
import { districtsList } from '../../constants/districts';
import { sectorsList } from '../../constants/sectors';
import { cellsList } from '../../constants/cells';
import { villagesList } from '../../constants/villages';

const BusinessNewBranch = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File> | unknown | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // NAVIGATE
  const navigate = useNavigate();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/services');
    }, 1000);
    return data;
  };

  // SET BUSINESS ACTIVITIES
  useEffect(() => {
    if (watch('company')) {
      setValue(
        'company_activities',
        user_applications?.find(
          (business) => business?.entry_id === watch('company')
        )?.company_activities
      );
    }
  }, [watch('company')]);

  // TABLE COLUMNS
  const columns = [
    {
      header: 'File size',
      accessorKey: 'size',
    },
    {
      header: 'File name',
      accessorKey: 'name',
    },
    {
      header: 'File type',
      accessorKey: 'type',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                setAttachmentFiles((prevFiles) => {
                  return prevFiles?.filter(
                    (file: File) => file?.name !== row?.original?.name
                  );
                });
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4 bg-white p-6 rounded-md">
        <h1 className="text-center uppercase font-semibold text-lg">
          New company branch
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3 flex flex-col gap-4"
        >
          <Controller
            control={control}
            name="company"
            rules={{ required: 'Select company to open new branch' }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Select
                    label="Select company"
                    required
                    options={user_applications
                      ?.filter((app) => app?.status !== 'in_progress')
                      ?.map((business) => {
                        return {
                          ...business,
                          value: business?.entry_id,
                          label: `${business?.entry_id
                            ?.split('-')[0]
                            ?.toUpperCase()} - ${
                            business?.company_details?.name
                          }`,
                        };
                      })}
                      {...field}
                      placeholder='Select company'
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {errors?.company && (
                    <p className="text-red-500 text-[13px]">
                      {String(errors?.company?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu
            className={`${
              watch('company') ? 'flex' : 'hidden'
            } w-full flex flex-wrap gap-5`}
          >
            <Controller
              name="branch_name"
              control={control}
              rules={{ required: 'Branch name is required' }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      placeholder="Branch name"
                      label="Branch name"
                      required
                      {...field}
                    />
                    {errors?.branch_name && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.branch_name?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="province"
              control={control}
              rules={{ required: 'Select province of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      required
                      label="Province"
                      options={provicesList?.map((province) => {
                        return {
                          label: province.name,
                          value: province.code,
                        };
                      })}
                      {...field}
                      placeholder='Select province'
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.province && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.province.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="district"
              control={control}
              rules={{ required: 'Select district of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      required
                      label="District"
                      options={
                        watch('province') &&
                        districtsList
                          ?.filter(
                            (district) =>
                              district?.province_code === watch('province')
                          )
                          ?.map((district) => {
                            return {
                              label: district.name,
                              value: district.code,
                            };
                          })
                      }
                      {...field}
                      placeholder='Select district'
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.district && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.district.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="sector"
              control={control}
              rules={{ required: 'Select sector of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      required
                      label="Sector"
                      options={
                        watch('district') &&
                        sectorsList
                          ?.filter(
                            (sector) =>
                              sector?.district_code === watch('district')
                          )
                          ?.map((sector) => {
                            return {
                              label: sector.name,
                              value: sector.code,
                            };
                          })
                      }
                      {...field}
                      placeholder='Select sector'
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.sector && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.sector.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="cell"
              control={control}
              rules={{ required: 'Select cell of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      required
                      label="Cell"
                      options={
                        watch('sector') &&
                        cellsList
                          ?.filter(
                            (cell) => cell?.sector_code === watch('sector')
                          )
                          ?.map((cell) => {
                            return {
                              label: cell.name,
                              value: cell.code,
                            };
                          })
                      }
                      {...field}
                      placeholder='Select cell'
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.cell && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.cell.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="village"
              control={control}
              rules={{ required: 'Select village of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      required
                      label="Village"
                      options={
                        watch('cell') &&
                        villagesList
                          ?.filter(
                            (village) => village?.cell_code === watch('cell')
                          )
                          ?.map((village) => {
                            return {
                              label: village.name,
                              value: village.code,
                            };
                          })
                      }
                      {...field}
                      placeholder='Select village'
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.village && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.village.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="street_name"
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      label="Street Name"
                      placeholder="Street name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Phone number is required',
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    <Input
                      label="Phone number"
                      required
                      type="tel"
                      {...field}
                    />
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phone?.message)}
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
                required: 'Email address is required',
                validate: (value) => {
                  return (
                    validateInputs(String(value), 'email') ||
                    'Invalid email address'
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-[49%] gap-1">
                    <Input
                      required
                      label="Email"
                      placeholder="name@domain.com"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {String(errors?.email?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="fax"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    <Input label="Fax" {...field} />
                  </label>
                );
              }}
            />
            <Controller
              name="beneficial_owner"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    <Input label="BO NID/Passport/TIN (Optional)" {...field} />
                  </label>
                );
              }}
            />
            <Controller
              name="working_from"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    <Input type="time" label="Working hour from" {...field} />
                  </label>
                );
              }}
            />
            <Controller
              name="working_to"
              control={control}
              rules={{
                validate: (value) =>
                  value > watch('working_from') || 'Invalid working hours',
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    <Input type="time" label="Working hour to" {...field} />
                    {errors?.working_to && (
                      <p className="text-sm text-red-500">
                        {String(errors?.working_to?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <section
            className={`${
              watch('company_activities')?.business_lines?.length > 0 &&
              watch('company')
                ? 'flex'
                : 'hidden'
            } flex flex-col gap-4 w-full`}
          >
            <ul className="w-full flex items-center gap-3 justify-between">
              <h1 className="font-semibold text-md uppercase">
                Business activities
              </h1>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-primary text-[16px]"
              />
            </ul>
            <menu className="flex flex-col gap-2 bg-background p-2 rounded-md">
              {watch('company_activities')?.business_lines?.map(
                (activity, index) => {
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-[15px] p-2 hover:cursor-pointer hover:bg-gray-300  rounded-md hover:shadow-sm"
                    >
                      {activity?.name}
                    </li>
                  );
                }
              )}
            </menu>
          </section>
          <section
            className={`${
              watch('company') ? 'flex' : 'hidden'
            } w-full flex flex-col gap-3`}
          >
            <h1 className="text-md uppercase font-semibold flex items-center gap-1">
              Attachment <span className="text-red-600">*</span>
            </h1>
            <Controller
              control={control}
              name="attachments"
              rules={{ required: 'Attach at least one document' }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      type="file"
                      required
                      multiple
                      onChange={(e) => {
                        field.onChange(e?.target?.files);
                        setAttachmentFiles(
                          e.target.files &&
                            Array.from(e?.target?.files)?.map((file: File) => {
                              return {
                                name: file?.name,
                                size: file?.size,
                                type: file?.type,
                              };
                            })
                        );
                      }}
                    />
                    {errors?.attachments && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.attachments.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {attachmentFiles?.length > 0 && (
              <Table
                data={attachmentFiles || []}
                columns={columns}
                showFilter={false}
                showPagination={false}
              />
            )}
          </section>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                navigate('/services');
              }}
            />
            <Button value={isLoading ? <Loader /> : 'Submit'} primary submit />
          </menu>
        </form>
      </main>
    </UserLayout>
  );
};

export default BusinessNewBranch;
