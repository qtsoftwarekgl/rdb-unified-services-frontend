import DashboardCard from '../../components/cards/DashboardCard';
import AdminLayout from '../../containers/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {
  recentActivities,
  adminDashboardCards,
  monthsData,
} from '../../constants/dashboard';
import Select from '../../components/inputs/Select';
import { useState } from 'react';
import Button from '../../components/inputs/Button';
import Table from '../../components/table/Table';
import { columns, users } from '../../constants/Users';
import RecentActivities from '../../components/cards/RecentActivities';
import DashboardChart from '../../components/DashboardChart';
import { Controller, useForm } from 'react-hook-form';

const AdminDashboard = () => {
  // STATE VARIABLES
  const [monthsDataArray, setMonthsDataArray] = useState(monthsData());

  // REACT HOOK FORM
  const { control } = useForm();

  return (
    <AdminLayout>
      <main className="flex flex-col items-center justify-center w-full gap-6 px-6">
        {/* DASHBOARD CARDS */}
        <menu className="flex items-start w-full justify-between gap-6 flex-wrap max-[600px]:justify-center max-[600px]:gap-4">
          {adminDashboardCards.map((card, index) => {
            return (
              <DashboardCard
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
          <RecentActivities activities={recentActivities} />
          <section className="bg-white w-[70%] p-6 h-full min-h-fit flex flex-col gap-4 rounded-md shadow-md max-[1300px]:w-[65%] max-[1100px]:w-full">
            <menu className="flex w-full items-center gap-3 justify-between max-[600px]:flex-col">
              <h1 className="text-lg font-medium">User Overview</h1>
              <span className="flex items-center w-full max-w-[20%] max-[600px]:max-w-[80%]">
              <Controller
                  name="period"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        placeholder="Select period"
                        options={[
                          { label: 'Yearly', value: 'year' },
                          { label: 'Monthly', value: 'month' },
                        ]}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setMonthsDataArray(monthsData());
                        }}
                      />
                    );
                  }}
                />
              </span>
            </menu>
            <DashboardChart data={monthsDataArray} dataKey='month' />
          </section>
        </menu>
        {/* RECENT USERS */}
        <section className="flex flex-col w-full gap-6 p-6 bg-white rounded-md shadow-md">
          <menu className="flex w-full items-center gap-3 justify-between max-[400px]:flex-col">
            <h1 className="text-primary text-lg font-semibold max-[400px]:text-center">
              Recent Users
            </h1>
            <Button
              route="/admin/users"
              className="!text-[13px]"
              styled={false}
              value={
                <menu className="flex items-center gap-2 text-[13px] ease-in-out hover:gap-3 duration-300">
                  View more
                  <FontAwesomeIcon
                    className="text-[13px]"
                    icon={faArrowRight}
                  />
                </menu>
              }
            />
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
    </AdminLayout>
  );
};

export default AdminDashboard;
