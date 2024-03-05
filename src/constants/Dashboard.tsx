import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faCertificate,
  faDatabase,
  faPerson,
  faPersonCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/inputs/Button';

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
export const recentActivities = [
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

export const roles = [
  {
    id: '819f11b7-ef5d-447b-930b-117b09868c95',
    name: 'Supervisor',
    description: 'Handles customer support inquiries',
    user_name: 'Elonore MacSkeagan',
    created_at: '2024-02-23T01:18:47Z',
    updated_at: '2023-08-11T05:17:15Z',
  },
  {
    id: '7a6a838e-10f3-49e0-af7e-4da90b8c8486',
    name: 'Supervisor',
    description: 'Generates reports for management',
    user_name: 'Minne Suett',
    created_at: '2023-09-02T11:07:09Z',
    updated_at: '2023-09-08T12:51:52Z',
  },
  {
    id: 'd50f7a94-35e5-48ce-9328-06c84ef41be6',
    name: 'Construction Expeditor',
    description: 'Analyzes system performance data',
    user_name: 'Base Vaillant',
    created_at: '2023-03-19T08:53:05Z',
    updated_at: '2023-06-23T06:26:39Z',
  },
  {
    id: '551177c4-7433-4579-83be-263995749150',
    name: 'Architect',
    description: 'Manages user accounts and permissions',
    user_name: 'Netty Bettridge',
    created_at: '2023-06-08T03:58:51Z',
    updated_at: '2023-04-08T12:07:16Z',
  },
  {
    id: '0750a09c-b246-4d51-b2cd-eabfd6710068',
    name: 'Construction Manager',
    description: 'Analyzes system performance data',
    user_name: 'Lavinia Bartoszewski',
    created_at: '2023-07-02T21:12:48Z',
    updated_at: '2023-10-13T19:20:51Z',
  },
  {
    id: '4b67edf7-19bd-4904-bce3-69b205fbc000',
    name: 'Construction Manager',
    description: 'Handles customer support inquiries',
    user_name: 'Laurence Teaser',
    created_at: '2023-11-19T01:36:26Z',
    updated_at: '2023-06-24T13:58:15Z',
  },
  {
    id: 'd5067d89-0d3d-4891-bc59-190e1bc122fa',
    name: 'Supervisor',
    description: 'Generates reports for management',
    user_name: 'Kerr Offen',
    created_at: '2024-01-08T23:14:34Z',
    updated_at: '2023-09-17T22:38:31Z',
  },
  {
    id: '5c0c5384-88ae-439a-ba23-c14533fcee76',
    name: 'Engineer',
    description: 'Generates reports for management',
    user_name: 'Naoma Edyson',
    created_at: '2023-10-16T21:54:45Z',
    updated_at: '2023-05-02T00:19:59Z',
  },
  {
    id: '4d546683-3d19-4a00-bb77-156b6c0f518c',
    name: 'Electrician',
    description: 'Handles customer support inquiries',
    user_name: 'Maynard Heephy',
    created_at: '2023-07-21T06:51:11Z',
    updated_at: '2023-04-07T21:41:46Z',
  },
  {
    id: '41671f85-4c65-4c8d-b385-fb8fec13ebd0',
    name: 'Supervisor',
    description: 'Manages user accounts and permissions',
    user_name: 'Dael Irvin',
    created_at: '2023-06-03T02:45:49Z',
    updated_at: '2023-05-12T03:13:54Z',
  },
  {
    id: '191607dc-7b66-43cf-a2d9-153c76536297',
    name: 'Construction Manager',
    description: 'Generates reports for management',
    user_name: 'Oswald Yuryev',
    created_at: '2023-12-24T06:11:42Z',
    updated_at: '2023-12-12T14:26:01Z',
  },
  {
    id: '91e771d0-79db-43f8-a6c5-8a3d64c0fcd5',
    name: 'Construction Worker',
    description: 'Analyzes system performance data',
    user_name: 'Rhett Billing',
    created_at: '2023-03-14T17:47:36Z',
    updated_at: '2023-04-22T04:06:21Z',
  },
  {
    id: '9f017bd2-efdf-43c9-9bb3-6588602e87a4',
    name: 'Construction Manager',
    description: 'Manages user accounts and permissions',
    user_name: 'Lindsey Packham',
    created_at: '2023-08-28T14:16:22Z',
    updated_at: '2023-07-20T07:56:00Z',
  },
  {
    id: '4cc4e1a3-ecaf-43bb-b167-04231adfd996',
    name: 'Supervisor',
    description: 'Analyzes system performance data',
    user_name: 'Jarret Ogglebie',
    created_at: '2023-07-10T02:58:37Z',
    updated_at: '2023-10-16T17:31:09Z',
  },
  {
    id: '63252649-210f-4a01-b65e-94703ae5bb74',
    name: 'Project Manager',
    description: 'Analyzes system performance data',
    user_name: 'Jae Fears',
    created_at: '2023-04-27T03:39:54Z',
    updated_at: '2023-05-31T09:37:43Z',
  },
  {
    id: '9db970c0-932a-4542-a846-743adcf833d7',
    name: 'Construction Foreman',
    description: 'Manages user accounts and permissions',
    user_name: 'Cacilie Charter',
    created_at: '2023-03-13T03:11:33Z',
    updated_at: '2023-08-07T00:25:46Z',
  },
  {
    id: '8ca03073-50bb-4e76-b6b3-8f8f27d038f0',
    name: 'Engineer',
    description: 'Manages user accounts and permissions',
    user_name: 'Conchita Bowlas',
    created_at: '2023-11-24T17:10:58Z',
    updated_at: '2023-03-20T23:07:23Z',
  },
  {
    id: 'e0279d9d-35c0-4317-8ba9-128b7d19bed5',
    name: 'Engineer',
    description: 'Generates reports for management',
    user_name: 'Gherardo Bawles',
    created_at: '2023-12-03T08:50:24Z',
    updated_at: '2023-10-17T17:55:53Z',
  },
  {
    id: 'f93f9db6-6cc7-4de5-b056-64bcd3f1ec13',
    name: 'Subcontractor',
    description: 'Analyzes system performance data',
    user_name: 'Mellie Doody',
    created_at: '2024-02-03T00:02:15Z',
    updated_at: '2023-03-22T03:42:59Z',
  },
  {
    id: '63125dfa-5ddb-4fb9-88bc-728bfb3e5d13',
    name: 'Engineer',
    description: 'Analyzes system performance data',
    user_name: 'Bastian Eathorne',
    created_at: '2023-04-17T21:42:23Z',
    updated_at: '2024-02-07T14:46:27Z',
  },
  {
    id: 'fe7fefed-e5a4-4643-b784-39d4e2af942a',
    name: 'Construction Expeditor',
    description: 'Analyzes system performance data',
    user_name: 'Sammie Proudlock',
    created_at: '2023-08-05T03:17:38Z',
    updated_at: '2023-08-07T01:36:44Z',
  },
  {
    id: '384b7111-adac-484e-afb9-bddac469c5e0',
    name: 'Supervisor',
    description: 'Generates reports for management',
    user_name: 'Sergei Heak',
    created_at: '2023-04-26T13:04:05Z',
    updated_at: '2023-06-10T01:48:10Z',
  },
  {
    id: '0b7f4af6-5c3a-4460-81c9-b6795d89a8af',
    name: 'Architect',
    description: 'Manages user accounts and permissions',
    user_name: 'Siouxie Barnby',
    created_at: '2023-06-09T14:19:02Z',
    updated_at: '2023-03-11T20:36:06Z',
  },
  {
    id: 'fe41ff25-737a-459f-a490-5592cd93cf80',
    name: 'Surveyor',
    description: 'Generates reports for management',
    user_name: 'Darnall Penrith',
    created_at: '2023-08-13T21:50:00Z',
    updated_at: '2024-01-17T22:54:12Z',
  },
  {
    id: '1c691ff7-c7e0-4078-89fc-6b5bee623dba',
    name: 'Supervisor',
    description: 'Analyzes system performance data',
    user_name: 'Bordy Dennison',
    created_at: '2023-04-04T04:23:55Z',
    updated_at: '2023-10-14T01:43:37Z',
  },
  {
    id: 'e48797de-9635-492f-8898-0c0f72c0a2a5',
    name: 'Construction Manager',
    description: 'Manages user accounts and permissions',
    user_name: 'Clifford Sauven',
    created_at: '2024-01-26T15:47:03Z',
    updated_at: '2023-11-06T18:29:26Z',
  },
  {
    id: 'd56fd9b2-097b-4583-ad38-088033063e20',
    name: 'Project Manager',
    description: 'Manages user accounts and permissions',
    user_name: 'Tore MacGruer',
    created_at: '2023-08-14T19:57:00Z',
    updated_at: '2023-09-24T08:48:24Z',
  },
  {
    id: '23e830a6-acf3-4616-bbd2-86d626df55ba',
    name: 'Architect',
    description: 'Manages user accounts and permissions',
    user_name: 'Gaultiero Vallow',
    created_at: '2023-08-07T03:37:24Z',
    updated_at: '2023-06-21T13:13:15Z',
  },
  {
    id: 'a280f97f-0785-459d-bd53-8188b469ec7e',
    name: 'Estimator',
    description: 'Manages user accounts and permissions',
    user_name: 'Basilius Ifill',
    created_at: '2023-06-11T20:48:57Z',
    updated_at: '2024-02-29T01:51:36Z',
  },
  {
    id: '3080a348-516c-4fb6-899e-f4468411b1b2',
    name: 'Construction Manager',
    description: 'Analyzes system performance data',
    user_name: 'Gina Waything',
    created_at: '2023-04-04T20:21:26Z',
    updated_at: '2023-05-31T08:41:16Z',
  },
  {
    id: '65294c6b-8e77-49c8-86f0-661a61b7436a',
    name: 'Construction Expeditor',
    description: 'Manages user accounts and permissions',
    user_name: 'Agneta Stitt',
    created_at: '2023-06-04T06:09:49Z',
    updated_at: '2023-08-09T12:28:55Z',
  },
  {
    id: 'a86a1615-d244-49d0-b85c-15e2d379f2d0',
    name: 'Electrician',
    description: 'Manages user accounts and permissions',
    user_name: 'Raine Lescop',
    created_at: '2023-10-24T22:52:58Z',
    updated_at: '2023-03-14T01:28:00Z',
  },
  {
    id: '46ad6e00-e80f-475e-83a8-c085dcc283af',
    name: 'Construction Expeditor',
    description: 'Manages user accounts and permissions',
    user_name: 'Ardra Stagge',
    created_at: '2023-10-19T13:57:02Z',
    updated_at: '2024-02-04T17:43:20Z',
  },
  {
    id: 'd8b67e3c-e2d3-4e81-840a-836e0cc21985',
    name: 'Supervisor',
    description: 'Analyzes system performance data',
    user_name: 'Binni Higgoe',
    created_at: '2023-04-22T08:45:49Z',
    updated_at: '2023-03-17T19:18:35Z',
  },
  {
    id: 'd916f7b5-cc4c-44ab-a026-8ee84eacf293',
    name: 'Project Manager',
    description: 'Manages user accounts and permissions',
    user_name: 'Lian Dugan',
    created_at: '2023-08-10T09:02:15Z',
    updated_at: '2023-09-05T19:13:16Z',
  },
  {
    id: '748bddc9-a68d-4427-8d0e-5edd486e575f',
    name: 'Construction Manager',
    description: 'Generates reports for management',
    user_name: 'Missy Lodevick',
    created_at: '2023-09-28T07:31:12Z',
    updated_at: '2023-06-05T00:18:13Z',
  },
  {
    id: '9a1716cf-5796-48f9-bab0-5ad8898b0647',
    name: 'Project Manager',
    description: 'Analyzes system performance data',
    user_name: 'Sigvard Batcheldor',
    created_at: '2023-05-16T02:24:23Z',
    updated_at: '2023-12-28T07:04:52Z',
  },
  {
    id: 'cb834e4d-df98-44b5-9867-323003f391f1',
    name: 'Construction Worker',
    description: 'Analyzes system performance data',
    user_name: 'Marni Sharpley',
    created_at: '2023-10-11T07:22:15Z',
    updated_at: '2023-07-27T12:09:18Z',
  },
  {
    id: '6c81b25f-1b49-48d3-9aca-4abcfb187cc3',
    name: 'Engineer',
    description: 'Generates reports for management',
    user_name: 'Eloise Duguid',
    created_at: '2023-03-21T13:05:04Z',
    updated_at: '2023-07-31T19:18:26Z',
  },
  {
    id: 'a25d1333-051b-43de-b365-f438ebdcd4c1',
    name: 'Construction Expeditor',
    description: 'Generates reports for management',
    user_name: 'Susette Dredge',
    created_at: '2023-10-26T18:47:30Z',
    updated_at: '2024-01-04T15:00:38Z',
  },
  {
    id: '43607971-beae-462d-9c77-a5299af707fc',
    name: 'Construction Foreman',
    description: 'Analyzes system performance data',
    user_name: 'Fair Simmank',
    created_at: '2023-05-14T16:57:57Z',
    updated_at: '2023-09-24T15:38:21Z',
  },
  {
    id: '657e2f0b-adef-49b1-be67-8f6b466a9c6e',
    name: 'Surveyor',
    description: 'Generates reports for management',
    user_name: 'Sebastien MacFarland',
    created_at: '2024-01-25T01:36:23Z',
    updated_at: '2023-12-14T19:36:54Z',
  },
  {
    id: '799d0b81-8ca4-42af-a546-84d7da13cfcc',
    name: 'Supervisor',
    description: 'Manages user accounts and permissions',
    user_name: 'Langsdon Large',
    created_at: '2023-09-03T08:56:47Z',
    updated_at: '2023-07-29T06:34:45Z',
  },
  {
    id: '1368dd6c-aae7-430b-a610-e0727e7b0ba9',
    name: 'Supervisor',
    description: 'Analyzes system performance data',
    user_name: 'Loutitia Gleeton',
    created_at: '2023-03-06T22:02:27Z',
    updated_at: '2024-01-03T16:05:02Z',
  },
  {
    id: 'f488aef5-91cc-4804-8b4f-2514fde9fc69',
    name: 'Construction Manager',
    description: 'Generates reports for management',
    user_name: 'Idette Gibbetts',
    created_at: '2023-05-13T10:25:27Z',
    updated_at: '2023-04-20T13:11:01Z',
  },
  {
    id: '950ff040-d0b1-49ef-a77e-5f0fb7c14a44',
    name: 'Engineer',
    description: 'Handles customer support inquiries',
    user_name: 'Catha Ginty',
    created_at: '2024-01-18T17:55:44Z',
    updated_at: '2023-11-22T07:25:34Z',
  },
  {
    id: '9a4ba0ec-97c6-419f-9d73-82e822342791',
    name: 'Construction Worker',
    description: 'Manages user accounts and permissions',
    user_name: 'Jeniece Cownden',
    created_at: '2023-04-27T14:17:30Z',
    updated_at: '2023-05-29T12:11:02Z',
  },
  {
    id: 'e6845bb6-0998-4101-9f93-e432fc96919c',
    name: 'Construction Manager',
    description: 'Manages user accounts and permissions',
    user_name: 'Andeee Carrack',
    created_at: '2023-06-21T16:55:41Z',
    updated_at: '2023-08-30T15:59:31Z',
  },
  {
    id: '2247174f-0f15-4a31-be93-95c94badee1e',
    name: 'Architect',
    description: 'Analyzes system performance data',
    user_name: 'Maude Benge',
    created_at: '2023-05-27T22:57:13Z',
    updated_at: '2023-08-30T13:20:48Z',
  },
  {
    id: '6c2177b0-6b6a-461e-ba12-c28b977b0494',
    name: 'Construction Manager',
    description: 'Handles customer support inquiries',
    user_name: 'Maryrose Fritschmann',
    created_at: '2023-05-01T09:27:58Z',
    updated_at: '2023-04-28T20:30:36Z',
  },
];

export const permissions = [
  {
    id: '696e6430-d242-4478-99dc-22613305f29d',
    name: 'C+_f+',
    description: 'Analyzes system performance data',
    user_name: 'Yolanda Bridger',
    created_at: '2024-02-17T00:35:34Z',
    updated_at: '2023-09-06T21:53:02Z',
  },
  {
    id: '82ba4ba0-1629-4953-abaf-17ccbc2ebe57',
    name: 'M+_n+_Y+',
    description: 'Handles customer support inquiries',
    user_name: 'Jackqueline Lidgey',
    created_at: '2023-05-25T07:39:56Z',
    updated_at: '2023-11-08T03:57:37Z',
  },
  {
    id: '8377d7fa-716f-4534-a64a-98c952ebf295',
    name: 'P+_q+_P+',
    description: 'Analyzes system performance data',
    user_name: 'Agosto Meecher',
    created_at: '2023-08-26T07:08:28Z',
    updated_at: '2024-01-28T18:18:35Z',
  },
  {
    id: '9f860a8a-ab05-4eef-bf36-0b0216a77e9f',
    name: 'G+_r+_o+',
    description: 'Analyzes system performance data',
    user_name: 'Zacharia Worviell',
    created_at: '2023-06-03T05:36:07Z',
    updated_at: '2023-05-08T08:38:42Z',
  },
  {
    id: 'c7a9516f-39e3-43b5-8ad9-a8fc5e6ef518',
    name: 'I+_C+_x+',
    description: 'Handles customer support inquiries',
    user_name: 'Adi Geeve',
    created_at: '2023-11-10T07:18:10Z',
    updated_at: '2023-12-01T02:05:33Z',
  },
  {
    id: '7c1e54fc-43a4-41b6-ac18-4d3ab1eeb18e',
    name: 'm+_o+_U+',
    description: 'Analyzes system performance data',
    user_name: 'Zorina Ralston',
    created_at: '2024-02-08T14:11:11Z',
    updated_at: '2024-01-11T05:14:19Z',
  },
  {
    id: 'c4bf6519-80f1-4beb-aae8-eb04b798a4a3',
    name: 'c+_d+_e+',
    description: 'Manages user accounts and permissions',
    user_name: 'Reagan Challoner',
    created_at: '2024-02-27T22:33:26Z',
    updated_at: '2023-11-12T20:56:03Z',
  },
  {
    id: '0f903ff3-d8d7-4bc3-a584-b702411c1294',
    name: 'f+_Z+_H+',
    description: 'Analyzes system performance data',
    user_name: 'Jeno Shemwell',
    created_at: '2023-03-04T11:00:01Z',
    updated_at: '2023-09-18T17:28:45Z',
  },
  {
    id: '1e6cd67a-b212-488b-8554-5eb92345fe17',
    name: 'p+_d+',
    description: 'Manages user accounts and permissions',
    user_name: 'Carl Spreadbury',
    created_at: '2023-05-19T00:16:50Z',
    updated_at: '2023-03-18T20:08:17Z',
  },
  {
    id: '8cebf5e8-3402-4bc3-ab8b-0447fa4b3eeb',
    name: 'Q+_F+',
    description: 'Generates reports for management',
    user_name: 'Jefferson Jarley',
    created_at: '2023-06-27T03:21:53Z',
    updated_at: '2023-05-08T23:15:43Z',
  },
  {
    id: '1a3daa8a-1d46-49a2-9e74-ae3b32c2241d',
    name: 'D+_s+_T+',
    description: 'Analyzes system performance data',
    user_name: "Nesta O'Crigane",
    created_at: '2023-12-17T18:17:58Z',
    updated_at: '2023-04-24T21:57:42Z',
  },
  {
    id: 'ed31cd07-a88d-4535-af5d-7b42956c19d7',
    name: 'o+_U+',
    description: 'Generates reports for management',
    user_name: 'Halley Grigoryev',
    created_at: '2023-10-09T04:21:57Z',
    updated_at: '2023-06-04T21:30:08Z',
  },
  {
    id: 'fcff930e-7135-4154-af4c-ac50fcee0476',
    name: 'Q+_m+',
    description: 'Analyzes system performance data',
    user_name: 'Kalil Alfonzo',
    created_at: '2023-08-26T01:03:54Z',
    updated_at: '2023-07-04T18:23:40Z',
  },
  {
    id: '4d6a50bc-f571-4c26-b590-cda438fbf250',
    name: 'K+_W+',
    description: 'Generates reports for management',
    user_name: 'Hollis Mabb',
    created_at: '2023-11-07T09:15:25Z',
    updated_at: '2023-07-12T11:58:54Z',
  },
  {
    id: '2d1d73e0-bbca-4b5d-814e-96b4d5d29cca',
    name: 'B+_P+',
    description: 'Analyzes system performance data',
    user_name: 'Christan Megson',
    created_at: '2023-12-20T08:32:47Z',
    updated_at: '2023-08-18T00:34:44Z',
  },
  {
    id: '57a1282c-895c-420d-8a9e-535f598daf68',
    name: 'O+_K+',
    description: 'Manages user accounts and permissions',
    user_name: 'Inglebert Cattlemull',
    created_at: '2023-06-10T08:06:55Z',
    updated_at: '2023-11-26T06:19:16Z',
  },
  {
    id: 'd2522f23-7d9d-448c-91d9-db119291da7d',
    name: 'o+_z+',
    description: 'Generates reports for management',
    user_name: 'Katinka Dignan',
    created_at: '2023-03-20T16:06:02Z',
    updated_at: '2024-01-10T04:32:39Z',
  },
  {
    id: 'cc5e7bb2-c067-4044-824a-7e203e8c08a7',
    name: 'V+_s+_h+',
    description: 'Handles customer support inquiries',
    user_name: 'Marja Buckoke',
    created_at: '2023-09-19T09:42:40Z',
    updated_at: '2024-02-27T10:35:52Z',
  },
  {
    id: 'b7357937-b98f-4256-af7e-8f7e0bc9c149',
    name: 's+_Q+',
    description: 'Manages user accounts and permissions',
    user_name: 'Morlee Tweedell',
    created_at: '2024-01-14T09:17:14Z',
    updated_at: '2023-04-30T00:48:43Z',
  },
  {
    id: '8ddbd49a-aea9-4ea7-8e2d-5bfcc7af3c87',
    name: 'r+_m+_c+',
    description: 'Generates reports for management',
    user_name: 'Hymie Peach',
    created_at: '2023-11-11T04:17:58Z',
    updated_at: '2024-01-04T01:01:12Z',
  },
  {
    id: '8f9a2cad-8b36-45ac-a1a3-74fa3ae6187d',
    name: 's+_N+',
    description: 'Generates reports for management',
    user_name: 'Doralynn Deniseau',
    created_at: '2023-09-21T16:27:58Z',
    updated_at: '2023-10-03T06:13:43Z',
  },
  {
    id: 'c4dc4880-b57c-4b8d-a637-4ae1a598cbc7',
    name: 'J+_y+',
    description: 'Handles customer support inquiries',
    user_name: 'Leroy Pischoff',
    created_at: '2023-10-20T03:59:42Z',
    updated_at: '2023-10-03T13:09:22Z',
  },
  {
    id: '90ec8381-02f2-4e79-bba7-9fa3b0da5ca8',
    name: 'A+_M+',
    description: 'Manages user accounts and permissions',
    user_name: 'Terry Kits',
    created_at: '2023-12-26T14:38:00Z',
    updated_at: '2023-10-04T20:21:06Z',
  },
  {
    id: '2becd3cb-c1b7-491a-b742-afd3ae6a067b',
    name: 'm+_C+',
    description: 'Generates reports for management',
    user_name: 'Conny Labat',
    created_at: '2023-06-26T04:14:47Z',
    updated_at: '2023-03-07T09:10:13Z',
  },
  {
    id: '76a9f0b9-ed78-4c90-8ce8-7db99f1ce005',
    name: 'o+_l+_w+',
    description: 'Generates reports for management',
    user_name: 'Gualterio Holcroft',
    created_at: '2024-01-14T20:07:16Z',
    updated_at: '2024-02-28T19:08:32Z',
  },
  {
    id: '498b6705-b81c-4590-b30c-9827c3090262',
    name: 'B+_K+_W+',
    description: 'Analyzes system performance data',
    user_name: 'Andrew Borrow',
    created_at: '2023-11-25T15:46:28Z',
    updated_at: '2023-11-30T11:19:21Z',
  },
  {
    id: '74237a86-f354-4249-98fe-05a4f4917fa9',
    name: 'A+_t+_o+',
    description: 'Manages user accounts and permissions',
    user_name: 'Liz Gott',
    created_at: '2023-06-10T10:11:02Z',
    updated_at: '2024-01-20T02:01:35Z',
  },
  {
    id: 'c47d6427-3db4-42d2-beef-2a0a5f04b6e9',
    name: 'H+_H+',
    description: 'Analyzes system performance data',
    user_name: 'Caitrin Bigly',
    created_at: '2024-02-09T05:55:29Z',
    updated_at: '2023-05-16T14:37:14Z',
  },
  {
    id: 'e44ddc85-84c5-4587-88bf-663b99ea599c',
    name: 'Z+_w+_O+',
    description: 'Generates reports for management',
    user_name: 'Oby Hannen',
    created_at: '2023-06-17T06:51:15Z',
    updated_at: '2023-12-09T13:35:47Z',
  },
  {
    id: '887c907e-98c0-4a05-933c-0c7d8ecee950',
    name: 'B+_Q+',
    description: 'Handles customer support inquiries',
    user_name: 'Nanete Betonia',
    created_at: '2023-09-24T07:48:03Z',
    updated_at: '2024-02-05T10:47:06Z',
  },
  {
    id: 'b5eba04e-f08a-4ea9-9715-f202eb912c0d',
    name: 'q+_A+_c+',
    description: 'Analyzes system performance data',
    user_name: 'Gilly Rapin',
    created_at: '2023-07-14T20:49:47Z',
    updated_at: '2023-09-29T11:44:39Z',
  },
  {
    id: 'fb94f46b-1c65-4fd1-8f13-ffdcc31dd52d',
    name: 'l+_f+',
    description: 'Handles customer support inquiries',
    user_name: 'Sydelle Gladdor',
    created_at: '2023-03-30T10:24:22Z',
    updated_at: '2023-11-03T16:27:45Z',
  },
  {
    id: 'dcd6278b-5ccb-4e00-a80b-c1a3595004b2',
    name: 'G+_L+_G+',
    description: 'Generates reports for management',
    user_name: 'Jane Clayborn',
    created_at: '2023-06-22T11:19:31Z',
    updated_at: '2023-12-20T04:22:02Z',
  },
  {
    id: 'f790edc2-c574-4c55-87f9-3d3f61bf90c4',
    name: 'a+_T+',
    description: 'Handles customer support inquiries',
    user_name: 'Abbye Foster-Smith',
    created_at: '2023-06-19T07:30:10Z',
    updated_at: '2023-09-18T22:54:46Z',
  },
  {
    id: 'c896b2a8-91fb-4923-a8cd-3fe9c0bc4af4',
    name: 'W+_d+',
    description: 'Generates reports for management',
    user_name: 'Ferdinande Mead',
    created_at: '2023-10-11T06:31:15Z',
    updated_at: '2023-10-22T02:06:48Z',
  },
  {
    id: '8cc317c8-9352-40a2-97b4-38125a495c00',
    name: 'd+_f+',
    description: 'Analyzes system performance data',
    user_name: 'Cara Larkings',
    created_at: '2024-02-21T19:59:30Z',
    updated_at: '2023-12-12T01:18:13Z',
  },
  {
    id: '29a0592c-7077-43f6-acbe-68d90790af1b',
    name: 'j+_W+',
    description: 'Generates reports for management',
    user_name: 'Ivonne Chislett',
    created_at: '2023-07-15T03:07:04Z',
    updated_at: '2023-04-05T12:40:10Z',
  },
  {
    id: '7c72cec7-b46c-4e26-b63e-020115b683f9',
    name: 'n+_E+',
    description: 'Generates reports for management',
    user_name: 'Yard Eye',
    created_at: '2024-03-03T10:03:06Z',
    updated_at: '2023-07-08T18:13:57Z',
  },
  {
    id: 'eb311dbf-c89a-4eeb-8f15-a0fde5428474',
    name: 'V+_B+_s+',
    description: 'Manages user accounts and permissions',
    user_name: 'Viki Jasiak',
    created_at: '2023-05-04T16:00:39Z',
    updated_at: '2023-04-11T18:42:46Z',
  },
  {
    id: '299b44e0-a3ce-48cc-958e-92dce5a965d5',
    name: 'U+_P+',
    description: 'Manages user accounts and permissions',
    user_name: 'Bernelle Paydon',
    created_at: '2023-05-29T22:26:31Z',
    updated_at: '2023-06-08T01:06:51Z',
  },
  {
    id: 'ad767fd3-d48f-41cb-ae80-a496262f8d46',
    name: 'X+_F+_P+',
    description: 'Analyzes system performance data',
    user_name: 'Tyrus Killcross',
    created_at: '2023-05-21T19:11:22Z',
    updated_at: '2023-08-22T09:24:34Z',
  },
  {
    id: '3c169514-bd92-4257-ba34-1c99a927d7b1',
    name: 'L+_e+_N+',
    description: 'Generates reports for management',
    user_name: 'Ursola Cumbers',
    created_at: '2023-03-24T07:19:18Z',
    updated_at: '2024-03-03T01:52:55Z',
  },
  {
    id: 'a62c1a04-fa29-4aa8-aeb5-45a72a1e0cbd',
    name: 'Y+_z+_S+',
    description: 'Analyzes system performance data',
    user_name: "Dorise O'Neal",
    created_at: '2023-12-14T09:15:52Z',
    updated_at: '2023-06-19T07:01:04Z',
  },
  {
    id: '2ba79b87-6a09-421b-a63d-6fa11554a849',
    name: 'G+_O+',
    description: 'Manages user accounts and permissions',
    user_name: 'Brigham Fatscher',
    created_at: '2023-03-12T05:46:23Z',
    updated_at: '2023-03-30T20:56:51Z',
  },
  {
    id: 'cc197209-3ffc-4e52-bc7c-028c268353dc',
    name: 'n+_z+_q+',
    description: 'Handles customer support inquiries',
    user_name: 'Brinn Rotge',
    created_at: '2023-06-27T03:55:48Z',
    updated_at: '2023-12-05T15:30:49Z',
  },
  {
    id: 'e3ed328e-e678-4a82-a1ed-f37a6b38cc17',
    name: 'n+_F+',
    description: 'Handles customer support inquiries',
    user_name: 'Marion Magnus',
    created_at: '2023-03-26T01:34:09Z',
    updated_at: '2023-05-09T02:14:29Z',
  },
  {
    id: '02e0c294-d862-4b5b-a331-ecabe26bafcc',
    name: 'N+_a+',
    description: 'Handles customer support inquiries',
    user_name: 'Claude Enbury',
    created_at: '2023-07-30T21:46:06Z',
    updated_at: '2023-12-20T00:00:33Z',
  },
  {
    id: '449f02e9-9dff-4906-8f10-7e4ff40287d9',
    name: 'X+_K+',
    description: 'Analyzes system performance data',
    user_name: 'Keir Temblett',
    created_at: '2023-09-17T13:48:25Z',
    updated_at: '2023-07-14T01:22:08Z',
  },
  {
    id: '641b6ca4-429f-48b9-9dc8-48a8087f45f9',
    name: 'I+_r+',
    description: 'Manages user accounts and permissions',
    user_name: 'Athena Blanckley',
    created_at: '2024-01-31T16:10:17Z',
    updated_at: '2023-05-11T21:28:37Z',
  },
  {
    id: '1ded12c8-76f5-4f6b-80d2-b8ce7b85e8da',
    name: 'o+_c+',
    description: 'Generates reports for management',
    user_name: 'Britta Osbidston',
    created_at: '2023-04-18T19:06:29Z',
    updated_at: '2023-06-29T03:09:43Z',
  },
];
