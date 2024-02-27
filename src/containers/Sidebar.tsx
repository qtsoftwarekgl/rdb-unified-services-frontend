import {
  faBagShopping,
  faBook,
  faCertificate,
  faCommentDots,
  faGear,
  faHouse,
  faImage,
  faPen,
  faRightFromBracket,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/inputs/Button';

const Sidebar = () => {
  const { pathname } = useLocation();

  // SIDEBAR NAVIGATION
  const sidebarNav = [
    {
      title: 'Home',
      path: '/',
      icon: faHouse,
    },
    {
      title: 'Register your business',
      path: '/business-registration',
      icon: faPen,
    },
    {
      title: 'Edit your registered business',
      path: '/business-registration/edit',
      icon: faImage,
    },
    {
      title: 'Amendments',
      path: '/business-registration/amendments',
      icon: faBook,
    },
    {
      title: 'Certification of GSR',
      path: '/business-registration/certification',
      icon: faCommentDots,
    },
    {
      title: 'Certitificates',
      path: '/certificates',
      icon: faCertificate,
    },
    {
      title: 'Request for VAT Certificate',
      path: '/certificates/vat',
      icon: faBagShopping,
    },
    {
      title: 'Search Company',
      path: '/search',
      icon: faSitemap,
    },
    {
      title: 'My Profile',
      path: '/profile',
      icon: faGear,
    },
  ];

  return (
    <aside className="flex flex-col gap-6 justify-between w-[17%] pl-[2.5%] max-w-[350px] h-[90vh] fixed top-[10vh] left-0 py-6">
      <menu className="w-full flex flex-col gap-2 h-full">
        {sidebarNav?.map((nav, index) => {
          const selected = pathname === nav?.path;
          return (
            <Link
              to={nav?.path}
              key={index}
              className={`flex items-center gap-5 px-4 font-semibold text-[15px] text-secondary rounded-md py-3 ${
                selected && 'bg-white !text-primary'
              }`}
            >
              <FontAwesomeIcon
                icon={nav?.icon}
                className={`text-[20px] text-secondary font-bold ${
                  selected && '!text-primary'
                }`}
              />
              {nav?.title}
            </Link>
          );
        })}
      </menu>
      <Button
        className="max-w-[90%]"
        primary
        route="/auth/login"
        value={
          <menu className="flex items-center gap-4">
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </menu>
        }
      />
    </aside>
  );
};

export default Sidebar;
