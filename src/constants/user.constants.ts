import { capitalizeString } from '@/helpers/strings';
import { User } from '@/types/models/user';
import { Row } from '@tanstack/react-table';

export const userColumns = [
  {
    header: 'First Name',
    accessorKey: 'firstName',
    id: 'firstName',
  },
  {
    header: 'Last Name',
    accessorKey: 'lastName',
    id: 'lastName',
  },
  {
    header: 'Username',
    accessorKey: 'username',
    id: 'username',
  },
  {
    header: 'Email',
    accessorKey: 'email',
    id: 'email',
  },
  {
    header: 'Phone number',
    accessorKey: 'phoneNumber',
    id: 'phoneNumber',
  },
  {
    header: 'Notification Preference',
    accessorKey: 'notificationPreference',
    id: 'notificationPreference',
    cell: ({ row }: { row: Row<User> }) =>
      capitalizeString(row?.original?.notificationPreference),
  },
  {
    header: 'Nationality',
    accessorKey: 'nationality',
    id: 'nationality',
  },
];

export const notificationPreferenceOptions = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'PUSH_NOTIFICATIONS', label: 'Push Notifications' },
  { value: 'IN_APP', label: 'In-App' },
  { value: 'NONE', label: 'None' },
  { value: 'ALL', label: 'All' },
];
