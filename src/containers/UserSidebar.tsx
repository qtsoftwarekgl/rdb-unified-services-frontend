import {
  faBagShopping,
  faBars,
  faBook,
  faCertificate,
  faCommentDots,
  faGear,
  faHouse,
  faImage,
  faPen,
  faRightFromBracket,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { motion, useAnimation } from "framer-motion";
import rdb_logo from "/rdb-logo.png";
import rdb_icon from "/rdb-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/inputs/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../states/store";
import { toggleSidebar } from "../states/features/sidebarSlice";
import { useEffect, useRef, useState } from "react";

const UserSidebar = () => {
  const { pathname } = useLocation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  // GET SCREEN WIDTH
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setScreenWidth(ref.current.offsetWidth);
    }
  }, [ref]);

  // SIDEBAR NAVIGATION
  const sidebarNav = [
    {
      title: "Home",
      path: "/",
      icon: faHouse,
    },
    {
      title: "Register your business",
      path: "/business-registration",
      icon: faPen,
    },
    {
      title: "Edit your registered business",
      path: "/business-registration/edit",
      icon: faImage,
    },
    {
      title: "Amendments",
      path: "/business-registration/amendments",
      icon: faBook,
    },
    {
      title: "Certification of GSR",
      path: "/business-registration/certification",
      icon: faCommentDots,
    },
    {
      title: "Certitificates",
      path: "/certificates",
      icon: faCertificate,
    },
    {
      title: "Request for VAT Certificate",
      path: "/certificates/vat",
      icon: faBagShopping,
    },
    {
      title: "Search Company",
      path: "/searchcompany",
      icon: faSitemap,
    },
    {
      title: "My Profile",
      path: "/profile",
      icon: faGear,
    },
  ];

  // ANIMATION
  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();

  const showMore = () => {
    controls.start({
      width: "17vw",
      transition: { duration: 0.001 },
    });
    controlText.start({
      opacity: 1,
      display: "block",
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });
  };

  const showLess = () => {
    controls.start({
      width: "10vw",
      transition: { duration: 0.001 },
    });

    controlText.start({
      opacity: 0,
      display: "none",
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
        className="h-[95vh] w-full flex flex-col gap-8 items-center justify-between pl-[2vw] max-w-[350px] fixed left-0 py-6 max-[1200px]:w-[22vw] max-[1100px]:w-[25vw] max-[1000px]:w-[30vw] ease-in-out duration-500 max-[500px]:w-[30%]"
      >
        <figure
          className={`w-full flex items-center justify-between pr-2 ${
            isOpen ? "flex-row" : "flex-col gap-4"
          }`}
        >
          <img
            src={isOpen ? rdb_logo : rdb_icon}
            className={`h-auto ${isOpen ? "max-w-[100px]" : "max-w-[50px]"}`}
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
        <menu className="flex flex-col w-full h-full gap-2 mt-6">
          {sidebarNav?.map((nav, index) => {
            const selected = pathname === nav?.path;
            return (
              <Link
                to={nav?.path}
                key={index}
                className={`flex items-center gap-5 px-4 font-semibold text-[15px] ease-in-out duration-200 hover:bg-white text-secondary rounded-md py-3 max-[1200px]:text-[14px] max-[1000px]:text-[13px] ${
                  selected && "bg-white !text-primary"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                <FontAwesomeIcon
                  icon={nav?.icon}
                  className={` text-secondary font-bold ${
                    selected && "!text-primary"
                  } ${isOpen ? "text-[20px]" : "text-[16px]"}`}
                />
                {isOpen ? nav?.title : null}
              </Link>
            );
          })}
        </menu>
        <Button
          className={`w-full max-w-[90%]`}
          primary
          route="/auth/login"
          value={
            <menu
              className={`flex items-center w-full gap-4 ${
                isOpen ? "justify-start w-full" : "justify-center"
              }`}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              {isOpen ? "Logout" : null}
            </menu>
          }
        />
      </motion.div>
    </aside>
  );
};

export default UserSidebar;
