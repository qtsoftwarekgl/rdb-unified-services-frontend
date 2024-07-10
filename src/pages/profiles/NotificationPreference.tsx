import { Controller, useForm, FieldValues } from 'react-hook-form';
import Divider from '../../components/Divider';
import Button from '../../components/inputs/Button';
import Select from '@/components/inputs/Select';
import { notificationPreferenceOptions } from '@/constants/user.constants';
import { useUpdateNotificationPreferencesMutation } from '@/states/api/userManagementApiSlice';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from '@/components/Loader';

const NotificationPreference = () => {
  const { handleSubmit, control } = useForm();

  // INITIALIZE UPDATE NOTIFICATION PREFERENCE MUTATION
  const [
    updateNotificationPreference,
    {
      error: updateNotificationPreferenceError,
      isLoading: updateNotificationPreferenceIsLoading,
      isSuccess: updateNotificationPreferenceIsSuccess,
      isError: updateNotificationPreferenceIsError,
    },
  ] = useUpdateNotificationPreferencesMutation();

  // HANDLE UPDATE NOTIFICATION PREFERENCE RESPONSE
  useEffect(() => {
    if (updateNotificationPreferenceIsSuccess) {
      toast.success('Notification preference updated successfully');
    } else if (updateNotificationPreferenceIsError) {
      const errorResponse =
        (updateNotificationPreferenceError as ErrorResponse)?.data?.message ||
        'An error occurred while updating notification preference. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    updateNotificationPreferenceIsSuccess,
    updateNotificationPreferenceIsError,
    updateNotificationPreferenceError,
  ]);

  const onSubmit = (data: FieldValues) => {
    if (!data?.notificationPreference) {
      toast.info('Select notification preference option');
      return;
    }
    updateNotificationPreference({
      notificationPreference: data?.notificationPreference,
    });
  };

  return (
    <section>
      <Divider />
      <h3 className="mb-4 text-tertiary w-fit">
        Update Notification Preference
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-[50%]"
      >
        <Controller
          name="notificationPreference"
          control={control}
          render={({ field }) => {
            return (
              <Select
                options={notificationPreferenceOptions}
                label={'Select notification preference'}
                placeholder="Select notification preference"
                {...field}
              />
            );
          }}
        />
        <menu className="flex gap-6 items-center justify-end">
          <Button value="Cancel" route="/services" />
          <Button
            submit
            primary
            value={
              updateNotificationPreferenceIsLoading ? <Loader /> : 'Update'
            }
          />
        </menu>
      </form>
    </section>
  );
};

export default NotificationPreference;
