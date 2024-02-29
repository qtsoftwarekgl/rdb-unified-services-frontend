import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMoon } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../states/store";

const Navbar = () => {

    // STATE VARIABLES
    const { user } = useSelector((state: RootState) => state.user);

    const { pathname } = useLocation();

    if (['auth/login', 'auth/register'].includes(pathname)) {
        return null;
    }

return (
    <header className="w-[83%] left-[17%] mx-auto p-4 py-3 flex items-center h-[8vh] fixed top-0 justify-end z-[1000] bg-background">
            <nav className="flex items-center gap-4 self-end">
                    <FontAwesomeIcon className="text-[20px] cursor-pointer ease-in-out duration-200 hover:scale-[1.02]" icon={faMoon} />
                    <FontAwesomeIcon className="text-[20px] cursor-pointer ease-in-out duration-200 hover:scale-[1.02]" icon={faBell} />
                    <Link to={'#'} className="px-4">
                    <menu className="flex items-center justify-between gap-2 px-4 p-1 rounded-lg shadow-xs">
                            <figure className="overflow-hidden inline w-[2.7rem] h-[2.7rem] relative rounded-full">
                                    <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-full object-cover" />
                            </figure>

                            <article>
                                    <h1 className="text-[16px] font-semibold">Christella</h1>
                                    <p className="text-[12px] text-gray-500">{user?.email?.toLowerCase() || 'christella@qtglobal.rw'}</p>
                            </article>

                            <FontAwesomeIcon icon={faChevronDown} />
                    </menu>
                    </Link>
            </nav>
    </header>
)
}

export default Navbar;
