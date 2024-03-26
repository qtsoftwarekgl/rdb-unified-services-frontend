import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';
import { capitalizeString, formatCompanyData } from '../../helpers/Strings';
import AdminLayout from '../../containers/AdminLayout';
import ApplicatinsList from './ApplicationsList';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const ReviewRegistration = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);

  const sortBySubmissionDate = (a, b) => {
    return (
      new Date(b?.submissionDate).getTime() -
      new Date(a?.submissionDate).getTime()
    );
  };

  let applications = user_applications
    ?.map(formatCompanyData)
    .sort(sortBySubmissionDate);

  if (user?.email?.includes('infoverifier@rdb'))
    applications = applications.filter((company) => {
      return company.status !== 'pending_approval';
    });

  if (user?.email?.includes('infoapprover@rdb'))
    applications = applications.filter((company) => {
      return company.status === capitalizeString('pending_approval');
    });

  return (
    <AdminLayout>
      <ApplicatinsList
        title={'Review Applications'}
        data={applications}
        description=""
        actionIcon={faMagnifyingGlass}
        notDataMessage="No registrations to review"
        handleClickAction={() => {}}
      />
    </AdminLayout>
  );
};

export default ReviewRegistration;
