import { useState } from 'react';
import {
  backOfficeDashboardCards,
  backOfficeRecentAcitivities,
  monthsData,
} from '../../constants/dashboard';
import DashboardCard from '../../components/cards/DashboardCard';
import AdminLayout from '../../containers/AdminLayout';
import Select from '../../components/inputs/Select';
import DashboardChart from '../../components/DashboardChart';
import RecentActivities from '../../components/cards/RecentActivities';
import { Controller, useForm } from 'react-hook-form';

const BackOfficeDashboard = () => {
  const [monthsDataArray, setMonthsDataArray] = useState(monthsData());

  // REACT HOOK FORM
  const { control } = useForm();

  return (
    <AdminLayout>
      <main className="flex flex-col items-center justify-center w-full gap-6 px-6">
        <menu className="flex items-start w-full  gap-6 flex-wrap max-[600px]:justify-center max-[600px]:gap-4">
          {backOfficeDashboardCards.map((card, index) => {
            return (
              <DashboardCard
                title={card?.title}
                value={card?.value}
                icon={card?.icon}
                key={index}
                route={card?.route}
              />
            );
          })}
        </menu>
        <menu className="flex items-start gap-[1%] w-full h-[40vh] min-h-[50vh] max-[1100px]:flex-col max-[1100px]:h-full max-[1100px]:gap-6">
          <RecentActivities activities={backOfficeRecentAcitivities} />
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
            <DashboardChart data={monthsDataArray} dataKey="month" />
          </section>
        </menu>
      </main>
    </AdminLayout>
  );
};

export default BackOfficeDashboard;
