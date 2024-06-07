import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';
import { formatCompanyData } from '../../helpers/strings';
import AdminLayout from '../../containers/AdminLayout';
import ApplicatinsList from './ApplicationsList';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { business_application } from '../business-applications/domestic-business-registration/preview-submission/BusinessPreviewSubmission';

const ReviewRegistration = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);

  const sortBySubmissionDate = (
    a:
      | Date
      | {
          submissionDate: string | Date;
        },
    b:
      | Date
      | {
          submissionDate: string | Date;
        }
  ) => {
    return (
      new Date(b?.submissionDate).getTime() -
      new Date(a?.submissionDate).getTime()
    );
  };

  let applications = user_applications
    ?.filter((application: business_application) => application?.status !== 'IN_PROGRESS')
    ?.map(formatCompanyData)
    .sort(sortBySubmissionDate);

  if (user?.email?.includes('infoverifier@rdb'))
    applications = applications.filter((company) => {
      return !['approved', 'pending_approval', 'pending_rejection'].includes(company?.status);
    });

  if (user?.email?.includes('infoapprover@rdb'))
    applications = applications.filter((company) => {
      return ['pending_approval', 'in_review', 'pending_rejection'].includes(company?.status);
    });

  return (
    <AdminLayout>
      <ApplicatinsList
        title={'Review Applications'}
        data={applications}
        description=""
        actionIcon={faMagnifyingGlass}
        notDataMessage="No registrations to review for now. Enjoy your day!"
        handleClickAction={() => {}}
      />
    </AdminLayout>
  );
};

export default ReviewRegistration;
