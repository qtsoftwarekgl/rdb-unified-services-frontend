import {
  faCertificate,
  faDatabase,
  faPerson,
  faPersonCircleCheck,
  faPersonCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

export const backOfficeDashboardCards = [
  {
    title: "Applicantions",
    value: 5000,
    icon: faDatabase,
    route: "/admin/review-applications",
  },

  {
    title: "Pending Applications",
    value: 300,
    icon: faPersonCircleQuestion,
    route: "/admin/review-applications",
  },
  {
    title: "Foreign Accounts",
    value: 100,
    icon: faDatabase,
    route: "/admin/foreign-applicants",
  },
  {
    title: "Pending Foreign Accounts",
    value: 200,
    icon: faPersonCircleQuestion,
    route: "/admin/foreign-applicants",
  },
];

// DASHBOARD CARDS
export const adminDashboardCards = [
  {
    title: "Applicants",
    value: 100000,
    icon: faDatabase,
    change: "10",
    route: "/admin/users?role=applicant",
  },
  {
    title: "Verifiers",
    value: 10,
    icon: faCertificate,
    change: -5,
    route: "/admin/users?role=verifier",
  },
  {
    title: "Approvers",
    value: 1,
    icon: faPersonCircleCheck,
    change: 0,
    route: "/admin/users?role=approver",
  },
  {
    title: "External Members",
    value: 1000,
    icon: faPerson,
    change: 0,
    route: "/admin/users?role=external_member",
  },
];

export const superAdminDashboardCards = [
  {
    title: "Institutions",
    value: 100,
    icon: faDatabase,
    change: "10",
    route: "/super-admin/institutions",
  },
  {
    title: "Institution Admins",
    value: 10,
    icon: faCertificate,
    change: -5,
    route: "/super-admin/users?role=institution_admin",
  },
  {
    title: "Approvers",
    value: 1,
    icon: faPersonCircleCheck,
    change: 0,
    route: "/super-admin/users?role=approver",
  },
  {
    title: "External Members",
    value: 1000,
    icon: faPerson,
    change: 0,
    route: "/super-admin/users?role=external_member",
  },
];

export const backOfficeRecentAcitivities = [
{
  title: "Logged in",
  date: "2022-10-10, 10:00",
},
{
  title: "Logged out",
  date: "2022-10-10, 10:00",
},
{
  title: "Approved a new user",
  date: "2022-10-10, 10:00",
},
{
  title: "Rejected a user",
  date: "2022-10-10, 10:00",
},
{
  title: "Approved Domestic Business Registration",
  date: "2022-10-10, 10:00",
},
{
  title: "Approved Foreign Business Registration",
  date: "2022-10-10, 10:00",
},
{
  title: "Approved a new user",
  date: "2022-10-10, 10:00",
}
]

// RECENT ACTIVITIES
export const recentActivities = [
  {
    title: "Logged in",
    date: "2022-10-10, 10:00",
  },
  {
    title: "Logged out",
    date: "2022-10-10, 10:00",
  },
  {
    title: "Created a new user",
    date: "2022-10-10, 10:00",
  },
  {
    title: "Deleted a user",
    date: "2022-10-10, 10:00",
  },
  {
    title: "1 user disabled",
    date: "2022-10-10, 10:00",
  },
  {
    title: "1 user disabled",
    date: "2022-10-10, 10:00",
  },
  {
    title: "1 user disabled",
    date: "2022-10-10, 10:00",
  },
  {
    title: "1 user disabled",
    date: "2022-10-10, 10:00",
  },
  {
    title: "1 user disabled",
    date: "2022-10-10, 10:00",
  },
];

export const monthsData = () => {
  return [
    {
      month: "January",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "February",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "March",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "April",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    { month: "May", value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100 },
    {
      month: "June",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "July",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "August",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "September",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "October",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "November",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: "December",
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
  ];
};

export const companyDocuments = [
  {
    documentName: "Certificate of Incorporation",
    documentType: "Certificate",
    issuedDate: "12-06-2022",
    document_url: "/public/company_certificate.pdf",
  },
  {
    documentName: "Memorandum of Association",
    documentType: "Certificate",
    issuedDate: "12-06-2022",
    document_url: "/public/company_certificate.pdf",
  },
  {
    documentName: "Article of Association",
    documentType: "Certificate",
    issuedDate: "12-06-2022",
    document_url: "/public/company_certificate.pdf",
  },
  {
    documentName: "Form CAC 7",
    documentType: "Copy Right",
    issuedDate: "12-06-2022",
    document_url: "/public/BusinessCrt_202104051447207533.pdf",
  },
  {
    documentName: "Form CAC 2",
    documentType: "Copy Right",
    issuedDate: "12-06-2022",
    document_url: "/public/BusinessCrt_202104051447207533.pdf",
  },
  {
    documentName: "Form CAC 3",
    documentType: "Copy Right",
    issuedDate: "12-06-2022",
    document_url: "/public/BusinessCrt_202104051447207533.pdf",
  },
];

export const foreignApplications = [
  {
    first_name: "Smith",
    last_name: "Ethan",
    email: "smith@gmail.com",
    application_status: "approved",
    createdAt: "2/3/2024",
    country: "England",
    gender: "Male",
    address: "KG 230",
    city: "Manchester",
    phone: "0788888888",
    passport_number: "123456789",
    passport_expiry_date: "2/3/2025",
    date_of_birth: "2/3/1990",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Emma",
    last_name: "Johnson",
    email: "emma.johnson@example.com",
    application_status: "rejected",
    createdAt: "4/15/2023",
    country: "United Kingdom",
    gender: "Female",
    address: "17 Cherry Tree Lane",
    city: "London",
    phone: "0788888888",
    passport_expiry_date: "4/15/2024",
    passport_number: "123456789",
    date_of_birth: "4/15/1990",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@example.com",
    application_status: "submitted",
    createdAt: "1/9/2024",
    country: "England",
    gender: "Male",
    address: "45 Oak Street",
    city: "Birmingham",
    phone: "0788888888",
    passport_number: "123456789",
    passport_expiry_date: "1/9/2025",
    date_of_birth: "1/9/1990",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Olivia",
    last_name: "Williams",
    email: "olivia.williams@example.com",
    application_status: "approved",
    createdAt: "8/21/2023",
    country: "United Kingdom",
    gender: "Female",
    address: "29 Maple Avenue",
    city: "Liverpool",
    phone: "0788888888",
    passport_number: "123456789",
    passport_expiry_date: "8/21/2024",
    date_of_birth: "8/21/1990",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Charlie",
    last_name: "Jones",
    email: "charlie.jones@example.com",
    application_status: "rejected",
    createdAt: "5/7/2024",
    country: "England",
    gender: "Male",
    address: "72 Elm Street",
    passport_expiry_date: "5/7/2025",
    date_of_birth: "5/7/1990",
    passport_number: "123456789",
    city: "Leeds",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Sophia",
    last_name: "Taylor",
    email: "sophia.taylor@example.com",
    application_status: "submitted",
    createdAt: "11/12/2023",
    country: "United Kingdom",
    gender: "Female",
    address: "13 Willow Road",
    city: "Sheffield",
    passport_expiry_date: "11/12/2024",
    date_of_birth: "11/12/1990",
    passport_number: "123456789",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Jacob",
    last_name: "Davis",
    email: "jacob.davis@example.com",
    application_status: "approved",
    createdAt: "3/18/2024",
    country: "England",
    gender: "Male",
    address: "88 Pine Street",
    city: "Bristol",
    passport_expiry_date: "3/18/2025",
    passport_number: "123456789",
    date_of_birth: "3/18/1990",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Amelia",
    last_name: "Evans",
    email: "amelia.evans@example.com",
    application_status: "rejected",
    createdAt: "7/5/2023",
    country: "United Kingdom",
    gender: "Female",
    address: "54 Cedar Avenue",
    city: "Nottingham",
    passport_expiry_date: "7/5/2024",
    passport_number: "123456789",
    date_of_birth: "7/5/1990",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Jack",
    last_name: "Thomas",
    email: "jack.thomas@example.com",
    application_status: "submitted",
    createdAt: "10/30/2024",
    country: "England",
    gender: "Male",
    address: "31 Birch Street",
    passport_expiry_date: "10/30/2025",
    date_of_birth: "10/30/1990",
    passport_number: "123456789",
    city: "Newcastle",
    attachments: [
      {
        document_type: "Passport",
        document_url: "/public/passport.pdf",
      },
    ],
  },
  {
    first_name: "Isabella",
    last_name: "Roberts",
    email: "isabella.roberts@example.com",
    application_status: "approved",
    createdAt: "6/14/2023",
    country: "United Kingdom",
    gender: "Female",
    address: "78 Oakwood Lane",

    city: "Leicester",
  },
  // Add more users here...
];

export const userApplications = [
  {
    regNumber: "REG-1234",
    serviceName: "Domestic Business Registration",
    status: "Submitted",
    submitionDate: "12-06-2022",
    id: "1",
  },
  {
    regNumber: "REG-1234",
    serviceName: "Domestic Business Registration",
    status: "Verified",
    submitionDate: "12-06-2022",
    id: "2",
  },
  {
    regNumber: "REG-1234",
    serviceName: "Domestic Business Registration",
    status: "Approved",
    submitionDate: "12-06-2022",
    id: "3",
  },
  {
    regNumber: "REG-1234",
    serviceName: "Domestic Business Registration",
    status: "Request for action",
    submitionDate: "12-06-2022",
    id: "4",
  },
  {
    regNumber: "REG-1234",
    serviceName: "Domestic Business Registration",
    status: "Rejected",
    submitionDate: "12-06-2022",
    id: "4",
  },
];

export const registeredBusinesses = [
  {
    reference_no: "C001",
    company_name: "Company 1",
    status: "Active",
    createdAt: "2022-10-10, 10:00",
    id: "1",
  },
  {
    reference_no: "C002",
    company_name: "Company 2",
    status: "Approved",
    createdAt: "2022-10-10, 10:00",
    id: "2",
  },
  {
    reference_no: "C003",
    company_name: "Company 3",
    status: "Closed",
    createdAt: "2022-10-10, 10:00",
    id: "3",
  },
  {
    reference_no: "C004",
    company_name: "Company 4",
    status: "Pending",
    createdAt: "2022-10-10, 10:00",
    id: "4",
  },
  {
    reference_no: "C005",
    company_name: "Company 5",
    status: "Dormant",
    createdAt: "2022-10-10, 10:00",
    id: "5",
  },
];

export const roles = [
  {
    id: "819f11b7-ef5d-447b-930b-117b09868c95",
    name: "Supervisor",
    description: "Handles customer support inquiries",
    user_name: "Elonore MacSkeagan",
    createdAt: "2024-02-23T01:18:47Z",
    updatedAt: "2023-08-11T05:17:15Z",
  },
  {
    id: "7a6a838e-10f3-49e0-af7e-4da90b8c8486",
    name: "Supervisor",
    description: "Generates reports for management",
    user_name: "Minne Suett",
    createdAt: "2023-09-02T11:07:09Z",
    updatedAt: "2023-09-08T12:51:52Z",
  },
  {
    id: "d50f7a94-35e5-48ce-9328-06c84ef41be6",
    name: "Construction Expeditor",
    description: "Analyzes system performance data",
    user_name: "Base Vaillant",
    createdAt: "2023-03-19T08:53:05Z",
    updatedAt: "2023-06-23T06:26:39Z",
  },
  {
    id: "551177c4-7433-4579-83be-263995749150",
    name: "Architect",
    description: "Manages user accounts and permissions",
    user_name: "Netty Bettridge",
    createdAt: "2023-06-08T03:58:51Z",
    updatedAt: "2023-04-08T12:07:16Z",
  },
  {
    id: "0750a09c-b246-4d51-b2cd-eabfd6710068",
    name: "Construction Manager",
    description: "Analyzes system performance data",
    user_name: "Lavinia Bartoszewski",
    createdAt: "2023-07-02T21:12:48Z",
    updatedAt: "2023-10-13T19:20:51Z",
  },
  {
    id: "4b67edf7-19bd-4904-bce3-69b205fbc000",
    name: "Construction Manager",
    description: "Handles customer support inquiries",
    user_name: "Laurence Teaser",
    createdAt: "2023-11-19T01:36:26Z",
    updatedAt: "2023-06-24T13:58:15Z",
  },
  {
    id: "d5067d89-0d3d-4891-bc59-190e1bc122fa",
    name: "Supervisor",
    description: "Generates reports for management",
    user_name: "Kerr Offen",
    createdAt: "2024-01-08T23:14:34Z",
    updatedAt: "2023-09-17T22:38:31Z",
  },
  {
    id: "5c0c5384-88ae-439a-ba23-c14533fcee76",
    name: "Engineer",
    description: "Generates reports for management",
    user_name: "Naoma Edyson",
    createdAt: "2023-10-16T21:54:45Z",
    updatedAt: "2023-05-02T00:19:59Z",
  },
  {
    id: "4d546683-3d19-4a00-bb77-156b6c0f518c",
    name: "Electrician",
    description: "Handles customer support inquiries",
    user_name: "Maynard Heephy",
    createdAt: "2023-07-21T06:51:11Z",
    updatedAt: "2023-04-07T21:41:46Z",
  },
  {
    id: "41671f85-4c65-4c8d-b385-fb8fec13ebd0",
    name: "Supervisor",
    description: "Manages user accounts and permissions",
    user_name: "Dael Irvin",
    createdAt: "2023-06-03T02:45:49Z",
    updatedAt: "2023-05-12T03:13:54Z",
  },
  {
    id: "191607dc-7b66-43cf-a2d9-153c76536297",
    name: "Construction Manager",
    description: "Generates reports for management",
    user_name: "Oswald Yuryev",
    createdAt: "2023-12-24T06:11:42Z",
    updatedAt: "2023-12-12T14:26:01Z",
  },
  {
    id: "91e771d0-79db-43f8-a6c5-8a3d64c0fcd5",
    name: "Construction Worker",
    description: "Analyzes system performance data",
    user_name: "Rhett Billing",
    createdAt: "2023-03-14T17:47:36Z",
    updatedAt: "2023-04-22T04:06:21Z",
  },
];

export const permissions = [
  {
    id: "696e6430-d242-4478-99dc-22613305f29d",
    name: "C+_f+",
    description: "Analyzes system performance data",
    user_name: "Yolanda Bridger",
    createdAt: "2024-02-17T00:35:34Z",
    updatedAt: "2023-09-06T21:53:02Z",
  },
  {
    id: "82ba4ba0-1629-4953-abaf-17ccbc2ebe57",
    name: "M+_n+_Y+",
    description: "Handles customer support inquiries",
    user_name: "Jackqueline Lidgey",
    createdAt: "2023-05-25T07:39:56Z",
    updatedAt: "2023-11-08T03:57:37Z",
  },
  {
    id: "8377d7fa-716f-4534-a64a-98c952ebf295",
    name: "P+_q+_P+",
    description: "Analyzes system performance data",
    user_name: "Agosto Meecher",
    createdAt: "2023-08-26T07:08:28Z",
    updatedAt: "2024-01-28T18:18:35Z",
  },
  {
    id: "9f860a8a-ab05-4eef-bf36-0b0216a77e9f",
    name: "G+_r+_o+",
    description: "Analyzes system performance data",
    user_name: "Zacharia Worviell",
    createdAt: "2023-06-03T05:36:07Z",
    updatedAt: "2023-05-08T08:38:42Z",
  },
  {
    id: "c7a9516f-39e3-43b5-8ad9-a8fc5e6ef518",
    name: "I+_C+_x+",
    description: "Handles customer support inquiries",
    user_name: "Adi Geeve",
    createdAt: "2023-11-10T07:18:10Z",
    updatedAt: "2023-12-01T02:05:33Z",
  },
  {
    id: "7c1e54fc-43a4-41b6-ac18-4d3ab1eeb18e",
    name: "m+_o+_U+",
    description: "Analyzes system performance data",
    user_name: "Zorina Ralston",
    createdAt: "2024-02-08T14:11:11Z",
    updatedAt: "2024-01-11T05:14:19Z",
  },
  {
    id: "c4bf6519-80f1-4beb-aae8-eb04b798a4a3",
    name: "c+_d+_e+",
    description: "Manages user accounts and permissions",
    user_name: "Reagan Challoner",
    createdAt: "2024-02-27T22:33:26Z",
    updatedAt: "2023-11-12T20:56:03Z",
  },
  {
    id: "0f903ff3-d8d7-4bc3-a584-b702411c1294",
    name: "f+_Z+_H+",
    description: "Analyzes system performance data",
    user_name: "Jeno Shemwell",
    createdAt: "2023-03-04T11:00:01Z",
    updatedAt: "2023-09-18T17:28:45Z",
  },
  {
    id: "1e6cd67a-b212-488b-8554-5eb92345fe17",
    name: "p+_d+",
    description: "Manages user accounts and permissions",
    user_name: "Carl Spreadbury",
    createdAt: "2023-05-19T00:16:50Z",
    updatedAt: "2023-03-18T20:08:17Z",
  },
  {
    id: "8cebf5e8-3402-4bc3-ab8b-0447fa4b3eeb",
    name: "Q+_F+",
    description: "Generates reports for management",
    user_name: "Jefferson Jarley",
    createdAt: "2023-06-27T03:21:53Z",
    updatedAt: "2023-05-08T23:15:43Z",
  },
  {
    id: "1a3daa8a-1d46-49a2-9e74-ae3b32c2241d",
    name: "D+_s+_T+",
    description: "Analyzes system performance data",
    user_name: "Nesta O'Crigane",
    createdAt: "2023-12-17T18:17:58Z",
    updatedAt: "2023-04-24T21:57:42Z",
  },
  {
    id: "ed31cd07-a88d-4535-af5d-7b42956c19d7",
    name: "o+_U+",
    description: "Generates reports for management",
    user_name: "Halley Grigoryev",
    createdAt: "2023-10-09T04:21:57Z",
    updatedAt: "2023-06-04T21:30:08Z",
  },
  {
    id: "fcff930e-7135-4154-af4c-ac50fcee0476",
    name: "Q+_m+",
    description: "Analyzes system performance data",
    user_name: "Kalil Alfonzo",
    createdAt: "2023-08-26T01:03:54Z",
    updatedAt: "2023-07-04T18:23:40Z",
  },
  {
    id: "4d6a50bc-f571-4c26-b590-cda438fbf250",
    name: "K+_W+",
    description: "Generates reports for management",
    user_name: "Hollis Mabb",
    createdAt: "2023-11-07T09:15:25Z",
    updatedAt: "2023-07-12T11:58:54Z",
  },
  {
    id: "2d1d73e0-bbca-4b5d-814e-96b4d5d29cca",
    name: "B+_P+",
    description: "Analyzes system performance data",
    user_name: "Christan Megson",
    createdAt: "2023-12-20T08:32:47Z",
    updatedAt: "2023-08-18T00:34:44Z",
  },
  {
    id: "57a1282c-895c-420d-8a9e-535f598daf68",
    name: "O+_K+",
    description: "Manages user accounts and permissions",
    user_name: "Inglebert Cattlemull",
    createdAt: "2023-06-10T08:06:55Z",
    updatedAt: "2023-11-26T06:19:16Z",
  },
  {
    id: "d2522f23-7d9d-448c-91d9-db119291da7d",
    name: "o+_z+",
    description: "Generates reports for management",
    user_name: "Katinka Dignan",
    createdAt: "2023-03-20T16:06:02Z",
    updatedAt: "2024-01-10T04:32:39Z",
  },
  {
    id: "cc5e7bb2-c067-4044-824a-7e203e8c08a7",
    name: "V+_s+_h+",
    description: "Handles customer support inquiries",
    user_name: "Marja Buckoke",
    createdAt: "2023-09-19T09:42:40Z",
    updatedAt: "2024-02-27T10:35:52Z",
  },
  {
    id: "b7357937-b98f-4256-af7e-8f7e0bc9c149",
    name: "s+_Q+",
    description: "Manages user accounts and permissions",
    user_name: "Morlee Tweedell",
    createdAt: "2024-01-14T09:17:14Z",
    updatedAt: "2023-04-30T00:48:43Z",
  },
  {
    id: "8ddbd49a-aea9-4ea7-8e2d-5bfcc7af3c87",
    name: "r+_m+_c+",
    description: "Generates reports for management",
    user_name: "Hymie Peach",
    createdAt: "2023-11-11T04:17:58Z",
    updatedAt: "2024-01-04T01:01:12Z",
  },
  {
    id: "8f9a2cad-8b36-45ac-a1a3-74fa3ae6187d",
    name: "s+_N+",
    description: "Generates reports for management",
    user_name: "Doralynn Deniseau",
    createdAt: "2023-09-21T16:27:58Z",
    updatedAt: "2023-10-03T06:13:43Z",
  },
  {
    id: "c4dc4880-b57c-4b8d-a637-4ae1a598cbc7",
    name: "J+_y+",
    description: "Handles customer support inquiries",
    user_name: "Leroy Pischoff",
    createdAt: "2023-10-20T03:59:42Z",
    updatedAt: "2023-10-03T13:09:22Z",
  },
  {
    id: "90ec8381-02f2-4e79-bba7-9fa3b0da5ca8",
    name: "A+_M+",
    description: "Manages user accounts and permissions",
    user_name: "Terry Kits",
    createdAt: "2023-12-26T14:38:00Z",
    updatedAt: "2023-10-04T20:21:06Z",
  },
  {
    id: "2becd3cb-c1b7-491a-b742-afd3ae6a067b",
    name: "m+_C+",
    description: "Generates reports for management",
    user_name: "Conny Labat",
    createdAt: "2023-06-26T04:14:47Z",
    updatedAt: "2023-03-07T09:10:13Z",
  },
  {
    id: "76a9f0b9-ed78-4c90-8ce8-7db99f1ce005",
    name: "o+_l+_w+",
    description: "Generates reports for management",
    user_name: "Gualterio Holcroft",
    createdAt: "2024-01-14T20:07:16Z",
    updatedAt: "2024-02-28T19:08:32Z",
  },
  {
    id: "498b6705-b81c-4590-b30c-9827c3090262",
    name: "B+_K+_W+",
    description: "Analyzes system performance data",
    user_name: "Andrew Borrow",
    createdAt: "2023-11-25T15:46:28Z",
    updatedAt: "2023-11-30T11:19:21Z",
  },
  {
    id: "74237a86-f354-4249-98fe-05a4f4917fa9",
    name: "A+_t+_o+",
    description: "Manages user accounts and permissions",
    user_name: "Liz Gott",
    createdAt: "2023-06-10T10:11:02Z",
    updatedAt: "2024-01-20T02:01:35Z",
  },
  {
    id: "c47d6427-3db4-42d2-beef-2a0a5f04b6e9",
    name: "H+_H+",
    description: "Analyzes system performance data",
    user_name: "Caitrin Bigly",
    createdAt: "2024-02-09T05:55:29Z",
    updatedAt: "2023-05-16T14:37:14Z",
  },
  {
    id: "e44ddc85-84c5-4587-88bf-663b99ea599c",
    name: "Z+_w+_O+",
    description: "Generates reports for management",
    user_name: "Oby Hannen",
    createdAt: "2023-06-17T06:51:15Z",
    updatedAt: "2023-12-09T13:35:47Z",
  },
  {
    id: "887c907e-98c0-4a05-933c-0c7d8ecee950",
    name: "B+_Q+",
    description: "Handles customer support inquiries",
    user_name: "Nanete Betonia",
    createdAt: "2023-09-24T07:48:03Z",
    updatedAt: "2024-02-05T10:47:06Z",
  },
  {
    id: "b5eba04e-f08a-4ea9-9715-f202eb912c0d",
    name: "q+_A+_c+",
    description: "Analyzes system performance data",
    user_name: "Gilly Rapin",
    createdAt: "2023-07-14T20:49:47Z",
    updatedAt: "2023-09-29T11:44:39Z",
  },
  {
    id: "fb94f46b-1c65-4fd1-8f13-ffdcc31dd52d",
    name: "l+_f+",
    description: "Handles customer support inquiries",
    user_name: "Sydelle Gladdor",
    createdAt: "2023-03-30T10:24:22Z",
    updatedAt: "2023-11-03T16:27:45Z",
  },
  {
    id: "dcd6278b-5ccb-4e00-a80b-c1a3595004b2",
    name: "G+_L+_G+",
    description: "Generates reports for management",
    user_name: "Jane Clayborn",
    createdAt: "2023-06-22T11:19:31Z",
    updatedAt: "2023-12-20T04:22:02Z",
  },
  {
    id: "f790edc2-c574-4c55-87f9-3d3f61bf90c4",
    name: "a+_T+",
    description: "Handles customer support inquiries",
    user_name: "Abbye Foster-Smith",
    createdAt: "2023-06-19T07:30:10Z",
    updatedAt: "2023-09-18T22:54:46Z",
  },
  {
    id: "c896b2a8-91fb-4923-a8cd-3fe9c0bc4af4",
    name: "W+_d+",
    description: "Generates reports for management",
    user_name: "Ferdinande Mead",
    createdAt: "2023-10-11T06:31:15Z",
    updatedAt: "2023-10-22T02:06:48Z",
  },
  {
    id: "8cc317c8-9352-40a2-97b4-38125a495c00",
    name: "d+_f+",
    description: "Analyzes system performance data",
    user_name: "Cara Larkings",
    createdAt: "2024-02-21T19:59:30Z",
    updatedAt: "2023-12-12T01:18:13Z",
  },
  {
    id: "29a0592c-7077-43f6-acbe-68d90790af1b",
    name: "j+_W+",
    description: "Generates reports for management",
    user_name: "Ivonne Chislett",
    createdAt: "2023-07-15T03:07:04Z",
    updatedAt: "2023-04-05T12:40:10Z",
  },
  {
    id: "7c72cec7-b46c-4e26-b63e-020115b683f9",
    name: "n+_E+",
    description: "Generates reports for management",
    user_name: "Yard Eye",
    createdAt: "2024-03-03T10:03:06Z",
    updatedAt: "2023-07-08T18:13:57Z",
  },
  {
    id: "eb311dbf-c89a-4eeb-8f15-a0fde5428474",
    name: "V+_B+_s+",
    description: "Manages user accounts and permissions",
    user_name: "Viki Jasiak",
    createdAt: "2023-05-04T16:00:39Z",
    updatedAt: "2023-04-11T18:42:46Z",
  },
  {
    id: "299b44e0-a3ce-48cc-958e-92dce5a965d5",
    name: "U+_P+",
    description: "Manages user accounts and permissions",
    user_name: "Bernelle Paydon",
    createdAt: "2023-05-29T22:26:31Z",
    updatedAt: "2023-06-08T01:06:51Z",
  },
  {
    id: "ad767fd3-d48f-41cb-ae80-a496262f8d46",
    name: "X+_F+_P+",
    description: "Analyzes system performance data",
    user_name: "Tyrus Killcross",
    createdAt: "2023-05-21T19:11:22Z",
    updatedAt: "2023-08-22T09:24:34Z",
  },
  {
    id: "3c169514-bd92-4257-ba34-1c99a927d7b1",
    name: "L+_e+_N+",
    description: "Generates reports for management",
    user_name: "Ursola Cumbers",
    createdAt: "2023-03-24T07:19:18Z",
    updatedAt: "2024-03-03T01:52:55Z",
  },
  {
    id: "a62c1a04-fa29-4aa8-aeb5-45a72a1e0cbd",
    name: "Y+_z+_S+",
    description: "Analyzes system performance data",
    user_name: "Dorise O'Neal",
    createdAt: "2023-12-14T09:15:52Z",
    updatedAt: "2023-06-19T07:01:04Z",
  },
  {
    id: "2ba79b87-6a09-421b-a63d-6fa11554a849",
    name: "G+_O+",
    description: "Manages user accounts and permissions",
    user_name: "Brigham Fatscher",
    createdAt: "2023-03-12T05:46:23Z",
    updatedAt: "2023-03-30T20:56:51Z",
  },
  {
    id: "cc197209-3ffc-4e52-bc7c-028c268353dc",
    name: "n+_z+_q+",
    description: "Handles customer support inquiries",
    user_name: "Brinn Rotge",
    createdAt: "2023-06-27T03:55:48Z",
    updatedAt: "2023-12-05T15:30:49Z",
  },
  {
    id: "e3ed328e-e678-4a82-a1ed-f37a6b38cc17",
    name: "n+_F+",
    description: "Handles customer support inquiries",
    user_name: "Marion Magnus",
    createdAt: "2023-03-26T01:34:09Z",
    updatedAt: "2023-05-09T02:14:29Z",
  },
  {
    id: "02e0c294-d862-4b5b-a331-ecabe26bafcc",
    name: "N+_a+",
    description: "Handles customer support inquiries",
    user_name: "Claude Enbury",
    createdAt: "2023-07-30T21:46:06Z",
    updatedAt: "2023-12-20T00:00:33Z",
  },
  {
    id: "449f02e9-9dff-4906-8f10-7e4ff40287d9",
    name: "X+_K+",
    description: "Analyzes system performance data",
    user_name: "Keir Temblett",
    createdAt: "2023-09-17T13:48:25Z",
    updatedAt: "2023-07-14T01:22:08Z",
  },
  {
    id: "641b6ca4-429f-48b9-9dc8-48a8087f45f9",
    name: "I+_r+",
    description: "Manages user accounts and permissions",
    user_name: "Athena Blanckley",
    createdAt: "2024-01-31T16:10:17Z",
    updatedAt: "2023-05-11T21:28:37Z",
  },
  {
    id: "1ded12c8-76f5-4f6b-80d2-b8ce7b85e8da",
    name: "o+_c+",
    description: "Generates reports for management",
    user_name: "Britta Osbidston",
    createdAt: "2023-04-18T19:06:29Z",
    updatedAt: "2023-06-29T03:09:43Z",
  },
];

export const institutions = [
  {
    id: 1,
    name: "Yambee",
    email: "info@PxazSv.com",
    createdAt: "2023-05-17T14:14:28Z",
    type: "private_sector",
  },
  {
    id: 2,
    name: "Voolith",
    email: "info@cTdTHsG.com",
    createdAt: "2023-02-02T01:47:07Z",
    type: "government",
    address: "Apt 144",
  },
  {
    id: 3,
    name: "Browsezoom",
    email: "info@wbVgSmxNOJ.com",
    createdAt: "2023-05-22T11:20:09Z",
    type: "government",
  },
  {
    id: 4,
    name: "Podcat",
    email: "info@QRvlysgcJ.com",
    createdAt: "2023-01-13T06:43:16Z",
    type: "government",
    address: "Room 1161",
  },
  {
    id: 5,
    name: "Babblestorm",
    email: "info@xicTQAKyS.com",
    createdAt: "2023-01-30T09:54:41Z",
    type: "government",
  },
  {
    id: 6,
    name: "Tagfeed",
    email: "info@jEPWE.com",
    createdAt: "2024-02-11T20:47:17Z",
    type: "private_sector",
  },
  {
    id: 7,
    name: "Demimbu",
    email: "info@yABHuBAWWU.com",
    createdAt: "2024-01-28T05:07:49Z",
    type: "government",
  },
  {
    id: 8,
    name: "Jaxbean",
    email: "info@uZRzAHE.com",
    createdAt: "2023-06-16T18:49:05Z",
    type: "private_sector",
    address: "Room 162",
  },
  {
    id: 9,
    name: "Browsecat",
    email: "info@MAykIZLWh.com",
    createdAt: "2023-09-29T15:00:29Z",
    type: "private_sector",
  },
  {
    id: 10,
    name: "Tagfeed",
    email: "info@pMbKPn.com",
    createdAt: "2023-07-09T21:30:04Z",
    type: "private_sector",
    address: "5th Floor",
  },
  {
    id: 11,
    name: "Feedfire",
    email: "info@DjFVuj.com",
    createdAt: "2023-10-04T19:27:39Z",
    type: "government",
  },
  {
    id: 12,
    name: "Voonder",
    email: "info@qqtjm.com",
    createdAt: "2023-09-25T12:20:53Z",
    type: "private_sector",
  },
  {
    id: 13,
    name: "Eidel",
    email: "info@XXTdVTH.com",
    createdAt: "2023-04-17T04:54:13Z",
    type: "private_sector",
  },
  {
    id: 14,
    name: "Oba",
    email: "info@AOcgqKP.com",
    createdAt: "2023-05-20T16:14:09Z",
    type: "government",
  },
  {
    id: 15,
    name: "Shuffletag",
    email: "info@JLhse.com",
    createdAt: "2023-10-08T23:36:07Z",
    type: "private_sector",
  },
  {
    id: 16,
    name: "Kaymbo",
    email: "info@iAMQyQU.com",
    createdAt: "2023-04-20T23:37:04Z",
    type: "government",
  },
  {
    id: 17,
    name: "Feedspan",
    email: "info@xMMHsYFmPe.com",
    createdAt: "2024-02-08T08:34:11Z",
    type: "government",
  },
  {
    id: 18,
    name: "Shufflebeat",
    email: "info@aVWzy.com",
    createdAt: "2023-11-05T07:30:14Z",
    type: "private_sector",
    address: "Room 353",
  },
  {
    id: 19,
    name: "Layo",
    email: "info@CdysPYhJUY.com",
    createdAt: "2023-07-16T11:00:23Z",
    type: "government",
  },
  {
    id: 20,
    name: "Jaloo",
    email: "info@xPkzaoijjK.com",
    createdAt: "2023-09-23T19:39:21Z",
    type: "government",
  },
  {
    id: 21,
    name: "Feedfish",
    email: "info@FqjkraUZjI.com",
    createdAt: "2024-01-07T15:26:14Z",
    type: "government",
    address: "Room 826",
  },
  {
    id: 22,
    name: "Shufflester",
    email: "info@GYHEswVlA.com",
    createdAt: "2023-09-11T14:32:27Z",
    type: "government",
  },
  {
    id: 23,
    name: "Avavee",
    email: "info@rDShUNhcO.com",
    createdAt: "2023-02-24T07:42:48Z",
    type: "private_sector",
    address: "PO Box 23474",
  },
  {
    id: 24,
    name: "Blognation",
    email: "info@pZayFDiZ.com",
    createdAt: "2023-03-29T15:09:33Z",
    type: "private_sector",
  },
  {
    id: 25,
    name: "Trilith",
    email: "info@tAxNRC.com",
    createdAt: "2023-04-11T20:43:07Z",
    type: "private_sector",
  },
  {
    id: 26,
    name: "Wordpedia",
    email: "info@FXBzk.com",
    createdAt: "2023-04-18T23:36:52Z",
    type: "government",
  },
  {
    id: 27,
    name: "Feedspan",
    email: "info@VKfGtiyHbm.com",
    createdAt: "2023-07-03T04:27:02Z",
    type: "government",
    address: "1st Floor",
  },
  {
    id: 28,
    name: "Camimbo",
    email: "info@iGwaWgm.com",
    createdAt: "2023-01-31T20:05:37Z",
    type: "private_sector",
  },
  {
    id: 29,
    name: "Katz",
    email: "info@xIHnuwieTS.com",
    createdAt: "2023-06-17T02:39:46Z",
    type: "private_sector",
  },
  {
    id: 30,
    name: "Realpoint",
    email: "info@VJthrZASJ.com",
    createdAt: "2023-10-26T03:04:16Z",
    type: "government",
  },
  {
    id: 31,
    name: "Gabspot",
    email: "info@nMePZNGzQk.com",
    createdAt: "2023-01-28T09:03:51Z",
    type: "government",
  },
  {
    id: 32,
    name: "Browsecat",
    email: "info@kmNqgVX.com",
    createdAt: "2023-08-23T15:55:54Z",
    type: "private_sector",
  },
  {
    id: 33,
    name: "Topicware",
    email: "info@ZqqsUZ.com",
    createdAt: "2023-03-08T21:43:17Z",
    type: "private_sector",
  },
  {
    id: 34,
    name: "Demizz",
    email: "info@HJJOCicCU.com",
    createdAt: "2024-02-01T06:02:53Z",
    type: "private_sector",
    address: "PO Box 88871",
  },
  {
    id: 35,
    name: "Gigaclub",
    email: "info@kHGtv.com",
    createdAt: "2023-04-10T11:39:39Z",
    type: "government",
    address: "18th Floor",
  },
  {
    id: 36,
    name: "Leenti",
    email: "info@APtflAm.com",
    createdAt: "2023-01-17T08:00:40Z",
    type: "government",
    address: "Room 127",
  },
  {
    id: 37,
    name: "Fivechat",
    email: "info@oKEmkIRqKH.com",
    createdAt: "2023-12-30T01:04:29Z",
    type: "government",
    address: "Room 1069",
  },
  {
    id: 38,
    name: "Feednation",
    email: "info@jcaJSabWC.com",
    createdAt: "2023-11-30T10:35:44Z",
    type: "private_sector",
  },
  {
    id: 39,
    name: "Brightbean",
    email: "info@dlizjEwaVI.com",
    createdAt: "2023-07-23T14:06:22Z",
    type: "government",
    address: "Room 663",
  },
  {
    id: 40,
    name: "Rhynoodle",
    email: "info@EVzrtBsSF.com",
    createdAt: "2023-03-15T14:27:16Z",
    type: "government",
  },
  {
    id: 41,
    name: "Kayveo",
    email: "info@gHtNYeUcE.com",
    createdAt: "2023-08-03T03:35:06Z",
    type: "private_sector",
  },
  {
    id: 42,
    name: "Trupe",
    email: "info@zSPUOoqgy.com",
    createdAt: "2023-11-24T10:20:31Z",
    type: "private_sector",
    address: "PO Box 45067",
  },
  {
    id: 43,
    name: "Tagpad",
    email: "info@xAHrAOmtln.com",
    createdAt: "2023-04-24T02:09:01Z",
    type: "government",
  },
  {
    id: 44,
    name: "Skalith",
    email: "info@yyFQVlgF.com",
    createdAt: "2023-03-13T05:49:02Z",
    type: "government",
  },
  {
    id: 45,
    name: "Zooxo",
    email: "info@FQsUb.com",
    createdAt: "2023-09-11T07:33:19Z",
    type: "private_sector",
  },
  {
    id: 46,
    name: "Jabbersphere",
    email: "info@PsDYuaa.com",
    createdAt: "2023-11-21T15:13:10Z",
    type: "government",
  },
  {
    id: 47,
    name: "Oyoba",
    email: "info@xVDvZMERPY.com",
    createdAt: "2023-11-02T08:52:27Z",
    type: "government",
  },
  {
    id: 48,
    name: "Twitterwire",
    email: "info@noxSUJJDJ.com",
    createdAt: "2022-12-15T19:44:24Z",
    type: "private_sector",
    address: "Room 1405",
  },
  {
    id: 49,
    name: "Babbleblab",
    email: "info@gjADaI.com",
    createdAt: "2023-10-12T00:30:56Z",
    type: "government",
    address: "Room 593",
  },
  {
    id: 50,
    name: "Flipstorm",
    email: "info@bbTQQMGVqh.com",
    createdAt: "2022-12-24T10:22:44Z",
    type: "government",
    address: "7th Floor",
  },
];
