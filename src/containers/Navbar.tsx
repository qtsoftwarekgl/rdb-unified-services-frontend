import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {
  faChevronDown,
  faChevronUp,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../states/store";
import { FC, useState } from "react";
import rdb_logo from "/rdb-logo.png";
import { setLocale } from "../states/features/localeSlice";
import { ReviewComment } from "../components/applications-review/AddReviewComments";
import { setUser } from "@/states/features/userSlice";

interface Props {
  className?: string;
}

const Navbar = ({ className }: Props) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { locale } = useSelector((state: RootState) => state.locale);
  const [isOpen, setIsOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );

  const unresolvedComments = applicationReviewComments.filter(
    (comment: ReviewComment) => !comment.checked
  ).length;

  if (["auth/login", "auth/register"].includes(pathname)) {
    return null;
  }

  // NAV DROPDOWN
  const navDropdown = [
    {
      title: "Profile",
      link: "/user-profile",
      icon: faUser,
    },
    {
      title: "Notifications",
      link: "/notifications",
      icon: faBell,
    },
    {
      title: "Logout",
      link: "/auth/login",
      icon: faRightFromBracket,
    },
  ];

  const languageIcons = [
    {
      value: "en",
      icon: "🇺🇸",
    },
    {
      value: "fr",
      icon: "🇫🇷",
    },
    {
      value: "rw",
      icon: "🇷🇼",
    },
  ];

  return (
    <header
      className={`w-[83%] left-[17%] mx-auto px-4 py-3 flex items-center h-[10vh] fixed top-0 ${
        !["/services"].includes(pathname)
          ? "justify-end px-14"
          : "justify-between"
      }  z-[1000] bg-background ${className}`}
    >
      <figure
        className={`${
          !["/services"].includes(pathname) && "hidden"
        } relative rounded-full w-full max-w-[10%]`}
      >
        <img src={rdb_logo} className="w-fit" />
      </figure>
      <nav className="flex items-center gap-4 self-end max-[600px]:gap-3">
        {!/info|admin/.test(user.email) && (
          <Link
            to="/services"
            className="w-full text-primary font-normal p-1 px-4 rounded-full text-[16px] hover:underline"
          >
            Services
          </Link>
        )}
        {unresolvedComments > 0 && !/info|admin/.test(user.email) && (
          <Link to="/user-applications" className="relative">
            <FontAwesomeIcon
              className=" bg-tertiary p-2 h-4 text-white rounded-md cursor-pointer ease-in-out duration-200 hover:scale-[1.02]"
              icon={faBell}
            />
            <div className="absolute p-2 text-white text-[9px] flex justify-center items-center top-[-5px] cursor-pointer w-3 h-3 bg-red-500 rounded-full right-[-3px]">
              {unresolvedComments}
            </div>
          </Link>
        )}
        <Link to={"#"} className="px-4 max-[600px]:px-2">
          <menu
            className="flex items-center justify-between gap-2 p-1 px-4 rounded-lg shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <article>
              <h1 className="text-[15px] font-semibold max-[600px]:text-[14px]">
                {user?.firstName} {user?.lastName || ""}
              </h1>
              <p className="text-[12px] text-gray-500">
                {user?.username?.toLowerCase()}
              </p>
            </article>

            <FontAwesomeIcon
              className="duration-500 ease-in-out"
              icon={isOpen ? faChevronUp : faChevronDown}
            />
          </menu>
        </Link>
        <menu className="flex items-center w-full">
          <select
            className="p-1 bg-transparent text-[13px] rounded-md shadow-sm cursor-pointer ease-in-out duration-200 hover:scale-[1.01]"
            onChange={(e) => {
              dispatch(setLocale(e?.target?.value));
            }}
            defaultValue={locale || "en"}
          >
            {languageIcons.map((language, index) => {
              return (
                <option key={index} value={language?.value}>
                  {`${language?.value?.toUpperCase()} ${language?.icon}`}
                </option>
              );
            })}
          </select>
        </menu>
      </nav>
      <NavDropdown isOpen={isOpen}>
        <menu className="flex flex-col gap-1 rounded-md">
          {navDropdown.map((nav, index, arr) => {
            return (
              <Link
                to={nav?.link}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  if (nav?.title === "Logout") dispatch(setUser({}));
                  navigate(`${nav?.link}`);
                  setIsOpen(false);
                }}
                className={`p-3 text-[14px] hover:bg-primary hover:text-white flex items-center gap-2 ${
                  ["Theme", "Notifications"].includes(nav?.title)
                    ? "min-[450px]:hidden"
                    : "flex"
                } ${index === 0 && "rounded-t-md"} ${
                  index === arr.length - 1 && "rounded-b-md"
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
        isOpen ? "translate-y-0" : "translate-y-[-400px]"
      } ease-in-out duration-500 z-[10000] absolute top-[12vh] right-[8%] w-[250px] bg-white shadow-md rounded-md max-[450]:w-[100vw]`}
    >
      {children}
    </menu>
  );
};

export default Navbar;
