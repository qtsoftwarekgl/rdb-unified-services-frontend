import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/inputs/Button";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center h-[95vh] w-full gap-4">
        <h1 className="text-primary font-semibold uppercase text-2xl">Page not found</h1>
        <Button value={<menu className="flex items-center gap-3">
            <FontAwesomeIcon icon={faHome} />
            Go to dashboard
        </menu>} route="/services" primary />
    </main>
  )
}

export default NotFound;
