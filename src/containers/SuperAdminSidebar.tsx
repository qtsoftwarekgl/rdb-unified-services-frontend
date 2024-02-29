import {
    faBagShopping,
    faBook,
    faHouse,
    faPen,
    faRightFromBracket,
  } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { Link, useLocation } from 'react-router-dom';
  import Button from '../components/inputs/Button';
  
  const SuperAdminSidebar = () => {
    const { pathname } = useLocation();
  
    // SIDEBAR NAVIGATION
    const sidebarNav = [
      {
        title: 'Dashboard',
        path: '/admin/dashboard',
        icon: faHouse,
      },
      {
        title: 'Users',
        path: '/admin/users',
        icon: faPen,
      },
      {
        title: 'Roles',
        path: '/admin/roles',
        icon: faBagShopping,
      },
      {
        title: 'My Profile',
        path: '/profile',
        icon: faBook,
      }
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
  
  export default SuperAdminSidebar;
  