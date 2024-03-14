import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import { languages } from '../../constants/authentication';
import rdb_logo from '/rdb-logo.png';
import { faBars, faRightFromBracket, faX } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setLocale } from '../../states/features/localeSlice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegistrationNavbar = () => {

  // LOCALES
  const { t } = useTranslation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const [navDropdown, setNavDropdown] = useState(false);

  return (
    <header className="h-[10vh] bg-white flex items-center w-full mx-auto justify-between px-8">
      <nav className="flex items-center justify-between gap-3 w-[95%] mx-auto">
        <Link to={'/auth/login'} className="flex items-center gap-6 justify-between max-[800px]:flex-col-reverse">
          <img
            src={rdb_logo}
            alt="RDB Logo"
            className="mx-auto h-full w-auto max-w-[200px]"
          />
        </Link>
        <menu className="flex items-center gap-6 justify-between max-sm:hidden">
          <Button
            styled={false}
            route='/auth/login'
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRightFromBracket} />
                {t('login')}
              </menu>
            }
          />
          <select
            className=""
            defaultValue={locale || 'en'}
            onChange={(e) => {
              dispatch(setLocale(e.target.value));
            }}
          >
            {languages.map((language, index) => {
              return (
                <option className="w-full" key={index} value={language.value}>
                  {language.label}
                </option>
              );
            })}
          </select>
        </menu>
        <FontAwesomeIcon icon={faBars} className={`sm:hidden text-[20px] bg-primary text-white p-2 px-[9px] rounded-full`} onClick={(e) => {
          e.preventDefault();
          setNavDropdown(!navDropdown);
        }} />
        <NavDropdown isOpen={navDropdown} />
      </nav>
    </header>
  );
};

interface NavDropdownProps {
  isOpen: boolean;
}

export const NavDropdown: FC<NavDropdownProps> = ({ isOpen }) => {
  return (
    <menu
      className={`flex flex-col gap-2 w-[80%] mx-auto absolute top-[11vh] right-0 left-0 ease-in-out duration-500 bg-white p-4 rounded-md shadow-md ${
        isOpen ? 'translate-y-0' : 'translate-y-[-300px]'
      }`}
    >
      <Button
        styled={false}
        value={
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon icon={faRightFromBracket} />
            Login
          </menu>
        }
      />
      <select className="w-full">
        {languages.map((language, index) => {
          return (
            <option className="w-full" key={index} value={language.value}>
              {language.label}
            </option>
          );
        })}
      </select>
    </menu>
  );
};

export default RegistrationNavbar;
