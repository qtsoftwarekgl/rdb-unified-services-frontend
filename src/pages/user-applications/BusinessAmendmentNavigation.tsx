import { useState } from 'react';
import { Link } from 'react-router-dom';

interface BusinessAmendmentNavigationProps {
  onSelectTab?: (tab: string) => void;
}

const BusinessAmendmentNavigation = ({
  onSelectTab,
}: BusinessAmendmentNavigationProps) => {
  // STATE VARIABLES
  const [activeTab, setActiveTab] = useState('request-summary');

  const navigationTabs = [
    {
      label: 'Request summary',
      slug: 'request-summary',
    },
    {
      label: 'Current details',
      slug: 'current-details',
    },
    {
      label: 'Proposed changes',
      slug: 'proposed-changes',
    },
    {
      label: 'Process history',
      slug: 'process-history',
    },
  ];

  return (
    <nav className="flex items-center gap-5 w-full my-4 border rounded-md shadow-md">
      {navigationTabs?.map((navigationTab, index) => {
        return (
          <Link
            key={index}
            className={`w-full text-[14px] font-semibold text-center p-2 rounded-md hover:bg-primary hover:text-white ${
              activeTab === navigationTab?.slug
                ? 'bg-primary text-white'
                : 'text-primary bg-white'
            }`}
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(navigationTab?.slug);
              onSelectTab && onSelectTab(navigationTab?.slug);
            }}
          >
            {navigationTab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default BusinessAmendmentNavigation;
