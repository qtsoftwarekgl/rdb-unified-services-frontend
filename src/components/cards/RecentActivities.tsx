import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { FC } from 'react';

interface RecentActivitiesProps {
  activities: {
    title: string;
    date: string;
  }[];
}

const RecentActivities: FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <section className="recent-activities flex flex-col gap-5 bg-white rounded-md shadow-md p-5 h-full w-[30%] max-[1300px]:w-[34%] max-[1100px]:w-full">
      <h1 className="text-primary font-semibold text-[16px] max-[600px]:text-center">
        Recent Activities
      </h1>
      <ul className="flex flex-col gap-2 py-1 overflow-scroll max-[1100px]:max-h-[40vh] max-[1100px]:flex-row max-[1100px]:flex-wrap">
        {activities.map((activity, index) => {
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
  );
};

export default RecentActivities;
