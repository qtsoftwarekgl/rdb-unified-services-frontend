import {
  faCertificate,
  faDatabase,
  faPerson,
  faPersonCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

// DASHBOARD CARDS
export const dashboardCards = [
  {
    title: 'Applicants',
    value: 100000,
    icon: faDatabase,
    change: '10',
    route: '/admin/users?role=applicant',
  },
  {
    title: 'Verifiers',
    value: 10,
    icon: faCertificate,
    change: -5,
    route: '/admin/users?role=verifier',
  },
  {
    title: 'Approvers',
    value: 1,
    icon: faPersonCircleCheck,
    change: 0,
    route: '/admin/users?role=approver',
  },
  {
    title: 'External Members',
    value: 1000,
    icon: faPerson,
    change: 0,
    route: '/admin/users?role=external_member',
  },
];

// RECENT ACTIVITIES
export const RecentActivities = [
  {
    title: 'Logged in',
    date: '2022-10-10, 10:00',
  },
  {
    title: 'Logged out',
    date: '2022-10-10, 10:00',
  },
  {
    title: 'Created a new user',
    date: '2022-10-10, 10:00',
  },
  {
    title: 'Deleted a user',
    date: '2022-10-10, 10:00',
  },
  {
    title: '1 user disabled',
    date: '2022-10-10, 10:00',
  },
  {
    title: '1 user disabled',
    date: '2022-10-10, 10:00',
  },
  {
    title: '1 user disabled',
    date: '2022-10-10, 10:00',
  },
  {
    title: '1 user disabled',
    date: '2022-10-10, 10:00',
  },
  {
    title: '1 user disabled',
    date: '2022-10-10, 10:00',
  },
];

export const monthsData = () => {
  return [
    {
      month: 'January',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'February',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'March',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'April',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    { month: 'May', value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100 },
    {
      month: 'June',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'July',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'August',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'September',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'October',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'November',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'December',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
  ];
};
