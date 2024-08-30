import UserLayout from '@/containers/UserLayout';
import { getchBusinessThunk } from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { UUID } from 'crypto';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ForeignCompanyPreviewSubmission from '../business-applications/foreign-company-registration/preview-submission/ForeignCompanyPreviewSubmission';
import PreviewSubmission from '../business-applications/domestic-business-registration/preview-submission/BusinessPreviewSubmission';
import EnterprisePreviewSubmission from '../business-applications/enterprise-registration/EnterprisePreviewSubmission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { getBusinessName } from '@/helpers/business.helpers';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';

const UserApplicationDetails = () => {
  const {
    business,
    getBusinessIsFetching,
    getBusinessIsError,
    getBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // NAVIGATION
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  // GET BUSINESS THUNK
  useEffect(() => {
    if (id) {
      dispatch(getchBusinessThunk(id as UUID));
    }
  }, [dispatch, id]);

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      label: 'User Profile',
      route: '/user/profile',
    },
    {
      label: 'Business Applications',
      route: '/user/business/applications',
    },
    {
      label: getBusinessIsFetching ? `...` : `${getBusinessName(business)}`,
      route: `/user/business/${id}/details`,
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-6 p-6 bg-white rounded-md">
        <section className="flex flex-col gap-6 w-[90%] mx-auto my-4">
          <h1 className="text-xl font-semibold uppercase text-primary text-center">
            {getBusinessIsFetching ? 'Loading...' : getBusinessName(business)}
          </h1>
          <CustomBreadcrumb navigationLinks={navigationLinks} />
          <menu className="flex flex-col gap-6">
            {getBusinessIsFetching && <Loader />}
            {getBusinessIsError && (
              <p className="text-red-500">
                Error fetching business details. Please try again.
              </p>
            )}
            {getBusinessIsSuccess &&
              business.serviceId?.name.includes('Foreign') && (
                <ForeignCompanyPreviewSubmission
                  noActions
                  businessId={business?.id}
                  applicationStatus={business?.applicationStatus}
                />
              )}

            {getBusinessIsSuccess &&
              business.serviceId?.name.includes('Domestic') && (
                <PreviewSubmission
                  noActions
                  businessId={business?.id}
                  applicationStatus={business?.applicationStatus}
                />
              )}
            {getBusinessIsSuccess &&
              business.serviceId?.name.includes('Enterprise') && (
                <EnterprisePreviewSubmission
                  noActions
                  businessId={business?.id}
                  applicationStatus={business?.applicationStatus}
                />
              )}
            <menu className="flex w-28">
              <Link
                className=" w-full border border-primary flex items-center gap-4 text-[16px] text-center p-1 px-2 rounded-md bg-white text-primary hover:bg-primary hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/user/business/applications`);
                }}
                to={'#'}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                Return
              </Link>
            </menu>
          </menu>
        </section>
      </main>
    </UserLayout>
  );
};

export default UserApplicationDetails;
