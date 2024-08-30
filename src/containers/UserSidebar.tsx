import {
  faBars,
  faGear,
  faFileLines,
  faUserTie,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { motion, useAnimation } from 'framer-motion';
import rdb_logo from '/rdb-logo.png';
import rdb_icon from '/rdb-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../states/store';
import { toggleSidebar } from '../states/features/sidebarSlice';
import { useEffect, useRef, useState } from 'react';

const UserSidebar = () => {
  const { pathname } = useLocation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  // GET SCREEN WIDTH
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setScreenWidth(ref.current.offsetWidth);
    }
  }, [ref]);

  const defaultUserSideBar = [
    {
      title: 'My Profile',
      path: '/user/profile',
      icon: faGear,
    },
    {
      title: 'Applications',
      path: '#',
      icon: faFileLines,
      subcategories: [
        {
          title: 'Business Applications',
          path: '/user/business/applications',
          icon: faUserTie,
        },
      ],
    },
  ];

  // ANIMATION
  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();

  const showMore = () => {
    controls.start({
      width: '17vw',
      transition: { duration: 0.001 },
    });
    controlText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });
  };

  const showLess = () => {
    controls.start({
      width: '10vw',
      transition: { duration: 0.001 },
    });

    controlText.start({
      opacity: 0,
      display: 'none',
    });

    controlTitleText.start({
      opacity: 0,
    });
  };

  useEffect(() => {
    if (isOpen) {
      showMore();
    } else {
      showLess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (screenWidth) {
      if (screenWidth > 900) {
        showMore();
        dispatch(toggleSidebar(true));
      } else {
        showLess();
        dispatch(toggleSidebar(!isOpen));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, screenWidth]);

  return (
    <aside className={``} ref={ref}>
      <motion.div
        animate={controls}
        className="h-[95vh] flex flex-col gap-8 items-center justify-between pl-[2vw] max-w-[350px] fixed left-0 py-6 max-[1200px]:w-[22vw] max-[1100px]:w-[25vw] max-[1000px]:w-[30vw] ease-in-out duration-500 max-[500px]:w-[30%]"
      >
        <figure
          className={`w-full flex items-center justify-between pr-2 ${
            isOpen ? 'flex-row' : 'flex-col gap-4'
          }`}
        >
          <img
            src={isOpen ? rdb_logo : rdb_icon}
            className={`h-auto ${isOpen ? 'max-w-[150px]' : 'max-w-[50px]'}`}
            alt="logo"
          />
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault();
              dispatch(toggleSidebar(!isOpen));
            }}
            className="p-2 rounded-full bg-primary px-[9px] text-white text-[16px] cursor-pointer ease-in-out duration-150 hover:scale-[1.01]"
            icon={faBars}
          />
        </figure>
        <ul className="flex flex-col w-full h-full gap-2 pt-5">
          {defaultUserSideBar?.map((nav, index) => {
            const selected = pathname === nav?.path;
            return (
              <li key={index}>
                <Link
                  to={nav?.path}
                  className={`flex items-center gap-5 px-4 font-semibold text-[15px] ease-in-out duration-200 hover:bg-white text-secondary rounded-md py-3 ${
                    selected && 'bg-white !text-primary'
                  } ${isOpen ? 'justify-start' : 'justify-center'}`}
                  onClick={(e) => {
                    if (nav?.subcategories) {
                      e.preventDefault();
                      setIsApplicationsOpen(!isApplicationsOpen);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={nav?.icon}
                    className={`text-secondary font-bold ${
                      selected && '!text-primary'
                    } ${isOpen ? 'text-[20px]' : 'text-[16px]'}`}
                  />
                  {isOpen ? nav?.title : null}
                  {nav.subcategories && isOpen && (
                    <FontAwesomeIcon
                      icon={isApplicationsOpen ? faChevronUp : faChevronDown}
                      className="ml-auto"
                    />
                  )}
                </Link>
                {nav.subcategories && isOpen && isApplicationsOpen && (
                  <ul className="p-2">
                    {nav.subcategories.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={sub.path}
                          className={`flex items-center gap-5 px-4 font-semibold text-[14px] ease-in-out duration-200 hover:bg-white text-secondary rounded-md py-3 ${
                            pathname === sub.path && 'bg-white !text-primary'
                          } ${isOpen ? 'justify-start' : 'justify-center'}`}
                        >
                          <FontAwesomeIcon
                            icon={sub.icon}
                            className={`text-secondary font-bold ${
                              pathname === sub.path && '!text-primary'
                            } ${isOpen ? 'text-[18px]' : 'text-[14px]'}`}
                          />
                          {isOpen ? sub.title : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </aside>
  );
};

export default UserSidebar;
