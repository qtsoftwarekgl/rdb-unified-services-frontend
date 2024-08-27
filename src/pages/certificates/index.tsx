import { RootState } from '@/states/store';
import { useDispatch, useSelector } from "react-redux";
import UserLayout from '@/containers/UserLayout';
import CustomTab from '@/components/tabs/CustomTab';
import { TabType } from '@/types/navigationTypes';
import { setCertificateActiveTab } from '@/states/features/certificateSlice';
import BusinessCertificateLayout from './BusinessCertificateLayout';
import ReservedNames from './ReservedNames';

const BusinessCertificates = () => {
  const dispatch = useDispatch();

   const { certificate_active_tab, certificate_tabs } = useSelector(
    (state: RootState) => state.certificate
  );

  const handleSetActiveTab = (tab: TabType) => {
    dispatch(setCertificateActiveTab(tab));
  }

  return (
  <>
  <UserLayout>
    <main className='bg-white rounded-md '>
    <nav className='px-16 pt-4'>
    <CustomTab
      tabs={certificate_tabs}
      activeTab={certificate_active_tab}
      setActiveTab={handleSetActiveTab}
      />
    </nav>
    <section>
      {certificate_active_tab.name === 'business_certificates' && 
        <BusinessCertificateLayout />
      }
      {certificate_active_tab.name === 'name_reservation_certificate' &&
        <ReservedNames />
      }
    </section>
  </main>
  </UserLayout>
  </>
  );
}

export default BusinessCertificates;