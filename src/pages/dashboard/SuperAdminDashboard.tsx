import SuperAdminDashboardCard from '../../components/cards/SuperAdminDashboardCard';
import SuperAdminLayout from '../../containers/SuperAdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import {
  RecentActivities,
  dashboardCards,
  monthsData,
} from '../../constants/Dashboard';
import Select from '../../components/inputs/Select';
import {
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
  Area,
  Legend,
  ComposedChart,
} from 'recharts';
import { useState } from 'react';
import Button from '../../components/inputs/Button';
import Table from '../../components/table/Table';
import { columns, users } from '../../constants/Users';

const SuperAdminDashboard = () => {
  // STATE VARIABLES
  const [monthsDataArray, setMonthsDataArray] = useState(monthsData());

  return (
    <SuperAdminLayout>
      <main className="flex flex-col gap-6 w-full items-center justify-center px-6">
        {/* DASHBOARD CARDS */}
        <menu className="flex items-start w-full justify-between gap-6 flex-wrap max-[600px]:justify-center max-[600px]:gap-4">
          {dashboardCards.map((card, index) => {
            return (
              <SuperAdminDashboardCard
                title={card?.title}
                change={card?.change}
                value={card?.value}
                icon={card?.icon}
                key={index}
                route={card?.route}
              />
            );
          })}
        </menu>
        {/* RECENT ACTIVITIES AND GRAPH */}
        <menu className="flex items-start gap-[1%] w-full h-[40vh] min-h-[50vh] max-[1100px]:flex-col max-[1100px]:h-full max-[1100px]:gap-6">
          <section className="recent-activities flex flex-col gap-5 bg-white rounded-md shadow-md p-5 h-full w-[30%] max-[1300px]:w-[34%] max-[1100px]:w-full">
            <h1 className="text-primary font-semibold text-[16px] max-[600px]:text-center">
              Recent Activities
            </h1>
            <ul className="flex flex-col gap-2 py-1 overflow-scroll max-[1100px]:max-h-[40vh] max-[1100px]:flex-row max-[1100px]:flex-wrap">
              {RecentActivities.map((activity, index) => {
                return (
                  <li
                    key={index}
                    className="flex items-start justify-start gap-3 cursor-pointer ease-in-out duration-200 hover:bg-gray-100 p-2 rounded-md w-full max-[1100px]:w-[47%]"
                  >
                    <figure className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon
                        className="text-[10px] text-secondary"
                        icon={faCircle}
                      />
                      <hr className="border-l-[.5px] w-0 border-secondary h-8" />
                    </figure>
                    <article className="flex flex-col gap-1">
                      <h2 className="text-[14px]">{activity?.title}</h2>
                      <p className="text-[12px] text-secondary uppercase">
                        {moment(activity?.date).format('DD/MM/YYYY, hh:mm')}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="bg-white w-[70%] p-6 h-full min-h-fit flex flex-col gap-4 rounded-md shadow-md max-[1300px]:w-[65%] max-[1100px]:w-full">
            <menu className="flex w-full items-center gap-3 justify-between max-[600px]:flex-col">
              <h1 className="text-lg font-medium">User Overview</h1>
              <span className="flex items-center w-full max-w-[20%] max-[600px]:max-w-[80%]">
                <Select
                  options={[
                    { label: 'Yearly', value: 'year' },
                    { label: 'Monthly', value: 'month' },
                  ]}
                  onChange={(e) => {
                    setMonthsDataArray(monthsData());
                    return e?.value;
                  }}
                />
              </span>
            </menu>
            <ResponsiveContainer height={'90%'} width={'100%'}>
              <ComposedChart compact data={monthsDataArray}>
                <Area
                  connectNulls
                  dataKey="value"
                  fill="#EAFAFE"
                  stackId={1}
                  fillOpacity={0.8}
                  strokeWidth={2}
                  stroke="#3A9FFE"
                  type="natural"
                />
                <XAxis dataKey="month" />
                <Legend />
                <YAxis
                  allowDataOverflow
                  tickSize={10}
                  tickMargin={20}
                  className="!text-[12px]"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <Tooltip />
                <CartesianGrid strokeDasharray={'5 5'} y={0} vertical={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </section>
        </menu>
        {/* RECENT USERS */}
        <section className="w-full flex flex-col gap-6 rounded-md shadow-md bg-white p-6">
          <menu className="flex w-full items-center gap-3 justify-between max-[400px]:flex-col">
            <h1 className="text-primary text-lg font-semibold max-[400px]:text-center">Recent Users</h1>
            <Button route='/admin/users' className="!text-[13px]" styled={false} value={
          <menu className="flex items-center gap-2 text-[13px] ease-in-out hover:gap-3 duration-300">
            View more
            <FontAwesomeIcon className='text-[13px]' icon={faArrowRight} />
          </menu>
        } />
          </menu>
          <Table
            data={users?.map((user, index) => {
              return {
                ...user,
                no: index + 1,
              };
            })}
            columns={columns}
            showPagination={false}
            pageSize={5}
            showFilter={false}
          />
        </section>
      </main>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
