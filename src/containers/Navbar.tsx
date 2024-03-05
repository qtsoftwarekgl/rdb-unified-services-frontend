import { useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon, faUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import {
  faChevronDown,
  faChevronUp,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../states/store';
import { FC } from 'react';
import { toggleNavbar } from '../states/features/navbarSlice';

const Navbar = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { isOpen } = useSelector((state: RootState) => state.navbar);

  const { pathname } = useLocation();

  if (['auth/login', 'auth/register'].includes(pathname)) {
    return null;
  }

  // NAV DROPDOWN
  const navDropdown = [
    {
      title: 'Profile',
      link: '/profile',
      icon: faUser,
    },
    {
      title: 'Theme',
      link: '#',
      icon: faMoon,
    },
    {
      title: 'Notifications',
      link: '/notifications',
      icon: faBell,
    },
    {
      title: 'Logout',
      link: '/logout',
      icon: faRightFromBracket,
    },
  ];

  return (
    <header className="w-[83%] left-[17%] mx-auto p-4 py-3 flex items-center h-[8vh] fixed top-0 justify-end z-[1000] bg-background">
      <nav className="flex items-center gap-4 self-end max-[600px]:gap-3">
        <FontAwesomeIcon
          className="text-[20px] max-[450px]:hidden cursor-pointer ease-in-out duration-200 hover:scale-[1.02]"
          icon={faMoon}
        />
        <FontAwesomeIcon
          className="text-[20px] max-[450px]:hidden cursor-pointer ease-in-out duration-200 hover:scale-[1.02]"
          icon={faBell}
        />
        <Link to={'#'} className="px-4 max-[600px]:px-2">
          <menu
            className="flex items-center justify-between gap-2 px-4 p-1 rounded-lg shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              dispatch(toggleNavbar(!isOpen));
            }}
          >
            <figure className="overflow-hidden inline w-[2.7rem] h-[2.7rem] relative rounded-full">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="w-full h-full object-cover"
              />
            </figure>

            <article>
              <h1 className="text-[15px] font-semibold max-[600px]:text-[14px]">
                Christella
              </h1>
              <p className="text-[12px] text-gray-500">
                {user?.email?.toLowerCase() || 'christella@qtglobal.rw'}
              </p>
            </article>

            <FontAwesomeIcon
              className="ease-in-out duration-500"
              icon={isOpen ? faChevronUp : faChevronDown}
            />
          </menu>
        </Link>
      </nav>
      <NavDropdown isOpen={isOpen}>
        <menu className="flex flex-col gap-1 rounded-md">
          {navDropdown.map((nav, index) => {
            return (
              <Link
                to={nav?.link}
                key={index}
                className={`p-3 text-[14px] hover:bg-primary hover:text-white flex items-center gap-2 rounded-md ${
                  ['Theme', 'Notifications'].includes(nav?.title)
                    ? 'min-[450px]:hidden'
                    : 'flex'
                }`}
              >
                <FontAwesomeIcon className="text-[14px]" icon={nav?.icon} />
                {nav?.title}
              </Link>
            );
          })}
        </menu>
      </NavDropdown>
    </header>
  );
};

interface NavDropdownProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const NavDropdown: FC<NavDropdownProps> = ({ isOpen, children }) => {
  return (
    <menu
      className={`${
        isOpen ? 'translate-y-0' : 'translate-y-[-400px]'
      } ease-in-out duration-500 z-[10000] absolute top-[8vh] right-[2.5%] w-[220px] bg-white shadow-md rounded-md max-[450]:w-[100vw]`}
    >
      {children}
    </menu>
  );
};

export default Navbar;
