import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../states/store";
import rdb_logo from "/rdb-logo.png";
import { languages } from "../../constants/Authentication";
import { setLocale } from "../../states/features/localeSlice";

const HomeNav = () => {
  // STATE VARIABLES

  const dispatch: AppDispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);

  return (
    <header
      className={`mx-auto w-full p-4 py-3 flex items-center h-[10vh] fixed top-0  z-[1000] bg-background`}
    >
      <nav className="flex justify-between w-full ">
        <div>
          <img className="max-w-[150px]" src={rdb_logo} />
        </div>

        <div className="flex items-center justify-around">
          <Link
            to="/auth/login"
            className="flex items-center justify-center mr-4"
          >
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              icon={faRightToBracket}
              className="mr-2 w-7 h-7"
            />
            <span className="hidden md:block">Log In</span>
          </Link>
          <Link
            to="/auth/register"
            className="flex items-center justify-center mr-4"
          >
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              icon={faUser}
              className="w-8 h-8 mr-2"
            />
            <span className="hidden md:block">Create Account</span>
          </Link>
          <menu className="flex">
            <img
              src={`/public/languageIcons/${locale}.png`}
              className="bg-red-200 rounded-full w-7 h-7"
            />
            <select
              className="text-black bg-transparent accent-primary"
              onChange={(e) => {
                dispatch(setLocale(e.target.value));
              }}
              defaultValue={locale || "en"}
            >
              {languages.map((language, index) => {
                return (
                  <option
                    className="w-full text-primary"
                    key={index}
                    value={language.value}
                  >
                    {language.label}
                  </option>
                );
              })}
            </select>
          </menu>
        </div>
      </nav>
    </header>
  );
};

export default HomeNav;
