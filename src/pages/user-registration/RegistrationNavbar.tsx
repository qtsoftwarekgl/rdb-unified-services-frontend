import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import { languages } from '../../constants/Authentication';
import rdb_logo from '/rdb-logo.png';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const RegistrationNavbar = () => {
  return (
    <header className="h-[10vh] bg-white flex items-center w-full mx-auto justify-between px-8">
      <nav className="flex items-center justify-between gap-3 w-[95%] mx-auto">
        <figure className="flex items-center gap-6 justify-between max-[800px]:flex-col-reverse">
          <img
            src={rdb_logo}
            alt="RDB Logo"
            className="mx-auto h-full w-auto max-w-[200px]"
          />
        </figure>
        <menu className="flex items-center gap-6 justify-between">
          <Button
            styled={false}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRightFromBracket} />
                Login
              </menu>
            }
          />
          <select className="">
            {languages.map((language, index) => {
              return (
                <option className="w-full" key={index} value={language.value}>
                  {language.label}
                </option>
              );
            })}
          </select>
        </menu>
      </nav>
    </header>
  );
};

export default RegistrationNavbar;
